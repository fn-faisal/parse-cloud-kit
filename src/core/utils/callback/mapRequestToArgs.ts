import { parseRequestMetadataKey } from "../../../symbols";

export const mapRequestToArgs = ( args: unknown[], resolvedHandler, propertyKey, req ) => {
    if ( Reflect.hasMetadata(parseRequestMetadataKey, resolvedHandler, propertyKey) ) {
        const reqMeta: number = Reflect.getMetadata(parseRequestMetadataKey, resolvedHandler, propertyKey);
        args[reqMeta] = req
    }
}