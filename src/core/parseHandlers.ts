import { validate } from "class-validator";
import { ParamType, SkipIfMaster, Triggers } from "../decorators";
import { authGuardMetadataKey, functionsMetadataKey, masterGuardMetadataKey, parseCloudJobMetadataKey, parseCurrentUserMetadataKey, parseObjectMetadataKey, parseRequestMetadataKey, parseRequestParamsMetadataKey, triggersMetadataKey, validationMetadataKey } from "../symbols";
import { FunctionItem, JobItem, TriggerItem, UnknownClass } from "../types";
import { container } from "tsyringe";
import { getValidations } from "./getValidations";
import { getCallback } from "./getCallback";

export function parseHandler(handler: UnknownClass): [ FunctionItem[], TriggerItem[], JobItem[] ] {
    const triggersToRegister: TriggerItem[] = [];
    const functionsToRegister: FunctionItem[] = [];
    const jobsToRegister: JobItem[] = [];
    const resolvedHandler: any = container.resolve(handler);

    const functions = Reflect.getMetadata(functionsMetadataKey, resolvedHandler) || [];
    functions.map(
        (f: { propertyKey: string }) => {
            const validation = getValidations(resolvedHandler[f.propertyKey]);
            functionsToRegister.push({
                propertyKey: f.propertyKey, 
                callback: getCallback(f, resolvedHandler), 
                validation
            })
        }
    );

    // jobs.
    const jobs = Reflect.getMetadata(parseCloudJobMetadataKey, resolvedHandler) || [];
    jobs.map(
        (f: { propertyKey: string }) => {
            const validation = getValidations(resolvedHandler[f.propertyKey]);
            jobsToRegister.push({
                propertyKey: f.propertyKey, 
                callback: getCallback(f, resolvedHandler), 
                validation
            })
        }
    );

    // triggers.
    const trigger: [] = Reflect.getMetadata(triggersMetadataKey, resolvedHandler) || [];
    trigger.map(
        (f: { propertyKey: string, type: Triggers, className: string }) => {
            const validation = getValidations(resolvedHandler[f.propertyKey]);
            triggersToRegister.push({
                type: f.type,
                className: f.className, 
                callback: getCallback(f, resolvedHandler), 
                validation
            })
        }
    );

    return [functionsToRegister, triggersToRegister, jobsToRegister]
}
