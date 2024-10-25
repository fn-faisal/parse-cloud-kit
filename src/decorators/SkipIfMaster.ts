
export const skipIfMasterMetadataKey = Symbol('skip-if-master');

type SkipIfMasterParams = {
    
}

export const SkipIfMaster = <T>(params?: SkipIfMasterParams) => 
    (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => {
        Reflect.defineMetadata(skipIfMasterMetadataKey, true, target[propertyKey]);
}