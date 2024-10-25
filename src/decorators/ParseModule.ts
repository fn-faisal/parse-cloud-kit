type ModuleParams = {
    handlers: {new(...args: any[]):any}[];
    listeners?: {new(...args: any[]): any}[];
}

export const ParseModule = ( params: ModuleParams ) => 
(target: any, ) => {
    Reflect.defineMetadata('handlers', params.handlers, target);
    Reflect.defineMetadata('listeners', params.listeners, target);
}