export type TriggerItem = {
    type: string;
    className: string; 
    callback: (...args: unknown[]) => unknown;
    validation: any
}
