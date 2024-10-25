import { validate } from "class-validator";
import { ParamType, SkipIfMaster, Triggers } from "../decorators";
import { authGuardMetadataKey, functionsMetadataKey, masterGuardMetadataKey, parseCloudJobMetadataKey, parseCurrentUserMetadataKey, parseObjectMetadataKey, parseRequestMetadataKey, parseRequestParamsMetadataKey, triggersMetadataKey, validationMetadataKey } from "../symbols";
import { FunctionItem, JobItem, TriggerItem, UnknownClass } from "../types";
import { container } from "tsyringe";

export function parseHandler(handler: UnknownClass): [ FunctionItem[], TriggerItem[], JobItem[] ] {
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
