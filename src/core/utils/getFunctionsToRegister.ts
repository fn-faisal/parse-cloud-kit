import { functionsMetadataKey } from "../../symbols";
import { FunctionItem } from "../../types";
import { getCallback } from "./getCallback";
import { getValidations } from "./getValidations";

export const getFunctionsToRegister = (resolvedHandler): FunctionItem[] => {
    const functions = Reflect.getMetadata(functionsMetadataKey, resolvedHandler) || [];
    return functions.map(
        (f: { propertyKey: string }) => 
            ({
                propertyKey: f.propertyKey, 
                callback: getCallback(f, resolvedHandler), 
                validation: getValidations(resolvedHandler[f.propertyKey])
            })
        
    );
}