import { SkipIfMaster } from "../../../decorators";

export const skipMaster = (resolvedHandler, propertyKey, req): boolean => 
    Reflect.hasMetadata(SkipIfMaster, resolvedHandler, propertyKey)
        && req.master