import { injectable } from "tsyringe";
import { ParseFunction, ParseTrigger } from "../../../decorators";


@injectable()
export class DuplicateTriggerHandler {
    @ParseTrigger({
        type: 'beforeSave',
        className: 'Test'
    })
    async testTriggerOne() {}

    @ParseTrigger({
        type: 'beforeSave',
        className: 'Test'
    })
    async testTriggerTwo() {}
}