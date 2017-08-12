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
        delete Ubject._ubjects[this._uuid];
        this._uuid=value;
        Ubject._ubjects[this._uuid] = this
    }

    // [ Constructors ]

    /**
     * Creates an instance of Ubject.
     *
     * @memberof Ubject
     */
    constructor() {
        super();
        this._avaliable = true;
        this._instanceID = ++Ubject._instanceID_;
        this._uuid = GL.Math.generateUUID();
        Ubject._ubjects[this._uuid] = this;
    }


    // [ Public Functions ]

    /**
     * dispose
     *
     * @memberof Ubject
     */
    dispose() {
        delete Ubject._ubjects[this._uuid];
    }
    /**
     * Returns the instance id of the object.
     *
     * @returns {number}
     * @memberof Ubject
     */
    getInstanceID () : number { return this._instanceID; }

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
        for( let uuid in this._ubjects ) {
            this._ubjects[uuid]['_avaliable'] = false;
        }

        // [ serialize ]
        meta.ubjects = {};
        for( let uuid of uuids ) {
            let obj = this._ubjects[uuid];
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
            this._ubjects[uuid] = this._deserialize( window, undefined, meta.ubjects[uuid], meta, object3Ds );
        }
        this.validate();
    }

    /**
     * validate
     *
     * @static
     * @memberof Ubject
     */
    static validate() {

        let removes:any = [];
        for( let c in Ubject._ubjects ) {
            let obj = Ubject._ubjects[c];
            if( !obj ) {
                removes.push(c);
            }
            else
            if( !obj._avaliable ) {
                removes.push(c);
            }
        }
        for( let c in removes ) {
            delete Ubject._ubjects[removes[c]];
        }
    }
    /**
     * clear all ubjects
     *
     * @static
     * @memberof Ubject
     */
    static clearAll() {
        this._ubjects = {};
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

    protected static _ubjects   : {[uuid:string]:Ubject} = {};

    // [ Protected Variables ]

    //@Serializable
    protected       _name           : string;
    //@Serializable
    protected       _uuid           : string;

    protected       _avaliable      : boolean;
    protected       _instanceID     : number;

    // [ Private Static Variables ]

    private static  _instanceID_    : number = 0;


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

                output.module = 'UNITS';
                output.uuid = target.uuid;

                // [ register ]
                if( meta.ubjects[target.uuid] === undefined ) {
                    meta.ubjects[target.uuid] = output; // 멤버들중에 크로스 참조가 있을수 있으므로 미리등록을 해야 무한루프에 빠지지 않는다.

                    // [ class ]
                    if( target.constructor.name in module ) {
                        output.class = target.constructor.name;
                        target._avaliable = true;
                    }

                    // [ properties ]
                    for( let key in target ) {

                        //if( key[0] !== '_' ) {
                            let val = target[key];
                            if ( typeof val === 'boolean' || typeof val === 'number' || typeof val === 'string' || typeof val === 'object' ) {
                                output[key] = this._serialize( module, val, meta );
                            }
                        //}
                    }
                }
            }
        }
        return output;
    }
    /**
     * deserialize ( 공사중 )
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
    static _deserialize( module:any, target:any, meta:any, metaRoot:any, object3Ds:{[uuid:string]:GL.Object3D|GL.Material|GL.Geometry} ) {

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

                if( meta.uuid in this._ubjects ) {
                    target = this._ubjects[meta.uuid];
                } else {

                    // [ instantiate ]
                    target = new window['UNITS'][meta.class]();
                    if( target ) {
                        this._ubjects[meta.uuid] = target;
                    } else {
                        target = {};
                    }

                    for( let property in meta ) {
                        if( property !== 'class' ) {
                            target[property] = this._deserialize( module, target[property], meta[property], metaRoot, object3Ds );
                        }
                    }
                }
            }
        }
        return target;
    }
}
window['UNITS'][Ubject.name] = Ubject;
