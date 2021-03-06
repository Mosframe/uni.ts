/**
 * GameObject.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine            }   from './UnitsEngine';
import { THREE                  }   from './Core';
import { ComponentType          }   from './Type';
import { Component              }   from './Component';
import { Scene                  }   from './Scene';
import { Transform              }   from './Transform';
import { Color                  }   from './Color';
import { Geometry               }   from './Geometry';
import { Material               }   from './Material';
import { Mesh                   }   from './Mesh';
import { MeshFilter             }   from './MeshFilter';
import { MeshRenderer           }   from './MeshRenderer';
import { MeshStandardMaterial   }   from './MeshStandardMaterial';
import { PrimitiveType          }   from './PrimitiveType';
import { SceneManager           }   from './SceneManager';
import { Serializable           }   from './Serializable';
import { serializable           }   from './Serializable';
import { ShaderType             }   from './ShaderType';
import { Ubject                 }   from './Ubject';
import { Vector3                }   from './Vector3';


/**
 * Base class for all entities in Uni.ts scenes.
 *
 * @export
 * @class GameObject
 * @extends {Ubject}
 */
export class GameObject extends Ubject {

    // [ Public Variables ]


    /*
    activeInHierarchy	Is the GameObject active in the scene?
    activeSelf	The local active state of this GameObject. (Read Only)
    */

    get core () : THREE.Object3D        { return this._core; }
    set core ( value : THREE.Object3D ) {
        this._core = value;
        this._core.name = this._name;
        this.uuid = value.uuid;
    }

    /*
    isStatic	Editor only API that specifies if a game object is static.
    layer	The layer the game object is in. A layer is in the range [0...31].
    */
    get name () : string        { return this._name; }
    set name ( value:string )   { this._name = value; if(this.core!==undefined) this.core.name = this._name; }
    get scene() : Scene         { return this.__scene; }
    /*
    tag	The tag of this game object.
    */
    get transform () : Transform { return this._transform; }


    // [ Public Functions ]

    /**
     * Adds a component class of componentType to the game object.
     *
     * @template T
     * @param {ComponentType<T>} type
     * @returns {T}
     * @memberof GameObject
     */
    addComponent<T extends Component>( type:ComponentType<T> ) : T {

        // [ instance ]
        let instance = new type();
        instance.gameObject = this;
        // [ add components ]
        this._components.push( instance );
        return <T>instance;
    }
    /**
     * Adds a component class of componentName to the game object.
     *
     * @param {string} componentName
     * @returns {Component}
     * @memberof GameObject
     */
    addComponent2( componentName:string ) : Component {

        // [ instance ]
        let instance = new UnitsEngine[componentName]();
        instance.gameObject = this;

        // [ add components ]
        this._components.push( instance );

        return instance;
    }
    /*
    BroadcastMessage	Calls the method named methodName on every MonoBehaviour in this game object or any of its children.
    CompareTag	Is this game object tagged with tag ?
    */
    /**
     * Returns the component of Type type if the game object has one attached, null if it doesn't.
     *
     * @template T
     * @param {ComponentType<T>} type
     * @returns {T}
     * @memberof GameObject
     */
    getComponent<T extends Component>( type:ComponentType<T> ) : T|undefined {
        for( let component of this._components ) {
            if( component instanceof type ) {
                return <T>component;
            }
        }
    }
    /**
     * Returns the component of string name if the game object has one attached, null if it doesn't.
     *
     * @param {string} componentName
     * @returns {(Component|undefined)}
     * @memberof GameObject
     */
    getComponent2( componentName:string ) : Component|undefined {
        for( let component of this._components ) {
            if( component.constructor.name === componentName ) {
                return component;
            }
        }
    }
    /*
    GetComponentInChildren	Returns the component of Type type in the GameObject or any of its children using depth first search.
    GetComponentInParent	Returns the component of Type type in the GameObject or any of its parents.
    GetComponents	Returns all components of Type type in the GameObject.
    GetComponentsInChildren	Returns all components of Type type in the GameObject or any of its children.
    GetComponentsInParent	Returns all components of Type type in the GameObject or any of its parents.
    */
    /**
     * Remove a component.
     *
     * @param {Component} component
     * @memberof GameObject
     */
    removeComponent ( component:Component ) {
        let index = this._components.indexOf( component );
        if( index > -1 ) {
            this._components.splice(index,1);
        }
    }
    removeComponent2 ( componentName:string ) {
        let components = this._components.filter( t => t.name == componentName );
        for( let component of components ) {
            this.removeComponent( component );
            break;
        }
    }
    /*
    SendMessage	Calls the method named methodName on every MonoBehaviour in this game object.
    SendMessageUpwards	Calls the method named methodName on every MonoBehaviour in this game object and on every ancestor of the behaviour.
    SetActive	Activates/Deactivates the GameObject.
    */

    /**
     * Creates a game object with a primitive mesh renderer and appropriate collider.
     *
     * @static
     * @param {PrimitiveType} type
     * @returns {GameObject}
     *
     * @memberof GameObject
     */
    static createPrimitive( type:PrimitiveType ) : GameObject {

        let gameObject  = new GameObject( PrimitiveType[type] );
        let geometry    = new Geometry( type );
        let material    = new MeshStandardMaterial();
        let mesh        = new Mesh();

        mesh.geometry = geometry;

        let meshFiler = gameObject.addComponent( MeshFilter );
        meshFiler['sharedMesh'] = mesh;

        let renderer = gameObject.addComponent( MeshRenderer );
        renderer['sharedMaterial'] = material;

        // Y축이 위로 향하도록 축을 회전
        if( type === PrimitiveType.Plane ) {
            gameObject._transform.core.rotation.x = -0.5 * Math.PI;
            //let eulerAngles = gameObject.transform.eulerAngles;
            //gameObject.transform.eulerAngles = new Vector3(-0.5 * Math.PI, eulerAngles.y, eulerAngles.z );
            //meshFiler.core.receiveShadow = true;
        }

        return gameObject;
    }
    /**
     * Finds a GameObject by name and returns it.
     *
     * @static
     * @param {string} name
     * @returns {(GameObject|undefined)}
     * @memberof GameObject
     */
    static find ( name:string ) : GameObject|undefined {
        return SceneManager.getActiveScene().findUbjectByName( GameObject, name );
    }
    /*
    static FindGameObjectsWithTag	Returns a list of active GameObjects tagged tag. Returns empty array if no GameObject was found.
    static FindWithTag	Returns one active GameObject tagged tag. Returns null if no GameObject was found.
    */

    // [ Constructors ]

    /**
     * Creates an instance of GameObject.
     *
     * Transform is always added to the GameObject that is being created.
     *
     * The creation of a GameObject with no script arguments will add the Transform but nothing else.
     *
     * Similarly, the version with just a single string argument just adds this and the Transform.
     *
     * Finally, the third version allows the name to be specified but also components to be passed in as an array.
     *
     * @param {string} [name]
     * @param {...string[]} componentNames
     * @memberof GameObject
     */
    constructor( name?:string, ...componentNames:string[] ) {
        super();

        // [ name ]
        if( !name ) name = 'GameObject';
        this._name = name;

        // [ core ]
        this._core  = new THREE.Object3D();

        // [ transform ]
        this._transform = this.addComponent( Transform );

        // [ components ]
        for( let componentName of componentNames ) {
            this.addComponent2( componentName );
        }
    }

    // [ Protected Variables ]

    protected _components       : Component[] = [];
    protected _transform        : Transform;
    protected _core             : THREE.Object3D;
}
UnitsEngine[GameObject.name] = GameObject;
