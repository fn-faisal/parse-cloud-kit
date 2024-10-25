import { parseCurrentUserMetadataKey } from "../symbols/parseCurrentUserMetadataKey";

export type CurrentUserType = {
    propertyIndex: number,
    type: any
}

export function CurrentUser<T>() {
    return function (target: any, propertyKey: string, propertyIndex: number) {
        const types = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];
        const parameterType = types[propertyIndex];
        Reflect.defineMetadata(parseCurrentUserMetadataKey, {
            propertyIndex,
            type: parameterType
        }, target, propertyKey);
    }
}