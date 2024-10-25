import { parseCloudJobMetadataKey } from "../../symbols";
import { JobItem } from "../../types";
import { getCallback } from "./getCallback";
import { getValidations } from "./getValidations";

export const getJobsToRegister = (resolvedHandler): JobItem[]  => {
    const jobs = Reflect.getMetadata(parseCloudJobMetadataKey, resolvedHandler) || [];
    return jobs.map(
        (f: { propertyKey: string }) => 
            ({
                propertyKey: f.propertyKey, 
                callback: getCallback(f, resolvedHandler), 
                validation: getValidations(resolvedHandler[f.propertyKey])
            })
        
    );
}