import { masterGuardMetadataKey } from "../symbols";

type RequireMasterParams = {
    
}

export const RequireMaster = <T>(params?: RequireMasterParams) => 
    (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => {
        Reflect.defineMetadata(masterGuardMetadataKey, true, target[propertyKey]);
}