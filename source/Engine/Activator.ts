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
 * @author mosframe / https://github.com/mosframe
 * @export
 * @class Activator
 * @template T
 */
export class Activator<T> {

    // [ Constructors ]

    constructor( private context:Object ) {
    }

    // [ Public Functions ]

    createInstance( name:string, ...args: any[] ) : T {
        var instance = Object.create(this.context[name].prototype);
        instance.constructor.apply(instance, args);
        return <T> instance;
    }
}
window['UNITS'][Activator.name]=Activator;



