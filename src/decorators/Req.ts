import { parseRequestMetadataKey } from "../symbols";

export function Req() {
    return function (target: any, propertyKey: string, propertyIndex: number) {
        Reflect.defineMetadata(parseRequestMetadataKey, propertyIndex, target, propertyKey);
    }
}