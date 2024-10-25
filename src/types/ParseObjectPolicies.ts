export type ParseObjectPolicies = {
    [key: string]: {
        read?: (user?: Parse.User, object?: Parse.Object) => boolean | Promise<boolean>;
        write?: (user?: Parse.User, object?: Parse.Object) => boolean | Promise<boolean>;
        delete?: (user?: Parse.User, object?: Parse.Object) => boolean | Promise<boolean>;
    }
}
