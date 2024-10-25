import { Triggers } from "../../decorators";
import { triggersMetadataKey } from "../../symbols";
import { getCallback } from "./getCallback";
import { getValidations } from "./getValidations";

export const getTriggersToRegister = (resolvedHandler) => {
    const trigger: [] = Reflect.getMetadata(triggersMetadataKey, resolvedHandler) || [];
    return trigger.map(
        (f: { propertyKey: string, type: Triggers, className: string }) => 
            ({
                type: f.type,
                className: f.className, 
                callback: getCallback(f, resolvedHandler), 
                validation: getValidations(resolvedHandler[f.propertyKey])
            })
        
    );
}