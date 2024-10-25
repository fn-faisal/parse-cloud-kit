import { UserConstructor } from "parse";
import { triggersMetadataKey, validationMetadataKey } from "../symbols";

export type TriggerType = 'afterDelete' | 'afterFind' |
     'afterSave' | 'beforeDelete' | 'beforeFind' | 'beforeSave';

export type SingleTriggerType = 'afterDeleteFile' | 'afterSaveFile' | 
    'beforeDeleteFile' | 'beforeSaveFile' | 'beforeLogin' | 'afterLogout';

export type TriggerParams = 
  | {
      type: SingleTriggerType;
      validation?: Parse.Cloud.Validator;
    }
  | {
      type: TriggerType; 
      className: string | UserConstructor; 
      validation?: Parse.Cloud.Validator;
    };

export function isNotSingleTrigger(params: TriggerParams): params is { type: TriggerType; className: string | UserConstructor } {
    return 'className' in params;
}

export const ParseTrigger = <T>(params: TriggerParams) => (
    target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>
) => {
    // existing function.
    const functions = Reflect.getMetadata(triggersMetadataKey, target) || [];
    const functionData: any = {
        propertyKey,
        type: params.type,
    };
    if (isNotSingleTrigger(params)) {
        functionData.className = params.className;
    }
    functions.push(functionData);

    Reflect.defineMetadata(triggersMetadataKey, functions, target);

    if ( params && params.validation ) {
        Reflect.defineMetadata(validationMetadataKey, params.validation, target[propertyKey]);
    }
}