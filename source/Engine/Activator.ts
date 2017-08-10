/**
 * Activator.ts
 *
 * @author mosframe / https://github.com/mosframe
 */


 /**
 * Activator
 *
 * @example {
 *
 * var activator = new Activator<Ubject>(window);
 *
 * var example = activator.createInstance('ClassA');
 *
 * }
 * @export
 * @class Activator
 * @template T
 */
export class Activator {

    // [ Constructors ]

    constructor( private context:Object ) {
    }

    // [ Public Functions ]

    createInstance<T>( name:string, ...args: any[] ) : T {
        let instance = Object.create(this.context[name].prototype);
        instance.constructor.apply(instance, args);
        return <T> instance;
    }
}

