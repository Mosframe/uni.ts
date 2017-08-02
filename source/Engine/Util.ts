/**
 * Util.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

/**
 * Utility
 *
 * @export
 * @class Util
 */
export class Util {

    /**
     * clone object
     *
     * @static
     * @param {*} original
     * @returns {*}
     *
     * @memberof Util
     */
    static clone( original:any ) : any {
        return Object.assign(Object.create(original), original);
    }


    /**
     * serialize
     *
     * @static
     * @param {any} target
     * @param {any} module
     * @returns {*}
     * @memberof Util
     */
    static serialize ( target:any, module:any ) : any {

        let output:any = {};

        // [ number | string ]
        if( typeof target === 'number' || typeof target === 'string' ) {
            output = target;
        }
        else
        // [ array ]
        if( target instanceof Array ) {
            output = [];
            for( let key in target ) {
                output[key] = this.serialize(target[key],module);
            }
        }
        else
        // [ object ]
        if( typeof target === 'object' ) {

            if( target.constructor.name in module ) {
                output.class = target.constructor.name;
            }

            for( let key in target ) {
               if( key[0] !== '_' ) {
                    let val = target[key];
                    if( typeof val !== 'number' || typeof val !== 'string' || typeof val !== 'object' ) {
                        output[key] = this.serialize(val,module);
                    }
                }
            }
        }
        return output;
    }
    /**
     * deserialize
     *
     * @static
     * @param {any} target
     * @param {any} meta
     * @param {any} module
     * @returns
     * @memberof Util
     */
    static deserialize ( target:any, meta:any, module:any ) {

        // [ number, string ]
        if( typeof meta === 'number' || typeof meta === 'string' ) {
            target = meta;
        }
        else
        // [ array ]
        if( meta instanceof Array ) {
            target = [];
            for( let key in meta ) {
                target[key] = this.deserialize( target[key], meta[key], module );
            }
        }
        else
        // [ object ]
        if( typeof meta === 'object' ) {

            // [ instantiate ]
            if( target === undefined ) {
                if( meta.class !== undefined ) {
                    if( meta.class in module ) {
                        target = new module[meta.class]();
                    }
                }
            }
            if( target === undefined ) {
                target = {};
            }
            for( let property in meta ) {
                if( property !== 'class' ) {
                    target[property] = this.deserialize(target[property], meta[property], module);
                }
            }
        }
        return target;
    }
}
