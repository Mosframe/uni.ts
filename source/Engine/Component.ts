/**
 * Component.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import * as GL              from './Graphic';
import { ComponentType  }   from './Interfaces';
import { GameObject     }   from './GameObject';
import { Serializable   }   from './Serializable';
import { Ubject         }   from './Ubject';

/**
 * Base class for everything attached to GameObjects.
 *
 * Note that your code will never directly create a Component.
 * Instead, you write script code, and attach the script to a GameObject.
 * See Also: ScriptableObject as a way to create scripts that do not attach to any GameObject.
 *
 * @export
 * @class Temp
 * @extends {Ubject}
 */
export class Component extends Ubject {

    // [ Public Variables ]

    /**
     * The game object this component is attached to. A component is always attached to a game object.
     *
     * @type {GameObject}
     * @memberof Component
     */
    get gameObject () : GameObject      { return this._gameObject; }
    set gameObject (value:GameObject)   { this._gameObject=value; }
    /*
    tag	The tag of this game object.
    */

    // [ Public Functions ]

    /*
    BroadcastMessage	Calls the method named methodName on every MonoBehaviour in this game object or any of its children.
    CompareTag	Is this game object tagged with tag ?
    */
    getComponent<T extends Component>( type:ComponentType<T> ) : T|undefined {
        return this.gameObject.getComponent( type );
    }
    //	Returns the component of Type type if the game object has one attached, null if it doesn't.
    /*
    GetComponentInChildren	Returns the component of Type type in the GameObject or any of its children using depth first search.
    GetComponentInParent	Returns the component of Type type in the GameObject or any of its parents.
    GetComponents	Returns all components of Type type in the GameObject.
    GetComponentsInChildren	Returns all components of Type type in the GameObject or any of its children.
    GetComponentsInParent	Returns all components of Type type in the GameObject or any of its parents.
    SendMessage	Calls the method named methodName on every MonoBehaviour in this game object.
    SendMessageUpwards	Calls the method named methodName on every MonoBehaviour in this game object and on every ancestor of the behaviour.
    */

    // [ Constructors ]

    /**
     * Creates an instance of Component.
     * @memberof MeshFilter
     */
    constructor () {
        super();
    }

    // [ Protected Varriables ]
    //@Serializable
    protected _gameObject:GameObject;

    // [ Protected Functions ]

    protected _onChanged () {}
}
