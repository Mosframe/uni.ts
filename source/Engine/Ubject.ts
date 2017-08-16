/**
 * Ubject.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';
import { GL             }   from './Graphic';
import { using          }   from './Using';
import { IDisposable    }   from './Using';
import { Type           }   from './Type';
import { Util           }   from './Util';
import { Scene          }   from './Scene';
import { SceneManager   }   from './SceneManager';

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

        this.__scene.removeUbject( this._uuid );
        this._uuid=value;
        this.__scene.registerUbject( this._uuid, this );
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
        // [ scene ]
        this.__scene = SceneManager.getActiveScene();
        this.__scene.registerUbject( this._uuid, this );
    }


    // [ Public Functions ]

    /**
     * dispose
     *
     * @memberof Ubject
     */
    dispose() {
        this.__scene.removeUbject(this._uuid);
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
    */

    /*
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

    protected       _name           : string;
    protected       _uuid           : string;

    protected       __avaliable     : boolean;
    protected       __scene         : Scene;
    protected       __instanceID    : number;

    // [ Private Static Variables ]

    private static  __nextInstanceID: number = 1;
}
UnitsEngine[Ubject.name] = Ubject;
