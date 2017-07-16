import * as Engine  from './Interfaces';

import * as GL                      from '../Engine/Graphic';
import { objects                }   from './Interfaces';
import { Type                   }   from '../libs/dotnet/System/Types';
import { Activator              }   from './Activator';
import { Color                  }   from './Color';
import { Component              }   from './Component';
import { ComponentType          }   from './Component';
import { Geometry               }   from './Geometry';
import { Material               }   from './Material';
import { Mesh                   }   from './Mesh';
import { MeshFilter             }   from './MeshFilter';
import { MeshLambertMaterial    }   from './MeshLambertMaterial';
import { MeshRenderer           }   from './MeshRenderer';
import { PrimitiveType          }   from './PrimitiveType';
import { Scene                  }   from './SceneManagement/Scene';
import { SceneManager           }   from './SceneManagement/SceneManager';
import { ShaderType             }   from './ShaderType';
import { Transform              }   from './Transform';
import { Ubject                 }   from './Ubject';
import { Vector3                }   from './Vector3';

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
    get core () : GL.Object3D       { return this._core; }
    set core ( value:GL.Object3D )  {
        if( this._core ) {
            if( this._core.parent ) {
                this._core.parent.add( value );
            }
        }
        this._core = value;
        this._core.name = this.name;

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
     * to JSON
     *
     * @returns {*}
     * @memberof GameObject
     */
    toJSON ( meta?:any ) : any {

        if( meta === undefined ) {
            meta = {};
        }

        meta.components = [];
        for( let index in this._components ) {
            meta.components[index] = GameObject._serialize( this._components[index] );
        }
        return meta;
    }

    fromJSON ( meta:any ) {
        this._components = [];
        for( let index in meta.components ) {
            let compo = new objects[meta.components[index].type](this);
            Object.assign( compo, meta.components[index] );
            //compo['_gameObject'] = this;
            console.log( "GameObject.fromJSON", compo );
            this._components.push( compo );
        }
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

        this._scene = SceneManager.getActiveScene();

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
