/**
 * Serializable.ts
 *
 * @author mosframe / https://github.com/mosframe
 */


/**
 * serializable decorator
 *
 * @export
 * @param {*} target
 * @param {string} key
 */
export function Serializable( target:any, key:string ) {
    let array = serializable[target.constructor.name];
    if( array === undefined ) array = [];
    array.push( key );
}

/** serializable */
export let serializable : {[className:string]:string[]} = {};
