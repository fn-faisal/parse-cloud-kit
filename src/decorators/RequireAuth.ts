import { authGuardMetadataKey } from "../symbols";

type RequireAuthParams = {
    
}

export const RequireAuth = <T>(params?: RequireAuthParams) => 
    (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => {
        Reflect.defineMetadata(authGuardMetadataKey, true, target[propertyKey]);
}