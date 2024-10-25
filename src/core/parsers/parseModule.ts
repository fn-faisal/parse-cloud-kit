import { handlersMetadataKey } from "../../symbols";
import { FunctionItem, JobItem, TriggerItem, UnknownClass } from "../../types";
import { registerUnique } from "../utils/module/registerUnique";
import { parseHandler } from "./parseHandler";


export function parseModule (
    module: UnknownClass, 
    jobs: JobItem[],
    functions: FunctionItem[],
    triggers: TriggerItem[]
) {
    const handlers = Reflect.getMetadata(handlersMetadataKey, module);
    handlers?.map( (handler: UnknownClass) => {
        const [ functionsToRegister, triggersToRegister, jobsToRegister ] = parseHandler(handler);
            
        // register jobs.
        registerUnique<JobItem>( jobs, jobsToRegister, 
            (ftr, f) => f.propertyKey === ftr.propertyKey, 
            j => `Trying to register multiple jobs with same name. ${j.propertyKey}`
        );
        
        // register functions.
        registerUnique<FunctionItem>( functions, functionsToRegister, 
            (ftr, f) => f.propertyKey === ftr.propertyKey, 
            j => `Trying to register multiple functions with same name. ${j.propertyKey}`
        );

        // register functions.
        registerUnique<TriggerItem>(triggers, triggersToRegister,
            (ftr, f) => f.className === ftr.className && f.type === ftr.type,
            t => `Trying to register multiple triggers for same class. ${t.className}`
        );
    });
}