import {Type                } from '../libs/dotnet/System/Types';
import * as GL                from '../Engine/Graphic';
import {Activator           } from '../Engine/Activator';
import {Color               } from '../Engine/Color';
import {Component           } from '../Engine/Component';
import {ComponentType       } from '../Engine/Component';
import {Geometry            } from '../Engine/Geometry';
import {Material            } from '../Engine/Material';
import {Mesh                } from '../Engine/Mesh';
import {MeshFilter          } from '../Engine/MeshFilter';
import {MeshLambertMaterial } from '../Engine/MeshLambertMaterial';
import {MeshRenderer        } from '../Engine/MeshRenderer';
import {PrimitiveType       } from '../Engine/PrimitiveType';
import {Scene               } from '../Engine/SceneManagement/Scene';
import {SceneManager        } from '../Engine/SceneManagement/SceneManager';
import {ShaderType          } from '../Engine/ShaderType';
import {Transform           } from '../Engine/Transform';
//import {Type                } from '../Engine/Type';
import {Ubject              } from '../Engine/Ubject';
import {Vector3             } from '../Engine/Vector3';

/**
 * Base class for all entities in Unicon scenes.
 *
 * @author mosframe / https://github.com/mosframe
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
    isStatic	Editor only API that specifies if a game object is static.
    layer	The layer the game object is in. A layer is in the range [0...31].
    */
    /**
     * The name of the object.
     *
     * @readonly
     * @type {string}
     * @memberof GameObject
     */
    get name () : string        { return  this._name; }
    set name ( value:string )   { this._name = value; this._core.name = name; }
    /**
     * Scene that the GameObject is part of.
     *
     * @readonly
     * @type {Scene}
     * @memberof GameObject
     */
    get scene() : Scene { return this._scene; }
    /*
    tag	The tag of this game object.
    */
    /**
     * The Transform attached to this GameObject.
     *
     * @type {Transform}
     * @memberof GameObject
     */
    get transform () : Transform { return this._transform; }


    /**
     * get core object
     *
     * @readonly
     * @type {GL.Object3D}
     * @memberof GameObject
     */
    get core() : GL.Object3D        { return this._core; }
    set core( value:GL.Object3D )   {
        if( this._scene ) {
            if( this._core ) this._scene.core.remove( this._core );
            if( value ) this._scene.core.add( value );
        }
        this._core = value;
        this._core.name = this.name;
    }

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
        let instance = new type(this);
        instance['_gameObject'] = this;
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
        let activator = new Activator<Component>(window);
        let instance = activator.createInstance( componentName, this );
        instance['_gameObject'] = this;

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
    SendMessage	Calls the method named methodName on every MonoBehaviour in this game object.
    SendMessageUpwards	Calls the method named methodName on every MonoBehaviour in this game object and on every ancestor of the behaviour.
    SetActive	Activates/Deactivates the GameObject.
    */

   /**
     * to JSON
     *
     * @returns {*}
     * @memberof GameObject
     */
    public toJSON(): any {

        let output:any = {};

        // [ components ]
        output.components = [];
        for( let key in this._components ) {
            output.components[key] = Ubject._serialize( this._components[key] );
        }

        return output;
    }

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
        let material    = new MeshLambertMaterial();
        let mesh        = new Mesh( geometry );

        console.log( mesh );

        let meshFiler = gameObject.addComponent( MeshFilter );
        meshFiler.mesh = mesh;

        let renderer = gameObject.addComponent( MeshRenderer );
        renderer.material = material;

        // Y축이 위로 향하도록 축을 회전
        if( type === PrimitiveType.plane ) {
            gameObject._transform.core.rotation.x = -0.5 * Math.PI;
            //let eulerAngles = gameObject.transform.eulerAngles;
            //gameObject.transform.eulerAngles = new Vector3(-0.5 * Math.PI, eulerAngles.y, eulerAngles.z );
            meshFiler.core.receiveShadow = true;
        }

        return gameObject;
    }

    /*
    static Find	Finds a GameObject by name and returns it.
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

        // [ core ]
        this._core  = new GL.Object3D();

        // [ name ]
        if( !name ) name = 'GameObject';
        this.name = name;

        // [ scene ]
        //this._scene = SceneManager.getActiveScene();
        //this._scene.add( this.core );

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
    protected _scene            : Scene;
    protected _core             : GL.Object3D;

}
