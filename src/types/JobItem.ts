export type JobItem = {
    propertyKey: string; 
    callback: (...args: unknown[]) => void | Promise<void>;
    validation: any;
}