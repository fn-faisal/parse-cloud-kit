import { authGuardMetadataKey, masterGuardMetadataKey, validationMetadataKey } from "../../symbols";

export const getValidations = (handlerProperty) => {
    const validation = Reflect.getMetadata(validationMetadataKey, handlerProperty) || {};
    if(Reflect.hasMetadata(authGuardMetadataKey, handlerProperty)) {
        validation.requireUser = true;
    }
    if(Reflect.hasMetadata(masterGuardMetadataKey, handlerProperty)) {
        validation.requireMaster = true;
    }
    return validation;
}