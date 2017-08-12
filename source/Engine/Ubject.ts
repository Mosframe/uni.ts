/**
 * Ubject.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { GL             }   from './Graphic';
import { using          }   from './Using';
import { IDisposable    }   from './Using';
import { Serializable   }   from './Serializable';
import { serializable   }   from './Serializable';
import { Util           }   from './Util';

/**
 * Base class for all objects Uni.ts can reference.
 *
 * @export
 * @class Ubject
 */
export class Ubject extends Object implements IDisposable  {

    // [ Public Variables ]

    /*
    hideFlags	Should the object be hidden, saved with the scene or modifiable by the user?
    */

    /**
     * The name of the object.
     *
     * @readonly
     * @type {string}
     * @memberof Ubject
     */
    get name () : string        { return this._name; }
    set name ( value:string )   { this._name = value; }
    /**
     * uuid
     *
     * @readonly
     * @type {string}
     * @memberof Ubject
     */
    get uuid () : string        { return this._uuid; }
    set uuid ( value:string )   {
        delete Ubject.__ubjects[this._uuid];
        this._uuid=value;
        Ubject.__ubjects[this._uuid] = this
    }

    // [ Constructors ]

    /**
     * Creates an instance of Ubject.
     *
     * @memberof Ubject
     */
    constructor() {
        super();
        this.__avaliable = true;
        this.__instanceID = Ubject.__nextInstanceID++;
        this._uuid = GL.Math.generateUUID();
        Ubject.__ubjects[this._uuid] = this;
    }


    // [ Public Functions ]

    /**
     * dispose
     *
     * @memberof Ubject
     */
    dispose() {
        delete Ubject.__ubjects[this._uuid];
    }
    /**
     * Returns the instance id of the object.
     *
     * @returns {number}
     * @memberof Ubject
     */
    getInstanceID () : number { return this.__instanceID; }

    /**
     * Returns the name of the game object.
     *
     * @returns {string}
     * @memberof Ubject
     */
    toString () : string {
        return this.name;
    }

    // [ Public Static Functions ]

    /*
    static Destroy ( object:Ubject, delay:number=0 ) Removes a gameobject, component or asset.
    static DestroyImmediate	Destroys the object obj immediately. You are strongly recommended to use Destroy instead.
    static DontDestroyOnLoad	Makes the object target not be destroyed automatically when loading a new scene.
    static FindObjectOfType	Returns the first active loaded object of Type type.
    static FindObjectsOfType	Returns a list of all active loaded objects of Type type.
    */

    /**
     * serialize
     *
     * @static
     * @param {*} meta
     * @param {string[]} uuids
     * @returns {*}
     * @memberof Ubject
     */
    static serialize ( meta:any, uuids:string[] ) : any {

        // [ reset avaliable flags ]
        for( let uuid in this.__ubjects ) {
            this.__ubjects[uuid].__avaliable = false;
        }

        // [ serialize ]
        meta.ubjects = {};
        for( let uuid of uuids ) {
            let obj = this.__ubjects[uuid];
            if( obj !== undefined ) {
                meta.ubjects[uuid] = this._serialize( window['UNITS'], obj, meta );
            }
        }

        // [ avaliable ]
        this.validate();

        return meta;
    }
    /**
     * deserialize
     *
     * @static
     * @param {*} meta
     * @param {({[uuid:string]:GL.Object3D|GL.Material|GL.Geometry})} object3Ds
     * @returns {*}
     * @memberof Ubject
     */
    static deserialize (meta:any, object3Ds:{[uuid:string]:GL.Object3D|GL.Material|GL.Geometry} ) : any {
        this.clearAll();
        for( let uuid in meta.ubjects ) {
            this._deserialize( window, undefined, meta.ubjects[uuid], meta, object3Ds );
        }
        //this.validate();
    }

    /**
     * validate
     *
     * @static
     * @memberof Ubject
     */
    static validate() {

        let removes:any = [];
        for( let c in Ubject.__ubjects ) {
            let obj = Ubject.__ubjects[c];
            if( !obj ) {
                removes.push(c);
            }
            else
            if( !obj.__avaliable ) {
                removes.push(c);
            }
        }
        for( let c in removes ) {
            delete Ubject.__ubjects[removes[c]];
        }
    }
    /**
     * clear all ubjects
     *
     * @static
     * @memberof Ubject
     */
    static clearAll() {
        this.__ubjects = {};
    }

