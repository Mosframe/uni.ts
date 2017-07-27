import * as GL              from './Graphic';
import { GameObject     }   from './GameObject';
import { Transform      }   from './Transform';
import { Ubject         }   from './Ubject';



/**
 * Component type
 *
 * @author mosframe / https://github.com/mosframe
 * @export
 * @interface ComponentType
 * @template T
 */
export interface ComponentType<T> {
    new(gameObject:GameObject):T;
}

/**
 * Base class for everything attached to GameObjects.
 *
 * Note that your code will never directly create a Component.
 * Instead, you write script code, and attach the script to a GameObject.
 * See Also: ScriptableObject as a way to create scripts that do not attach to any GameObject.
 *
 * @author mosframe / https://github.com/mosframe
 *
 * @export
 * @class Temp
 * @extends {Ubject}
 */
export class Component extends Ubject {

    // [ Public Variables ]

    /**
     * get GL.Object3D
     *
     * @readonly
     * @type {GL.Object3D}
     * @memberof Component
     */
    get core() : GL.Object3D { return this.gameObject.core; }
    /**
     * The game object this component is attached to. A component is always attached to a game object.
     *
     * @type {GameObject}
     * @memberof Component
     */
    get gameObject () : GameObject      { return this._gameObject; }
    set gameObject ( value:GameObject ) { this._gameObject = value }
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

    // [ Protected Variables ]

    protected _gameObject : GameObject;

    // [ Protected Functions ]

    protected _onChanged () {}
}
window['UNITS'][Component.name]=Component;
