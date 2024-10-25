import { mapRequestToArgs } from "./callback/mapRequestToArgs";
import { mapParamsToArgs } from "./callback/mapParamsToArgs";
import { mapUserToArgs } from "./callback/mapUserToArgs";
import { mapParseObjectToArgs } from "./callback/mapParseObjectToArgs";
import { skipMaster } from "./callback/skipMaster";

export const getCallback = (f: { propertyKey: string }, resolvedHandler) => async (req: any) => {
    if ( skipMaster(resolvedHandler, f.propertyKey, req) ) {
        return;
    }

    const args: unknown[] = [];

    // req.
    mapRequestToArgs( args, resolvedHandler, f.propertyKey, req );

    // params.
    mapParamsToArgs( args, resolvedHandler, f.propertyKey, req );

    // user.
    mapUserToArgs( args, resolvedHandler, f.propertyKey, req );

    // object.
    mapParseObjectToArgs( args, resolvedHandler, f.propertyKey, req );

    return resolvedHandler[f.propertyKey](...args);
}