    /**
     * Clones the object original and returns the clone.
     *
     * @static
     * @param {Ubject} original
     *
     * @memberof Ubject
     */
    static instantiate( original : Ubject ) : Ubject {
        return <Ubject>Util.clone( original );
    }

    // [ Public Operators ]

    /*
    bool	Does the object exist?
    operator !=	Compares if two objects refer to a different object.
    operator ==	Compares two object references to see if they refer to the same object.
    */

    // [ Protected Static Variables ]

    protected static __ubjects      : {[uuid:string]:Ubject} = {};

    // [ Protected Variables ]

    protected       _name           : string;
    protected       _uuid           : string;

    protected       __avaliable     : boolean;
    protected       __instanceID    : number;

    // [ Private Static Variables ]

    private static  __nextInstanceID: number = 1;


    /**
     * serialize ( 공사중 )
     *
     * @static
     * @param {any} module
     * @param {any} target
     * @param {any} [meta]
     * @returns {*}
     * @memberof Util
     */
    protected static _serialize ( module:any, target:any, meta?:any ) : any {

        let output : any = {};

        // [ boolean | number | string ]
        if( typeof target === 'boolean' || typeof target === 'number' || typeof target === 'string' ) {
            output = target;
        }
        else
        // [ object ]
        if (typeof target === 'object') {

            // [ Array ]
            if( target instanceof Array ) {
                output = [];
                for( let key in target ) {
                    output[key] = this._serialize( module, target[key], meta );
                }
            }
            else
            // [ GL.Object3D ]
            if( target instanceof GL.Object3D ) {
                output.module = 'GL';
                output.uuid = target.uuid;
            }
            else
            // [ GL.Material ]
            if( target instanceof GL.Material ) {
                output.module = 'GL';
                output.uuid = target.uuid;
            }
            else
            // [ GL.Geometry ]
            if( target instanceof GL.Geometry ) {
                output.module = 'GL';
                output.uuid = target.uuid;
            }
            else
            // [ Ubject ]
            if( target instanceof Ubject ) {

                // [ serialized sequence ]
                // 1. module name
                // 2. uuid
                // 3. class name
                // 4. class valiables

                output.module = 'UNITS';
                output.uuid = target.uuid;

                // [ register ]
                if( meta.ubjects[target.uuid] === undefined ) {
                    meta.ubjects[target.uuid] = output;

                    // [ class ]
                    if( target.constructor.name in module ) {
                        output.class = target.constructor.name;
                        target.__avaliable = true;
                    }

                    // [ properties ]
                    for( let key in target ) {
                        let value = target[key];
                        if( key[1] !== '_' ) { // __member
                            if ( typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' || typeof value === 'object' ) {
                                output[key] = this._serialize( module, value, meta );
                            }
                        }
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
     * @param {*} module
     * @param {*} target
     * @param {*} meta
     * @param {*} metaRoot
     * @param {({[uuid:string]:GL.Object3D|GL.Material|GL.Geometry})} object3Ds
     * @returns
     * @memberof Ubject
     */
    protected static _deserialize( module:any, target:any, meta:any, metaRoot:any, object3Ds:{[uuid:string]:GL.Object3D|GL.Material|GL.Geometry} ) {

        // [ boolean | number | string ]
        if( typeof meta === 'boolean' || typeof meta === 'number' || typeof meta === 'string' ) {
            target = meta;
        }
        else
        // [ array ]
        if( meta instanceof Array ) {
            target = [];
            for( let key in meta ) {
                target[key] = this._deserialize( module, target[key], meta[key], metaRoot, object3Ds );
            }
        }
        else
        // [ object ]
        if( typeof meta === 'object' ) {

            // [ GL ]
            if( meta.module === 'GL' ) {
                if( meta.uuid in object3Ds ) {
                    target = object3Ds[meta.uuid];
                }
            }
            else
            // [ UNITS ]
            if( meta.module === 'UNITS' ) {

                if( meta.uuid in this.__ubjects ) {
                    target = this.__ubjects[meta.uuid];
                } else {

                    // [ instantiate ]
                    target = new window['UNITS'][meta.class]();
                    if( target === undefined ) {
                        target = {};
                    } else {
                        this.__ubjects[meta.uuid] = target;
                    }

                    for( let key in meta ) {
                        if( key !== 'module' && key !== 'class' ) {
                            target[key] = this._deserialize( module, target[key], meta[key], metaRoot, object3Ds );
                        }
                    }
                }
            }
        }
        return target;
    }
}
window['UNITS'][Ubject.name] = Ubject;
