/**
 * Ubject.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import deprecated       from 'deprecated-decorator';
import * as uuid        from 'uuid';
import * as GL          from './Graphic';
import {using}          from './Interfaces';
import {IDisposable}    from './Interfaces';
import {Util}           from './Util';



/**
 * Base class for all objects Uni.ts can reference.
 *
 * @export
 * @class Ubject
 */
export class Ubject extends Object implements IDisposable {

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
                this._serialize( window['UNITS'], obj, meta );
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
            this._ubjects[uuid] = this._deserialize( window['UNITS'], undefined, meta.ubjects[uuid], meta, object3Ds );
        }
        this.validate();
    }

    /**
     * serialize all
     *
     * @static
     * @param {*} meta
     * @returns {*}
     * @memberof Ubject
     */
    static serializeAll (meta:any) : any {
        this.validate();
        meta.ubjects = {};
        for( let c in this._ubjects ) {
            this._serialize( window['UNITS'], Ubject._ubjects[c], meta );
        }
        return meta;
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

    protected       _avaliable      : boolean;
    protected       _name           : string;
    protected       _uuid           : string;
    protected       _instanceID     : number;
    private static  _instanceID_    : number = 0;

    // [ Protected static Functions ]

    /**
     * serialize
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

        // [ number | string ]
        if( typeof target === 'number' || typeof target === 'string' ) {
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
                output.link = 'GL';
                output.uuid = target.uuid;
            }
            else
            // [ GL.Material ]
            if( target instanceof GL.Material ) {
                output.link = 'GL';
                output.uuid = target.uuid;
            }
            else
            // [ GL.Geometry ]
            if( target instanceof GL.Geometry ) {
                output.link = 'GL';
                output.uuid = target.uuid;
            }
            else
            // [ Ubject ]
            if( target instanceof Ubject ) {

                if( meta.ubjects[target.uuid] === undefined ) {

                    meta.ubjects[target.uuid] = {};
                    let metaObj = meta.ubjects[target.uuid];

                    // [ class ]
                    if (target.constructor.name in module) {
                        metaObj.class = target.constructor.name;
                        if( target instanceof Ubject ) {
                            target._avaliable = true;
                            metaObj._uuid = target._uuid;
                        }
                    }

                    // [ properties ]
                    for (let key in target) {
                        //console.log("key",key);
                        if (key[0] !== '_' || key === "_core" ) {
                            let val = target[key];
                            if ( typeof val === 'number' || typeof val === 'string' || typeof val === 'object' ) {
                                metaObj[key] = this._serialize( module, val, meta );
                            }
                        }
                    }
                }
                output.link = 'Ubject';
                output.uuid = target.uuid;
            }
            // [ Serializable object ]
            else {
                output = Util.serialize(target,module);
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
    static _deserialize( module:any, target:any, meta:any, metaRoot:any, object3Ds:{[uuid:string]:GL.Object3D|GL.Material|GL.Geometry} ) {

        // [ number, string ]
        if( typeof meta === 'number' || typeof meta === 'string' ) {
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
            if( meta.link === 'GL' ) {
                if( meta.uuid in object3Ds ) {
                    target = object3Ds[meta.uuid];
                }
            }
            else
            // [ Ubject ]
            if( meta.link === 'Ubject' ) {

                if( !(meta.uuid in this._ubjects) ) {
                    this._ubjects[meta.uuid] = this._deserialize( module, undefined, metaRoot.ubjects[meta.uuid], metaRoot, object3Ds );
                }
                target = this._ubjects[meta.uuid];
            }
            else {

                // [ instantiate ]
                if( target === undefined ) {
                    if( meta.class !== undefined ) {
                        if( meta.class in module ) {
                            target = new module[meta.class]();
                            target = Object.assign( target, meta );
                            if( target instanceof Ubject ) {
                                target.uuid = meta._uuid;
                            }
                        }
                    }
                }

                if( target === undefined ) {
                    target = {};
                    for( let property in meta ) {
                        if( property !== 'class' ) {
                            target[property] = this._deserialize( module, target[property], meta[property], metaRoot, object3Ds );
                        }
                    }
                }
                else {
                    for( let property in meta ) {
                        if( property in target ) {
                            target[property] = this._deserialize( module, target[property], meta[property], metaRoot, object3Ds );
                        }
                    }
                }
            }
        }
        return target;
    }
}
window['UNITS'][Ubject.name]=Ubject;
