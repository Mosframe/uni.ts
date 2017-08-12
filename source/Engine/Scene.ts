/**
 * Scene.ts
 *
 * @author mosframe / https://github.com/mosframe
 *
 * @export
 * @class Scene
 */

import { GL             }   from './Graphic';
import { Ubject         }   from './Ubject';
import { GameObject     }   from './GameObject';
import { SceneManager   }   from './SceneManager';
import { Serializable   }   from './Serializable';

/**
 * Run-time data structure for *.unity file.
 *
 * @export
 * @class Scene
 */
export class Scene {

    // [ Public Variables ]

    /*
    buildIndex	Returns the index of the scene in the Build Settings. Always returns -1 if the scene was loaded through an AssetBundle.
    isDirty	Returns true if the scene is modifed.
    isLoaded	Returns true if the scene is loaded.
    */
    /**
     * Returns the name of the scene.
     *
     * @type {string}
     * @memberof Scene
     */
    get name () : string        { return  this._core.name; }
    set name ( value:string )   { this._core.name = value; }
    /*
    path	Returns the relative path of the scene. Like: "Assets/MyScenes/MyScene.unity".
    */
    /**
     * The number of root transforms of this scene.
     *
     * @readonly
     * @type {number}
     * @memberof Scene
     */
    get rootCount () : number { return this._core.children.length; }

    /**
     * get GL.Scene
     *
     * @readonly
     * @type {GL.Scene}
     * @memberof Scene
     */
    get core() : GL.Scene { return this._core; }

    // [ Public Functions ]

    /**
     * add Object
     *
     * @param {GL.Object3D} object
     * @memberof Scene
     */
    add( object:GL.Object3D ) {
        this._core.add( object );
    }
    /**
     * remove object
     *
     * @param {GL.Object3D} object
     * @memberof Scene
     */
    remove ( object:GL.Object3D ) {
        object.parent.remove( object );
    }
    /**
     * to JSON
     *
     * @param {*} [meta]
     * @returns {*}
     * @memberof Scene
     */
    toJSON ( meta:any ) : any {

        // [ scene objects ]
        meta.scene = this._core.toJSON();

        // [ serialize ]
        Ubject.serialize( meta, this.getObjects() );

        console.log( "Scene.toJSON.meta", meta );

        return meta;
    }
    /**
     * from JSON
     *
     * @param {*} meta
     * @memberof Scene
     */
    fromJSON ( meta:any ) {

        // [ scene objects ]
        let loader = new GL.ObjectLoader();
        this._core = <GL.Scene>loader.parse( meta.scene );

        // [ deserialize ]
        Ubject.deserialize( meta, this.getObjects() );

        console.log( "window['UNITS']['Ubject'].__ubjects", window['UNITS']['Ubject'].__ubjects );
    }


    /**
     * Returns all the root objects in the scene.
     *
     * @returns {GL.Object3D[]}
     * @memberof Scene
     */
    getRootObjects () : GL.Object3D[] {
        let objects : GL.Object3D[] = [];
        for (let child of this._core.children) {
            objects.push( child );
        }
        return objects;
    }
    /**
     * Resutns all objects in the scene.
     *
     * @returns {{[uuid:string]:GL.Object3D}}
     * @memberof Scene
     */
    getObjects () : {[uuid:string]:GL.Object3D} {

        let objects : {[uuid:string]:GL.Object3D}  = {};
        this.core.traverse( object => {
            objects[object.uuid]=object;
            if( 'material' in object ) {
                objects[object['material'].uuid] = object['material'];
            }
            if( 'geometry' in object ) {
                objects[object['geometry'].uuid] = object['geometry'];
            }
        });
        return objects;
    }

    /*
    IsValid	Whether this is a valid scene. A scene may be invalid if, for example, you tried to open a scene that does not exist. In this case, the scene returned from EditorSceneManager.OpenScene would return False for IsValid.
    */

    // [ Public Operators ]

    /*
    operator !=	Returns true if the Scenes are different.
    operator ==	Returns true if the Scenes are equal.
    */

    // [ Constructors ]

    constructor() {
        this._core = new GL.Scene();
    }

    // [ Protected Functions ]

    protected _core : GL.Scene;
}
window['UNITS'][Scene.name] = Scene;
