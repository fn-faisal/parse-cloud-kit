
export const authGuardMetadataKey = Symbol('auth-guard');

type RequireAuthParams = {
    
}

export const RequireAuth = <T>(params?: RequireAuthParams) => 
    (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => {
        Reflect.defineMetadata(authGuardMetadataKey, true, target[propertyKey]);
}