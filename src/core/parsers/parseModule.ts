import { handlersMetadataKey } from "../../symbols";
import { FunctionItem, JobItem, TriggerItem, UnknownClass } from "../../types";
import { parseHandler } from "./parseHandler";


export function parseModule (
    module: UnknownClass, 
    jobs: FunctionItem[],
    functions: FunctionItem[],
    triggers: TriggerItem[]
) {
    const handlers = Reflect.getMetadata(handlersMetadataKey, module);
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
}