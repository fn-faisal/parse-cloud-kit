
export const parseRequestMetadataKey = Symbol('parse-request')

export function Req() {
    return function (target: any, propertyKey: string, propertyIndex: number) {
        Reflect.defineMetadata(parseRequestMetadataKey, propertyIndex, target, propertyKey);
    }
}