
export const masterGuardMetadataKey = Symbol('master-guard');

type RequireMasterParams = {
    
}

export const RequireMaster = <T>(params?: RequireMasterParams) => 
    (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => {
        Reflect.defineMetadata(masterGuardMetadataKey, true, target[propertyKey]);
}