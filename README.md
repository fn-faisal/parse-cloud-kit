# parse-cloud-kit
## A toolkit for working with cloud code.
parse-cloud-kit is a utility to modularize and manage Parse Server Cloud Code more efficiently. It lets you organize Cloud Code in separate modules, each containing handlers for functions, triggers, and DI (listeners support is under development). 

## Installation
```sh
npm install parse-cloud-kit class-validator reflect-metadata tsyringe
```

## Usage
##### Bootstrap your modules in your main cloud file:-

```ts
import bootstrap from 'parse-cloud-kit';
import { Module1, Module2 } from './modules';

bootstrap([Module1, Module2]);
```

##### Creating modules:-

```ts
@parseModule({
   handlers: [ Handler1 ]
})
class Module1 {}
```

##### Creating handlers:-

```ts
@injectable()
class Handler1 {
    @ParseFunction()
    async testFunc( @Req() req: Request, @CurrentUser() user: Parse.User ) {}
       
    @ParseTrigger({
        type: 'beforeSave',
        className: 'Post'
    })
    async onBeforeSavePorst( @CurrentUser() user: Parse.User, @RequestObject() object: Parse.Object ){}
    
    @ParseTrigger({
        type: 'beforeLogin',
    })
    async onBeforeLogin( @CurrentUser() user: Parse.User, @RequestObject() object: Parse.Object ){}
    
    @ParseTrigger({
        type: 'beforeSaveFile',
    })
    async onBeforeSaveFile( @CurrentUser() user: Parse.User, @RequestObject() object: Parse.Object ){}
}
```

Easy validation:-
validation class:-
```ts
import { IsString } from 'class-validator';

class LogEvent () {
    @IsString()
    name!: string;
}
```
Handler:-
```ts
@injectable()
class Handler1 {
    @ParseFunction()
    async testFunc( @Params() data: LogEvent ) {}
}
```

When the function is called, it would run class-validator validations and throw error when the validation fails.

##### DI:-
As all the handlers are injetable, we can create custom classes (eg. service/repository classes ) as injectable and import them in handlers. 

```ts
import { injectable } from 'tsyringe';

@injectable()
class SomeService () {
    async heper(){}
}
```
Handler:-
```ts
@injectable()
class Handler1 {
    constructor(
       @inject(SomeService)
       private readonly someService: SomeService
    ){}

    @ParseFunction()
    async testFunc( @Params() data: LogEvent ) {
        this.someService.helper();
    }
}
```

## License

MIT
