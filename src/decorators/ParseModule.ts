import { handlersMetadataKey } from "../symbols";

type ModuleParams = {
    handlers: {new(...args: any[]):any}[];
    listeners?: {new(...args: any[]): any}[];
}

export const ParseModule = ( params: ModuleParams ) => 
(target: any, ) => {
    Reflect.defineMetadata(handlersMetadataKey, params.handlers, target);
    Reflect.defineMetadata('listeners', params.listeners, target);
}