import { parseCloudJobMetadataKey } from "../symbols";

type JobParams = {
    validation?: Parse.Cloud.Validator
}

export const ParseJob = <T>(params?: JobParams) => 
    (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => {
        // existing function.
        const functions = Reflect.getMetadata(parseCloudJobMetadataKey, target) || [];
        functions.push({
            propertyKey,
        });
        Reflect.defineMetadata(parseCloudJobMetadataKey, functions, target);
        if ( params ) {
            if (params.validation) {
                Reflect.defineMetadata(parseCloudJobMetadataKey, params.validation, target[propertyKey]);
            }
        }
}