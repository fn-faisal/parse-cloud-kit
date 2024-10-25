
export const registerUnique = <T>( registry: T[], itemsToRegister: T[], findUsing: ( i: T, j: T ) => boolean, errorMessage?: (foundItem: T) => string ) => {
    // register jobs.
    const foundItem = registry.find(f => 
        itemsToRegister
            .find(ftr => findUsing(f, ftr)) !== undefined
    );

    if ( foundItem ) {
        let errMessage: string = 'Trying to register multiple parse entity with same name/class name etc.';
        if ( errorMessage && typeof errorMessage === 'function' ) {
            errMessage = errorMessage(foundItem)
        }
        throw new Error(errMessage);
    }

    // register functions.
    itemsToRegister.map( f => registry.push(f) );
}