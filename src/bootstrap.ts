import "reflect-metadata";
import { container } from "tsyringe";
import { SkipIfMaster, Triggers, ParamType } from "./decorators";
import { validationMetadataKey, parseCurrentUserMetadataKey, parseRequestParamsMetadataKey, 
    parseRequestMetadataKey, parseObjectMetadataKey, authGuardMetadataKey, masterGuardMetadataKey,
    functionsMetadataKey, parseCloudJobMetadataKey, triggersMetadataKey } from "./symbols";
import { validate } from 'class-validator';
import { FunctionItem, JobItem, ParseObjectPolicies, TriggerItem, UnknownClass } from "./types";

function parseHandler(handler: UnknownClass): [ FunctionItem[], TriggerItem[], JobItem[] ] {
    const triggersToRegister: TriggerItem[] = [];
    const functionsToRegister: FunctionItem[] = [];
    const jobsToRegister: JobItem[] = [];
    const resolvedHandler: any = container.resolve(handler);

    const getValidations = (f: { propertyKey: string }) => {
        const validation = Reflect.getMetadata(validationMetadataKey, resolvedHandler[f.propertyKey]) || {};
        if(Reflect.hasMetadata(authGuardMetadataKey, resolvedHandler[f.propertyKey])) {
            validation.requireUser = true;
        }
        if(Reflect.hasMetadata(masterGuardMetadataKey, resolvedHandler[f.propertyKey])) {
            validation.requireMaster = true;
        }
        return validation;
    }

    const getCallback = (f: { propertyKey: string }) => async (req: any) => {
        if ( 
            Reflect.hasMetadata(SkipIfMaster, resolvedHandler, f.propertyKey)
            && req.master
            
        ) {
            return;            
        }
        const args: unknown[] = [];
        // req.
        if ( Reflect.hasMetadata(parseRequestMetadataKey, resolvedHandler, f.propertyKey) ) {
            const reqMeta: number = Reflect.getMetadata(parseRequestMetadataKey, resolvedHandler, f.propertyKey);
            args[reqMeta] = req
        }

        // params.
        if ( Reflect.hasMetadata(parseRequestParamsMetadataKey, resolvedHandler, f.propertyKey) ) {
            const paramMeta: ParamType = Reflect.getMetadata(parseRequestParamsMetadataKey, resolvedHandler, f.propertyKey);

            args[paramMeta.propertyIndex] = req.params;
            
            const validation = new paramMeta.type();

            Object.keys(req.params)?.map(
                param => {
                    validation[param] = req.params[param];
                }
            )
            const errors = await validate(validation);
            
            if ( errors.length > 0 ) {
                const formattedErrors = errors.map(error => ({
                    field: error.property,
                    // @ts-expect-error error
                    messages: Object.values(error.constraints)
                }))
                throw new Parse.Error(Parse.Error.VALIDATION_ERROR, JSON.stringify(formattedErrors));
            }
        }

        // user.
        if ( Reflect.hasMetadata(parseCurrentUserMetadataKey, resolvedHandler, f.propertyKey) ) {
            const paramMeta: ParamType = Reflect.getMetadata(parseCurrentUserMetadataKey, resolvedHandler, f.propertyKey);
            args[paramMeta.propertyIndex] = req.user;
        }

        // object.
        if ( Reflect.hasMetadata(parseObjectMetadataKey, resolvedHandler, f.propertyKey) ) {
            const paramMeta: ParamType = Reflect.getMetadata(parseObjectMetadataKey, resolvedHandler, f.propertyKey);
            args[paramMeta.propertyIndex] = req.object;
        }

        return resolvedHandler[f.propertyKey](...args);
    }

    // functions.
    const functions = Reflect.getMetadata(functionsMetadataKey, resolvedHandler) || [];
    functions.map(
        (f: { propertyKey: string }) => {
            const validation = getValidations(f);
            // Parse.Cloud.define(f.propertyKey, getCallback(f), validation);
            functionsToRegister.push({
                propertyKey: f.propertyKey, 
                callback: getCallback(f), 
                validation
            })
        }
    );

    // jobs.
    const jobs = Reflect.getMetadata(parseCloudJobMetadataKey, resolvedHandler) || [];
    jobs.map(
        (f: { propertyKey: string }) => {
            const validation = getValidations(f);
            // Parse.Cloud.define(f.propertyKey, getCallback(f), validation);
            jobsToRegister.push({
                propertyKey: f.propertyKey, 
                callback: getCallback(f), 
                validation
            })
        }
    );

    // triggers.
    const trigger: [] = Reflect.getMetadata(triggersMetadataKey, resolvedHandler) || [];
    trigger.map(
        (f: { propertyKey: string, type: Triggers, className: string }) => {
            const validation = getValidations(f);
            // Parse.Cloud[f.type](f.className, getCallback(f), validation);
            triggersToRegister.push({
                type: f.type,
                className: f.className, 
                callback: getCallback(f), 
                validation
            })
        }
    );

    return [functionsToRegister, triggersToRegister, jobsToRegister]
}

