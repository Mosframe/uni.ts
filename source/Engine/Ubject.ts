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

    get avaliable () : boolean { return true; }

    /**
     * The name of the object.
     *
     * @readonly
     * @type {string}
     * @memberof Ubject
     */
    get name () : string        { return this._name; }
    set name ( value:string )   { this._name = value; }

    get uuid () : string        { return this._uuid; }
    set uuid ( value:string )   {
        delete Ubject._ubjects[this._uuid];
        this._uuid = value;
        Ubject._ubjects[this._uuid] = this;
    }

    // [ Constructors ]

    /**
     * Creates an instance of Ubject.
     *
     * @memberof Ubject
     */
    constructor() {
        super();
        this._instanceID = ++Ubject._instanceID_;
        this.uuid = GL.Math.generateUUID();
        Ubject._ubjects[this.uuid] = this;
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
     * @returns {*}
     * @memberof Ubject
     */
    static serialize (meta:any) : any {
        this.validate();
        meta.ubjects = {};
        for( let c in Ubject._ubjects ) {
            Ubject._serialize( window['UNITS'], Ubject._ubjects[c], undefined, meta );
        }
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
        for( let c in meta.ubjects ) {
            Ubject._ubjects[c] = Ubject._deserialize( window['UNITS'], meta.ubjects[c], meta, object3Ds );
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
            if( !obj.avaliable ) {
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
        Ubject._ubjects = {};
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
     * @param {Object} obj
     * @param {any} [meta]
     * @returns {*}
     * @memberof Util
     */
    protected static _serialize ( module:any, target:Object, meta?:any, metaRoot?:any ) : any {

        if (target === null) { return meta; }

        if (target instanceof Array) {

            if( meta === undefined ) {
                meta = [];
            }
            if( metaRoot === undefined ) {
                metaRoot = meta;
            }

            for (let key in target) {
                let val = target[key];
                if( typeof val === 'object' ) {

                    let p = this._serialize(module,target[key],undefined,metaRoot);

                    if( val instanceof Ubject ) {
                        meta[key] = {};
                        meta[key].uuid = val.uuid;
                    }
                    else
                    if( val instanceof GL.Object3D ) {
                        meta[key] = {};
                        meta[key].uuid = val.uuid;
                    }
                    else
                    if( val instanceof GL.Material ) {
                        meta[key] = {};
                        meta[key].uuid = val.uuid;
                    }
                    else
                    if( val instanceof GL.Geometry ) {
                        meta[key] = {};
                        meta[key].uuid = val.uuid;
                    }
                    else {
                        meta[key] = p;
                    }
                }
                else
                if( typeof val === 'number' || typeof val === 'string' ) {
                    meta[key] = target[key];
                }
            }
            return meta;

        } else {

            if( meta === undefined ) {
                meta = {};
            }
            if( metaRoot === undefined ) {
                metaRoot = meta;
            }

            if( target instanceof Ubject ) {
                if( metaRoot.ubjects[target.uuid] === undefined ) {
                    metaRoot.ubjects[target.uuid] = {};
                    metaRoot.ubjects[target.uuid] = this._serialize(module,target,undefined,metaRoot);
                    return meta;
                }
            }
            else
            if( target instanceof GL.Object3D ) {
                return meta;
            }

            if (target.constructor.name in module) {
                meta.class = target.constructor.name;
                if( target instanceof Ubject ) {
                    meta.uuid = target.uuid;
                }
            }

            for (let key in target) {
                if (key[0] !== '_' || key === "_core" ) {

                    let val = target[key];
                    let p:Object|null = target;

                    while(p) {
                        let descriptor = Object.getOwnPropertyDescriptor(p, key);
                        if (descriptor && ((descriptor.get && descriptor.set) || (!descriptor.get && !descriptor.set))) {
                            if (typeof val === 'object') {

                                if( val instanceof Ubject ) {
                                    let p = this._serialize(module,val,undefined,metaRoot);
                                    meta[key] = {};
                                    meta[key].uuid = val.uuid;
                                }
                                else
                                if( val instanceof GL.Object3D ) {
                                    let p = this._serialize(module,val,undefined,metaRoot);
                                    meta[key] = {};
                                    meta[key].uuid = val.uuid;
                                }
                                else
                                if( val instanceof GL.Material ) {
                                    let p = this._serialize(module,val,undefined,metaRoot);
                                    meta[key] = {};
                                    meta[key].uuid = val.uuid;
                                }
                                else
                                if( val instanceof GL.Geometry ) {
                                    let p = this._serialize(module,val,undefined,metaRoot);
                                    meta[key] = {};
                                    meta[key].uuid = val.uuid;
                                }
                                else {
                                    // stack overflow
                                    //meta[key] = this._serialize(module,val,undefined,metaRoot);
                                }
                            }
                            else
                            if( typeof val === 'number' || typeof val === 'string' ) {
                                meta[key] = val;
                            }
                            p=null;
                        } else {
                            p = Object.getPrototypeOf(p);
                        }
                    }
                }
            }
            return meta;
        }
    }
    /**
     * deserialize
     *
     * @static
     * @param {any} module
     * @param {any} meta
     * @param {any} metaRoot
     * @returns
     * @memberof Util
     */
    static _deserialize( module:any, meta:any, metaRoot:any, object3Ds:{[uuid:string]:GL.Object3D|GL.Material|GL.Geometry} ) {

        if (meta instanceof Array) {

            let output : any = [];
            for( let c in meta ) {
                output[c] = this._deserialize( module, meta[c], metaRoot, object3Ds );
            }
            return output;

        } else {

            let link1 = this._ubjects[meta.uuid];
            if( link1 !== undefined ) {
                return link1;
            }
            let link2 = object3Ds[meta.uuid];
            if( link2 !== undefined ) {
                return link2;
            }

            let output : any = {};

            if ( meta.class === undefined ) {
                if( meta.uuid in metaRoot.ubjects ) {
                    output = this._deserialize( module, metaRoot.ubjects[meta.uuid], metaRoot, object3Ds );
                }
            } else {
                output = new module[meta.class]();

                for (let property in meta) {

                    if (property === 'class') continue;

                    let metaProp = meta[property];

                    if (typeof metaProp === 'object') {
                        output[property] = this._deserialize( module, metaProp, metaRoot, object3Ds );
                    }
                    else
                    if( typeof metaProp === 'number' || typeof metaProp === 'string' ) {
                        output[property] = metaProp;
                    }
                }
            }

            return output;
        }
    }
}
window['UNITS'][Ubject.name]=Ubject;
