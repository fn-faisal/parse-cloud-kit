import { validate } from "class-validator";
import { ParamType, SkipIfMaster } from "../decorators";
import { parseCurrentUserMetadataKey, parseObjectMetadataKey, parseRequestMetadataKey, parseRequestParamsMetadataKey } from "../symbols";

export const getCallback = (f: { propertyKey: string }, resolvedHandler) => async (req: any) => {
    if ( 
        Reflect.hasMetadata(SkipIfMaster, resolvedHandler, f.propertyKey)
        && req.master
        
    ) {
        return;            
    }
    const args: unknown[] = [];
    // req.
    if ( Reflect.hasMetadata(parseRequestMetadataKey, resolvedHandler, f.propertyKey) ) {
        const reqMeta: number = Reflect.getMetadata(parseRequestMetadataKey, resolvedHandler, f.propertyKey);
        args[reqMeta] = req
    }

    // params.
    if ( Reflect.hasMetadata(parseRequestParamsMetadataKey, resolvedHandler, f.propertyKey) ) {
        const paramMeta: ParamType = Reflect.getMetadata(parseRequestParamsMetadataKey, resolvedHandler, f.propertyKey);

        args[paramMeta.propertyIndex] = req.params;
        
        const validation = new paramMeta.type();

        Object.keys(req.params)?.map(
            param => {
                validation[param] = req.params[param];
            }
        )
        const errors = await validate(validation);
        
        if ( errors.length > 0 ) {
            const formattedErrors = errors.map(error => ({
                field: error.property,
                // @ts-expect-error error
                messages: Object.values(error.constraints)
            }))
            throw new Parse.Error(Parse.Error.VALIDATION_ERROR, JSON.stringify(formattedErrors));
        }
    }

    // user.
    if ( Reflect.hasMetadata(parseCurrentUserMetadataKey, resolvedHandler, f.propertyKey) ) {
        const paramMeta: ParamType = Reflect.getMetadata(parseCurrentUserMetadataKey, resolvedHandler, f.propertyKey);
        args[paramMeta.propertyIndex] = req.user;
    }

    // object.
    if ( Reflect.hasMetadata(parseObjectMetadataKey, resolvedHandler, f.propertyKey) ) {
        const paramMeta: ParamType = Reflect.getMetadata(parseObjectMetadataKey, resolvedHandler, f.propertyKey);
        args[paramMeta.propertyIndex] = req.object;
    }

    return resolvedHandler[f.propertyKey](...args);
}
