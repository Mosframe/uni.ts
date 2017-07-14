/**
 * Ubject.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

//import deprecated   from 'deprecated-decorator';
import * as GL      from '../Engine/Graphic';
import {Util}       from '../Engine/Util';


/**
 * Base class for all objects Unicon can reference.
 *
 * @export
 * @class UObject
 */
export class Ubject extends Object {

    // [ Public Static Variables ]

    /**
     * object has property
     *
     * @static
     * @param {object} object
     * @param {string} propertyName
     * @returns {boolean}
     * @memberof Ubject
     */
    static hasProperty ( object:object, propertyName:string ) : boolean {
        if( !object ) return false;
        return propertyName in object;
        //return Reflect.defineProperty( object, propertyName, {} );
    }

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
    }

    // [ Public Functions ]

    hasProperty ( propertyName:string ) : boolean {
        return Ubject.hasProperty( this,propertyName );
    }

    /**
     * to serialize (JSON)
     *
     * @param {*} meta meta data
     * @memberof Ubject
     */
    toJSON ( meta:any ) {

        // 기존에 이미 있는지 확인
        // Object3D 인경우 uuid로 검색
        // Component 인경우

        let output:any = {};
        JSON.stringify(this);
    }

    /*
    GetInstanceID	Returns the instance id of the object.
    ToString	Returns the name of the game object.
    */

    // [ Public Static Variables ]

    // [ Public Static Functions ]

    /*
    static Destroy	Removes a gameobject, component or asset.
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

    protected _name : string;


    // [ Protected Functions ]

    // [ Protected Static Variables ]

    // [ Protected Static Functions ]
}

