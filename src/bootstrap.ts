import "reflect-metadata";
import { FunctionItem, JobItem, TriggerItem, UnknownClass } from "./types";
import { parseModule } from "./core/parsers/parseModule";
import { isNotSingleTrigger } from "./decorators";

export default async function bootstrapCloudCode(modules: UnknownClass[]) {
    const jobs: JobItem[] = [];
    const functions: FunctionItem[] = [];
    const triggers: TriggerItem[] = [];

    modules.map(module => parseModule(module, jobs, functions, triggers));

    // register jobs.
    jobs.map( j => {
        Parse.Cloud.job(j.propertyKey, j.callback);
    });

    // register functions.
    functions.map( f => {
        Parse.Cloud.define(f.propertyKey, f.callback, f.validation);
    });

    // register triggers.
    triggers.map(t => {
        const callback = async (...args: unknown[]) => {
            await t.callback(...args);
        }
        if ( isNotSingleTrigger(t) ) {
            Parse.Cloud[t.type](t.className, callback, t.validation);
        } else {
            if ( t.type === 'beforeLogin' || t.type === 'afterLogout') {
                Parse.Cloud[t.type](callback);
            } else {
                // @ts-expect-error expected call
                Parse.Cloud[t.type](callback, t.validation);
            }

        }
    });
}