/**
 * Ubject.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import deprecated   from 'deprecated-decorator';
import * as uuid    from 'uuid';
import * as GL      from './Graphic';
import {Util}       from './Util';

/**
 * Base class for all objects Unicon can reference.
 *
 * @export
 * @class UObject
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
    get name () : string        { return  this._name; }
    set name ( value:string )   { this._name = value; }

    // [ Constructors ]

    /**
     * Creates an instance of Ubject.
     *
     * @memberof Ubject
     */
    constructor() {
        super();
        this.uuid = GL.Math.generateUUID();
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

    // [ Protected Variables ]

    protected _name         : string;
    protected uuid          : string;

    // [ Protected Functions ]

    /*
    object타입이 아닌경우 _가 없으면 저장한다.
    object타입인경우
        Object3D타입인 경우
            uuid만 저장, 나중에 검색하여 링크
        Component타입인 경우
            등록이 되어있는지 검사 window['units']
            등록되어 있지 않으면
        ScriptableObject 타입인 경우
        그외타입인경우

    */
    protected _serialize( obj:any ) : any {

        if (obj === null) { return obj; }

        if (obj instanceof Array) {
            let output: any[] = [];
            for (let key in obj) {
                output[key] = this._serialize(obj[key]);
            }
            return output;

        } else {

            let output: any = {};

            for (let key in obj) {
                if (key[0] !== '_') {
                    let val = obj[key];
                    let p = val;
                    while(p) {
                        let descriptor = Object.getOwnPropertyDescriptor(obj, key);
                        if (descriptor && ((descriptor.get && descriptor.set)||(!descriptor.get && !descriptor.set)) ) {
                            if (typeof val === 'object') {
                                output[key] = this._serialize(val);
                            } else {
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
    }

    protected _deserialize( meta, environment ) {
        let instance = new environment[meta.type]();
        for ( let property in meta ) {
            if ( !meta.hasOwnProperty(property) ) {
                continue;
            }

            if (typeof meta[property] === 'object') {
                instance[property] = this._deserialize( meta[property], environment );
            } else {
                instance[property] = meta[property];
            }
        }
        return instance;
    }
}

window['units'][Ubject.name]=Ubject;
