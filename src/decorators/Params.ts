

export const parseRequestParamsMetadataKey = Symbol('parse-request-params')

export type ParamType = {
    propertyIndex: number,
    type: any
}

export function Params() {
    return function (target: any, propertyKey: string, propertyIndex: number) {
        const types = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];
        const parameterType = types[propertyIndex];
        Reflect.defineMetadata(parseRequestParamsMetadataKey, {
            propertyIndex,
            type: parameterType
        }, target, propertyKey);
    }
}