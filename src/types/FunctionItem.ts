export type FunctionItem = {
    propertyKey: string; 
    callback: (...args: unknown[]) => unknown;
    validation: any;
}