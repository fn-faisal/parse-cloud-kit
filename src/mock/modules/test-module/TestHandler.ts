import { injectable } from "tsyringe";
import { Params, ParseFunction, ParseTrigger } from "../../../decorators";
import { TestParams } from "./dto/TestParams";

@injectable()
export class TestHandler {
    @ParseFunction()
    async testFunc() {
        return {
            test: '123'
        }
    }

    @ParseFunction({
        validation: {
            fields: {
                test: {
                  default: 'test',
                },
            },
        }
    })
    async testFuncWithValidation() {
        return {
            test: '123'
        }
    }

    @ParseTrigger({
        className: 'Test',
        type: 'afterSave',
        validation: {
            fields: {
                test: {
                    default: 'test'
                }
            }
        }
    })
    async onAfterSaveTest() {}

    @ParseTrigger({
        className: 'Test',
        type: 'beforeSave',
        validation: {
            fields: {
                test: {
                    default: 'test'
                }
            }
        }
    })
    async onBeforeSaveTest() {}

    @ParseTrigger({
        className: 'Test',
        type: 'afterDelete',
        validation: {
            fields: {
                test: {
                    default: 'test'
                }
            }
        }
    })
    async onAfterDeleteTest() {}

    @ParseTrigger({
        className: 'Test',
        type: 'beforeDelete',
        validation: {
            fields: {
                test: {
                    default: 'test'
                }
            }
        }
    })
    async onBeforeDeleteTest() {}


    @ParseTrigger({
        className: 'Test',
        type: 'beforeFind',
        validation: {
            fields: {
                test: {
                    default: 'test'
                }
            }
        }
    })
    async onBeforeFindTest() {}

    @ParseTrigger({
        className: 'Test',
        type: 'afterFind',
        validation: {
            fields: {
                test: {
                    default: 'test'
                }
            }
        }
    })
    async onAfterFindTest() {}

    @ParseTrigger({
        type: 'beforeSaveFile',
        validation: {
            fields: {
                test: {
                    default: 'test'
                }
            }
        }
    })
    async onBeforeSaveFile() {}


    @ParseTrigger({
        type: 'afterSaveFile',
        validation: {
            fields: {
                test: {
                    default: 'test'
                }
            }
        }
    })
    async onAfterSaveFile() {}

    @ParseTrigger({
        type: 'beforeDeleteFile',
        validation: {
            fields: {
                test: {
                    default: 'test'
                }
            }
        }
    })
    async onBeforeDeleteFile() {}


    @ParseTrigger({
        type: 'afterDeleteFile',
        validation: {
            fields: {
                test: {
                    default: 'test'
                }
            }
        }
    })
    async onAfterDeleteFile() {}

    @ParseTrigger({
        type: 'beforeLogin',
        validation: {
            fields: {
                test: {
                    default: 'test'
                }
            }
        }
    })
    async onBeforeLogin() {}

    @ParseTrigger({
        type: 'afterLogout',
        validation: {
            fields: {
                test: {
                    default: 'test'
                }
            }
        }
    })
    async onAfterLogin() {}
}
