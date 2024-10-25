import "reflect-metadata";
import { FunctionItem, TriggerItem, UnknownClass } from "./types";
import { parseHandler } from "./core/parsers/parseHandlers";

export default async function bootstrapCloudCode(modules: UnknownClass[]) {
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
            await t.callback(...args);
        }
    
        Parse.Cloud[t.type](t.className, callback, t.validation);
    });
}