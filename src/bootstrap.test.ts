import bootstrap, { SingleTriggerType, TriggerType } from ".";
import { DuplicateTriggerModule } from "./mock/modules/duplicate-func-module/DuplicateTriggerModule";
import { TestModule } from "./mock/modules/test-module/TestModule";

function testTrigger(trigger: TriggerType) {
    bootstrap([
        TestModule
    ]);
    expect(Parse.Cloud[trigger]).toHaveBeenCalledWith('Test', expect.any(Function), {
        fields: {
            test: {
                default: 'test'
            }
        }
    });        
}

function testSingleTrigger(trigger: SingleTriggerType, noValidation: boolean = false) {
    bootstrap([
        TestModule
    ]);
    if ( noValidation )
        expect(Parse.Cloud[trigger]).toHaveBeenCalledWith(expect.any(Function));        
    else    
        expect(Parse.Cloud[trigger]).toHaveBeenCalledWith(expect.any(Function), {
            fields: {
                test: {
                    default: 'test'
                }
            }
        });        
}

describe('Bootstrap', () => {
    it('does not register anything with no modules', async () => {
        bootstrap([]);
        expect(Parse.Cloud.define).not.toHaveBeenCalled();
    });
    it('should register functions for modules', () => {
        bootstrap([
            TestModule
        ]);
        expect(Parse.Cloud.define).toHaveBeenCalledWith('testFunc', expect.any(Function), {});
    });
    it('should register functions with validation for modules', () => {
        bootstrap([
            TestModule
        ]);
        expect(Parse.Cloud.define).toHaveBeenCalledWith('testFuncWithValidation', expect.any(Function), {
            fields: {
                test: {
                    default: 'test'
                }
            }
        });
    });

    it('should throw error on duplicate triggers for modules', async () => {
        try {
            await bootstrap([
                DuplicateTriggerModule
            ])
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Trying to register multiple triggers for same class/trigger. Test');
        }
    });

    it('should register on after save trigger with validations for modules', () => {
        testTrigger('afterSave');
    });

    it('should register on before save trigger with validations for modules', () => {
        testTrigger('beforeSave');
    });

    it('should register on after delete trigger with validations for modules', () => {
        testTrigger('afterDelete');
    });

    it('should register on before delete trigger with validations for modules', () => {
        testTrigger('beforeDelete');
    });

    it('should register on before find trigger with validations for modules', () => {
        testTrigger('beforeFind');
    });

    it('should register on after find trigger with validations for modules', () => {
        testTrigger('afterFind');
    });

    it('should register on after save file trigger with validations for modules', () => {
        testSingleTrigger('afterSaveFile');
    });

    it('should register on before save file trigger with validations for modules', () => {
        testSingleTrigger('beforeSaveFile');
    });

    it('should register on after save file trigger with validations for modules', () => {
        testSingleTrigger('afterDeleteFile');
    });

    it('should register on before save file trigger with validations for modules', () => {
        testSingleTrigger('beforeDeleteFile');
    });

    it('should register on before login trigger for modules', () => {
        testSingleTrigger('beforeLogin', true);
    });

    it('should register on after logout trigger for modules', () => {
        testSingleTrigger('afterLogout', true);
    });
});
