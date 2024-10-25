import { Triggers } from "../../decorators";
import { parseCloudJobMetadataKey, triggersMetadataKey } from "../../symbols";
import { FunctionItem, JobItem, TriggerItem, UnknownClass } from "../../types";
import { container } from "tsyringe";
import { getValidations } from "../utils/getValidations";
import { getCallback } from "../utils/getCallback";
import { getFunctionsToRegister } from "../utils/getFunctionsToRegister";
import { getJobsToRegister } from "../utils/getJobsToRegister";
import { getTriggersToRegister } from "../utils/getTriggersToRegister";

export function parseHandler(handler: UnknownClass): [ FunctionItem[], TriggerItem[], JobItem[] ] {
    const resolvedHandler: any = container.resolve(handler);

    const functionsToRegister: FunctionItem[] = getFunctionsToRegister(resolvedHandler);
    const jobsToRegister: JobItem[] = getJobsToRegister(resolvedHandler);
    const triggersToRegister: TriggerItem[] = getTriggersToRegister(resolvedHandler);

    return [functionsToRegister, triggersToRegister, jobsToRegister]
}
