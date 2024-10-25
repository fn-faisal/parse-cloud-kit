import { parseObjectMetadataKey } from "../symbols";


export type RequestObjectType = {
    propertyIndex: number,
    type: any
}

export function RequestObject<T>() {
    return function (target: any, propertyKey: string, propertyIndex: number) {
        const types = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];
        const parameterType = types[propertyIndex];
        Reflect.defineMetadata(parseObjectMetadataKey, {
            propertyIndex,
            type: parameterType
        }, target, propertyKey);
    }
}