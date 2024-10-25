import { ParamType } from "../../../decorators";
import { parseCurrentUserMetadataKey } from "../../../symbols";

export const mapUserToArgs = (args: unknown[], resolvedHandler, propertyKey, req) => {
    if ( Reflect.hasMetadata(parseCurrentUserMetadataKey, resolvedHandler, propertyKey) ) {
        const paramMeta: ParamType = Reflect.getMetadata(parseCurrentUserMetadataKey, resolvedHandler, propertyKey);
        args[paramMeta.propertyIndex] = req.user;
    }
}