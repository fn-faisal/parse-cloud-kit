import "reflect-metadata";
import { FunctionItem, JobItem, TriggerItem, UnknownClass } from "./types";
import { parseModule } from "./core/parsers/parseModule";

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
    
        Parse.Cloud[t.type](t.className, callback, t.validation);
    });
}