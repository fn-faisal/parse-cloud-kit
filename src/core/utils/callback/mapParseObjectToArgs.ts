import { ParamType } from "../../../decorators";
import { parseObjectMetadataKey } from "../../../symbols";

export const mapParseObjectToArgs = (args: unknown[], resolvedHandler, propertyKey, req) => {
    if ( Reflect.hasMetadata(parseObjectMetadataKey, resolvedHandler, propertyKey) ) {
        const paramMeta: ParamType = Reflect.getMetadata(parseObjectMetadataKey, resolvedHandler, propertyKey);
        args[paramMeta.propertyIndex] = req.object;
    }
}