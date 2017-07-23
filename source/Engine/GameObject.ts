import * as GL                      from '../Engine/Graphic';
import { Type                   }   from '../libs/dotnet/System/Types';
import { Activator              }   from './Activator';
import { Color                  }   from './Color';
import { Component              }   from './Component';
import { ComponentType          }   from './Component';
import { Geometry               }   from './Geometry';
import { Material               }   from './Material';
import { Mesh                   }   from './Mesh';
import { MeshFilter             }   from './MeshFilter';
import { MeshStandardMaterial   }   from './MeshStandardMaterial';
import { MeshRenderer           }   from './MeshRenderer';
import { PrimitiveType          }   from './PrimitiveType';
import { Scene                  }   from './Scene';
import { SceneManager           }   from './SceneManager';
import { ShaderType             }   from './ShaderType';
import { Transform              }   from './Transform';
import { Ubject                 }   from './Ubject';
import { Vector3                }   from './Vector3';


/**
 * Base class for all entities in Uni.ts scenes.
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
    */
    get avaliable () : boolean { return this.core!==undefined; }
    /*
    isStatic	Editor only API that specifies if a game object is static.
    layer	The layer the game object is in. A layer is in the range [0...31].
    */
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
     * The name of the object.
     *
     * @readonly
     * @type {string}
     * @memberof Ubject
     */
    get name () : string        { return this._name; }
    set name ( value:string )   { this._name = value; if(this.core!==undefined) this.core.name = this._name; }

    /**
     * get core object
     *
     * @readonly
     * @type {GL.Object3D}
     * @memberof GameObject
     */
    get core () : GL.Object3D       { return this._core; }
    set core ( value:GL.Object3D )  {
        if( this._core !== undefined ) {
            if( this._core.parent ) {
                this._core.parent.add( value );
            }
        }
        this._core = value;
        this._core.name = this._name;

        for (let c=0; c<value.children.length; ++c ) {
            let child = value.children[c];

            let gameObject = new GameObject(child.name);
            gameObject.core = child;

            // TODO : 타입에 따라서 컴포넌트 추가
			if( child instanceof GL.Mesh ){
            }

            this._scene.regist( gameObject );
        }
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
        instance.gameObject = this;
        // [ add components ]
        this.components.push( instance );
        return <T>instance;
    }
    /**
     * Adds a component class of componentName to the game object.
     *
     * @param {string} componentName
     * @returns {Component}
     * @memberof GameObject
     */
    addComponentByName( componentName:string ) : Component {

        // [ instance ]
        let activator = new Activator<Component>(window);
        let instance = activator.createInstance( componentName, this );
        instance.gameObject = this;

        // [ add components ]
        this.components.push( instance );

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
        for( let component of this.components ) {
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
    getComponentByName( componentName:string ) : Component|undefined {
        for( let component of this.components ) {
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
        let index = this.components.indexOf( component );
        if( index > -1 ) {
            this.components.splice(index,1);
        }
    }
    removeComponentByName ( componentName:string ) {
        let components = this.components.filter( t => t.name == componentName );
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
     * to JSON
     *
     * @returns {*}
     * @memberof GameObject
     */
    toJSON ( meta?:any ) : any {
        let output : any = {};
        output.link = 'Ubject';
        output.uuid = this.uuid;
        return output;
    }

    fromJSON ( meta:any ) {
        //this._deserialize( meta );
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
        let material    = new MeshStandardMaterial();
        let mesh        = new Mesh();

        mesh.geometry = geometry;

        let meshFiler = gameObject.addComponent( MeshFilter );
        meshFiler.sharedMesh = mesh;

        let renderer = gameObject.addComponent( MeshRenderer );
        renderer.sharedMaterial = material;

        // Y축이 위로 향하도록 축을 회전
        if( type === PrimitiveType.Plane ) {
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

        // [ name ]
        if( !name ) name = 'GameObject';
        this._name = name;

        // [ core ]
        this.core  = new GL.Object3D();

        // [ scene ]
        this._scene = SceneManager.getActiveScene();

        // [ transform ]
        this._transform = this.addComponent( Transform );

        // [ components ]
        for( let componentName of componentNames ) {
            this.addComponentByName( componentName );
        }
    }

    // [ Protected Variables ]

    protected components        : Component[] = [];
    protected _transform        : Transform;
    protected _scene            : Scene;
    protected _core             : GL.Object3D;

}
window['UNITS'][GameObject.name]=GameObject;
