import { ParseModule } from "../../../decorators";
import { TestHandler } from "./TestHandler";

@ParseModule({ 
    handlers: [ TestHandler ]
})
export class TestModule {}