const triggerPolicyMap = {
    beforeSave: 'write',
    afterFind: 'read',
    beforeDelete: 'delete'
}

const policyTriggerMap = {
    write: 'beforeSave',
    read: 'afterFind',
    delete: 'beforeDelete'
}

const filterCheck = async (req: any, check: (user: Parse.User, object: Parse.Object) => boolean | Promise<boolean>) => {
    const filtered: unknown[] = [];
    for(const object of req.objects) {
        if ( await check(req.user, object) ) {
            filtered.push(object);
        }
    }
    return filtered;
}

export default async function bootstrapCloudCode(modules: UnknownClass[], policies: ParseObjectPolicies = {}) {
    const registeredPolicies: { [key:string]: ('read' | 'write' | 'delete')[] } = {};
    const schemas = await Parse.Schema.all();
    
    const jobs: FunctionItem[] = [];
    const functions: FunctionItem[] = [];
    const triggers: TriggerItem[] = [];

    modules.map(module => {
        // handlers.
        const handlers = Reflect.getMetadata('handlers', module);
        handlers?.map( (handler: UnknownClass) => {
            const [ functionsToRegister, triggersToRegister, jobsToRegister ] = parseHandler(handler);
            
            // register jobs.
            const foundJobs = functions.find(f => 
                jobsToRegister
                    .find(ftr => f.propertyKey === ftr.propertyKey) !== undefined
            );
    
            if ( foundJobs )
                throw new Error(`Trying to register multiple functions with same name. ${foundJobs.propertyKey}`);

            // register functions.
            jobsToRegister.map( f => jobs.push(f) );

            // register functions.
            const foundFunction = functions.find(f => 
                functionsToRegister
                    .find(ftr => f.propertyKey === ftr.propertyKey) !== undefined
            );

            if ( foundFunction )
                throw new Error(`Trying to register multiple functions with same name. ${foundFunction.propertyKey}`);

            // register functions.
            functionsToRegister.map( f => functions.push(f) );


            // register functions.
            const foundTrigger = triggers.find(f => 
                triggersToRegister
                    .find(ftr => f.className === ftr.className && f.type === ftr.type) !== undefined
            );

            if ( foundTrigger )
                throw new Error(`Trying to register multiple triggers for same class. ${foundTrigger.className}`);

            // register functions.
            triggersToRegister.map( f => triggers.push(f) );
        });
    });

    // register jobs.
    jobs.map( j => {
        // @ts-expect-error callback error
        Parse.Cloud.job(j.propertyKey, j.callback);
    });

    // register functions.
    functions.map( f => {
        Parse.Cloud.define(f.propertyKey, f.callback, f.validation);
    });

    // register triggers.
    triggers.map(t => {
        const callback = async (...args: unknown[]) => {
            const req: any = args[0];
            if (!req.master && t.className && policies[t.className]
                && ['beforeSave', 'afterFind', 'beforeDelete'].includes(t.type) ) {
                await (async () => {
                    const policy = policies[t.className];
                    const check = policy[triggerPolicyMap[t.type]];
                    // for single object.
                    if ( req.object && !(await check(req.user, req.object)) ) {
                        throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, "Unauthorized");
                    }
                    // for multiple objects.
                    if ( req.objects ) {
                        req.objects = await filterCheck(req, check);
                    }
                })();
            }
            await t.callback(...args);
        }
        if (policies[t.className] && ['beforeSave', 'afterFind', 'beforeDelete'].includes(t.type)) {
            registeredPolicies[t.className] = triggerPolicyMap[t.type];

        }
    
        Parse.Cloud[t.type](t.className, callback, t.validation);
    });

    schemas.map((s) => {
        ['read', 'write', 'delete'].map((t: string) => {
            if (
                policies[s.className] &&
                policies[s.className].read &&
                !(registeredPolicies[s.className] || []).includes(t as 'read' | 'write' | 'delete')
            ) {
                Parse.Cloud[policyTriggerMap[t]](
                    s.className,
                    async (req) => {
                        if (req.master) return;
                        const check = policies[s.className].read;
                        if ( !check ) return;
                        // for single object.
                        if ( req.object && !(await check(req.user, req.object)) ) {
                            throw new Parse.Error(Parse.Error.OPERATION_FORBIDDEN, "Unauthorized");
                        }
                        // for multiple objects.
                        if ( req.objects ) {
                            req.objects = await filterCheck(req, check);
                        }
                    }
                );
            }
                
        });
    });

}