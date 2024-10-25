import { UserConstructor } from "parse";
import { triggersMetadataKey, validationMetadataKey } from "../symbols";

export type Triggers = 'afterDelete' | 'afterDeleteFile' | 'afterFind' | 'afterLogin' |
    'afterLogout' | 'afterSave' | 'afterSaveFile' |
    'beforeDelete' | 'beforeDeleteFile' | 'beforeFind' | 'beforeLogin' |
    'beforeSave' | 'beforeSaveFile';

type TriggerParams = {
    type: Triggers;
    className: string | UserConstructor;
    validation?: Parse.Cloud.Validator;
}

export const ParseTrigger = <T>(params: TriggerParams) => (
    target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>
) => {
    // existing function.
    const functions = Reflect.getMetadata(triggersMetadataKey, target) || [];
    functions.push({
        propertyKey,
        type: params.type,
        className: params.className,
    });
    Reflect.defineMetadata(triggersMetadataKey, functions, target);

    if ( params ) {
        if (params.validation) {
            Reflect.defineMetadata(validationMetadataKey, params.validation, target[propertyKey]);
        }
    }
}