import { validate } from "class-validator";
import { ParamType } from "../../../decorators";
import { parseRequestParamsMetadataKey } from "../../../symbols";

export const mapParamsToArgs = async (args: unknown[], resolvedHandler, propertyKey, req) => {
    // params.
    if ( Reflect.hasMetadata(parseRequestParamsMetadataKey, resolvedHandler, propertyKey) ) {
        const paramMeta: ParamType = Reflect.getMetadata(parseRequestParamsMetadataKey, resolvedHandler, propertyKey);

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
}