import { ParseModule } from "../../../decorators";
import { DuplicateTriggerHandler } from "./DuplicateTriggerHandler";

@ParseModule({
    handlers: [
        DuplicateTriggerHandler
    ]
})
export class DuplicateTriggerModule {}