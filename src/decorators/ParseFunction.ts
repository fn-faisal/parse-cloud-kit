import { validationMetadataKey } from "../symbols/validationMetadataKey";

export const functionsMetadataKey = Symbol('functions');

type FunctionParams = {
    validation?: Parse.Cloud.Validator
}

export const ParseFunction = <T>(params?: FunctionParams) => 
    (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => {
        // existing function.
        const functions = Reflect.getMetadata(functionsMetadataKey, target) || [];
        functions.push({
            propertyKey,
        });
        Reflect.defineMetadata(functionsMetadataKey, functions, target);
        if ( params ) {
            if (params.validation) {
                Reflect.defineMetadata(validationMetadataKey, params.validation, target[propertyKey]);
            }
        }
}