import { TriggerParams } from "../decorators";

export type TriggerItem = 
    TriggerParams & {
        callback: (...args: unknown[]) => unknown;
    } 