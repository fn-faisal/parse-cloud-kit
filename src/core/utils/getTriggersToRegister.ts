import { SingleTriggerType, isNotSingleTrigger, TriggerType } from "../../decorators";
import { triggersMetadataKey } from "../../symbols";
import { TriggerItem } from "../../types";
import { getCallback } from "./getCallback";
import { getValidations } from "./getValidations";

export const getTriggersToRegister = (resolvedHandler): TriggerItem[] => {
    const trigger: [] = Reflect.getMetadata(triggersMetadataKey, resolvedHandler) || [];
    return trigger.map(
        (f: { propertyKey: string, type: TriggerType | SingleTriggerType, className: string }) => 
            isNotSingleTrigger( f ) ?
            ({
                type: f.type as TriggerType, 
                className: f.className,
                callback: getCallback(f, resolvedHandler), 
                validation: getValidations(resolvedHandler[f.propertyKey])
            }) :
            ({
                type: f.type as SingleTriggerType,
                callback: getCallback(f, resolvedHandler), 
                validation: getValidations(resolvedHandler[f.propertyKey])
            }) 
        
    );
}