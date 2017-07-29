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
                this._serialize( window['UNITS'], obj, undefined, meta );
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
            this._ubjects[uuid] = this._deserialize( window['UNITS'], meta.ubjects[uuid], meta, object3Ds );
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
            this._serialize( window['UNITS'], Ubject._ubjects[c], undefined, meta );
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
    static getUbject( uuid:string ) : Ubject {
        return this._ubjects[uuid];
    }
    /**
     * remove ubject
     *
     * @static
     * @param {string} uuid
     * @memberof Ubject
     */
    static remove ( uuid:string ) {
        delete this._ubjects[uuid];
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
     * @param {any} [metaRoot]
     * @returns {*}
     * @memberof Util
     */
    protected static _serialize ( module:any, target:any, metaRoot?:any ) : any {

        /*
            리터럴이면 저장
            오브젝트이면
                멤버를 조사
                    Ubject이면
                        메타에 등록되어 있지 않으면
                            제귀로 등록
                        링크 UUID
                    Object3D이면
                        링크 UUID
                    배열이면
                        배열생성
                        배열멤버 조사
                            배열멤버가 리터럴이면 저장
                            배열멤버가 Ubject이면
                                메타에 등록되어 있지 않으면
                                    제귀로 등록
                                링크 UUID
                            Object3D이면
                                링크 UUID
                            배열이면
                                배열생성
                                배열멤버 조사
                                    배열멤버가 리터럴이면 저장
                                    배열멤버가 Ubject이면
                                        메타에 등록되어 있지 않으면
                                            제귀로 등록
                                        링크 UUID
                                    Object3D이면
                                        링크 UUID
                                    배열이면
                                        ....


        */

        // [ null ]
        if (target === null) return target;

        // [ number, string ]
        if( typeof target === 'number' || typeof target === 'string' ) {
            return target;
        }

        // [ object ]
        let output:any = {};
        if( metaRoot === undefined ) {
            metaRoot = output;
        }
        if( typeof target !== 'object' ) return output;

        // [ class ]
        if (target.constructor.name in module) {
            output.class = target.constructor.name;
            if( target instanceof Ubject ) {
                target._avaliable = true;
            }
        }

        // [ properties ]
        for (let key in target) {
            if (key[0] !== '_' || key === "_core" ) {

                let val = target[key];
                let p:Object|null = target;

                while(p) {
                    let descriptor = Object.getOwnPropertyDescriptor(p, key);
                    if (descriptor && ((descriptor.get && descriptor.set) || (!descriptor.get && !descriptor.set))) {
                        if (typeof val === 'object') {

                            // [ Ubject ]
                            if( val instanceof Ubject ) {
                                if( metaRoot.ubjects[val.uuid] === undefined ) {
                                    metaRoot.ubjects[val.uuid] = this._serialize(module,target,metaRoot);
                                }
                                output[key] = {};
                                output[key].uuid = val.uuid;
                            }
                            else
                            if( val instanceof GL.Object3D ) {
                                output[key] = {};
                                output[key].uuid = val.uuid;
                            }
                            else
                            if( val instanceof GL.Material ) {
                                output[key] = {};
                                output[key].uuid = val.uuid;
                            }
                            else
                            if( val instanceof GL.Geometry ) {
                                output[key] = {};
                                output[key].uuid = val.uuid;
                            }
                            else
                            if( val instanceof Array ) {
                                output[key] = [];
                                for( let a in val ) {
                                    output[key][a] = this._serialize(module,val[a],metaRoot);
                                }
                            }
                            else {
                                // stack overflow
                                //meta[key] = this._serialize(module,val,metaRoot);
                            }
                        }
                        else
                        if( typeof val === 'number' || typeof val === 'string' ) {
                            output[key] = val;
                        }
                        p=null;
                    } else {
                        p = Object.getPrototypeOf(p);
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
     * @param {*} meta
     * @param {*} metaRoot
     * @param {({[uuid:string]:GL.Object3D|GL.Material|GL.Geometry})} object3Ds
     * @returns
     * @memberof Ubject
     */
    static _deserialize( module:any, meta:any, metaRoot:any, object3Ds:{[uuid:string]:GL.Object3D|GL.Material|GL.Geometry} ) {


        // 디버깅중...
        // 여기서부터 잘되는지 추적한다.

        // [ null ]
        if( meta === null ) return meta;

        // [ number, string ]
        if( typeof meta === 'number' || typeof meta === 'string' ) {
            return meta;
        }

        // [ array ]
        if (meta instanceof Array) {

            let output : any = [];
            for( let c in meta ) {
                output[c] = this._deserialize( module, meta[c], metaRoot, object3Ds );
            }
            return output;
        }

        if( typeof meta !== 'object' ) return meta;

        // [ object ]
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

                if (metaProp instanceof Array) {

                    output[property] = [];
                    for( let c in metaProp ) {
                        output[property][c] = this._deserialize( module, metaProp[c], metaRoot, object3Ds );
                    }
                    continue;
                }

                if (typeof metaProp === 'object') {

                    let link1 = this._ubjects[meta.uuid];
                    if( link1 !== undefined ) {
                        output[property] = link1;
                        continue;
                    }

                    let link2 = object3Ds[meta.uuid];
                    if( link2 !== undefined ) {
                        output[property] = link2;
                        continue;
                    }

                    output[property] = this._deserialize( module, metaProp, metaRoot, object3Ds );
                    continue;
                }

                if( typeof metaProp === 'number' || typeof metaProp === 'string' ) {
                    output[property] = metaProp;
                    continue;
                }
            }
        }
        return output;
    }
}
window['UNITS'][Ubject.name]=Ubject;
