/**
 * Ubject.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import deprecated   from 'deprecated-decorator';
import * as uuid    from 'uuid';
import * as GL      from './Graphic';
import {Core}       from './Core';
import {Util}       from './Util';

/**
 * Base class for all objects Unicon can reference.
 *
 * @export
 * @class Ubject
 */
export class Ubject extends Object {

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
    get name () : string        { return  this._core.name; }
    set name ( value:string )   { this._core.name = value; }

    get uuid () : string        { return this._core.uuid; }
    set uuid ( value:string )   {
        delete Ubject._ubjects[this._core.uuid];
        this._core.uuid = value;
        Ubject._ubjects[this._core.uuid] = this;
    }

    get core () : Core|GL.Object3D      { return this._core; }
    set core ( value:Core|GL.Object3D ) {
        delete Ubject._ubjects[this._core.uuid];
        this._core = value;
        Ubject._ubjects[this._core.uuid] = this;
    }

    // [ Constructors ]

    /**
     * Creates an instance of Ubject.
     *
     * @memberof Ubject
     */
    constructor( core:Core|GL.Object3D ) {
        super();
        if( core === undefined ) {
            core = new Core();
        }
        this.core = core;
        Ubject._ubjects[this.uuid] = this;
    }

    // [ Public Functions ]

    /**
     * Returns the instance id of the object.
     *
     * @returns {string}
     * @memberof Ubject
     */
    getInstanceID () : string { return this.uuid; }
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

    static serialize (meta?:any) : any {

        meta.ubjects = {};
        for( let c in Ubject._ubjects ) {
            Ubject._serialize( window['UNITS'], Ubject._ubjects[c], undefined, meta );
        }
        return meta;
    }

    static deserialize (meta:any) : any {
        Ubject._ubjects = {};
        for( let c in meta.ubjects ) {
            Ubject._ubjects[c] = Ubject._deserialize( window['UNITS'], meta.ubjects[c], meta );
        }
    }

    static clear() {
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

    protected _core : Core | GL.Object3D;

    // [ Protected Functions ]


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
                        meta[key].link = 'Ubject';
                        meta[key].uuid = val.uuid;
                    }
                    else
                    if( val instanceof GL.Object3D ) {
                        meta[key] = {};
                        meta[key].link = 'Object3D';
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
            }

            for (let key in target) {
                if (key[0] !== '_') {

                    let val = target[key];
                    let p:Object|null = target;

                    while(p) {
                        let descriptor = Object.getOwnPropertyDescriptor(p, key);
                        if (descriptor && ((descriptor.get && descriptor.set) || (!descriptor.get && !descriptor.set))) {
                            if (typeof val === 'object') {

                                let p = this._serialize(module,val,undefined,metaRoot);
                                if( val instanceof Ubject ) {
                                    meta[key] = {};
                                    meta[key].link = 'Ubject';
                                    meta[key].uuid = val.uuid;
                                }
                                else
                                if( val instanceof GL.Object3D ) {
                                    meta[key] = {};
                                    meta[key].link = 'Object3D';
                                    meta[key].uuid = val.uuid;
                                }
                                else {
                                    meta[key] = p;
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
    static _deserialize( module:any, meta:any, metaRoot:any ) {

        if (meta instanceof Array) {

            let output : any = [];

            for( let c in meta ) {
                output[c] = this._deserialize( module, meta[c], metaRoot );
            }

            return output;
        } else {

            if( meta.uuid in this._ubjects ) {
                return this._ubjects[meta.uuid];
            }

            if( 'link' in meta && 'uuid' in meta ) {
                if( meta.link === 'Ubject' ) {
                    if( meta.uuid in metaRoot.ubjects ) {
                        return this._deserialize( module, metaRoot.ubjects[meta.uuid], metaRoot );
                    }
                    return undefined;
                }
                else
                if( meta.link === 'Object3D' ) {
                    // TODO : GL.Object3D ...
                    //return meta.scene.FindObjectOfType(meta.uuid);
                    return meta;
                }
            }

            let output : any = {};

            if ( 'class' in meta ) {
                output = new module[meta.class]();
            }

            for (let property in meta) {

                if (property === 'link') continue;
                if (property === 'class') continue;
                if (property === 'arguments') continue;

                let metaProp = meta[property];

                if (typeof metaProp === 'object') {
                    output[property] = this._deserialize( module, metaProp, metaRoot );
                }
                else
                if( typeof metaProp === 'number' || typeof metaProp === 'string' ) {
                    output[property] = metaProp;
                }
            }
            return output;
        }
    }
}
window['UNITS'][Ubject.name]=Ubject;
