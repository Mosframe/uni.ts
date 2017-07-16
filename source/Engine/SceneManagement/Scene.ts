/**
 * Scene.ts
 *
 * @author mosframe / https://github.com/mosframe
 *
 * @export
 * @class Scene
 */

import * as GL              from '../Graphic';
import { GameObject     }   from '../GameObject';
import { SceneManager   }   from './SceneManager';

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
     * add GameObject
     *
     * @param {GameObject} gameObject
     * @memberof Scene
     */
    add( gameObject:GameObject ) {
        this.regist( gameObject);
        this._core.add( gameObject.core );
    }
    /**
     * regist GameObject
     *
     * @param {GameObject} gameObject
     * @memberof Scene
     */
    regist( gameObject:GameObject ) {
        this._gameObjects[gameObject.core.uuid] = gameObject;
    }
    /**
     * remove gameObject
     *
     * @param {GameObject} gameObject
     * @memberof Scene
     */
    remove ( gameObject:GameObject ) {
        delete this._gameObjects[gameObject.core.uuid];
        gameObject.core.parent.remove( gameObject.core );
    }
    /**
     * to JSON
     *
     * @param {*} [meta]
     * @returns {*}
     * @memberof Scene
     */
    toJSON ( meta:any ) : any {
        meta.scene = this._core.toJSON();
        meta.gameObjects = {};
        for (let key in this._gameObjects ) {
            meta.gameObjects[key] = this._gameObjects[key].toJSON();
        }
        console.log("Scene.toJSON", meta);
        return meta;
    }
    /**
     * from JSON
     *
     * @param {*} meta
     * @memberof Scene
     */
    fromJSON ( meta:any ) {
        let loader = new GL.ObjectLoader();
        this._core = <GL.Scene>loader.parse( meta.scene );

        this._gameObjects = {};
        for (let key in meta.gameObjects ) {
            let gameObject = new GameObject();
            console.log("Scene.fromJSON", meta.gameObjects[key]);
            gameObject.fromJSON( meta.gameObjects[key] );
            this._gameObjects[key] = gameObject;
        }
    }

    /**
     * Returns all the root game objects in the scene.
     *
     * @returns {GameObject[]}
     * @memberof Scene
     */
    getRootGameObjects () : GameObject[] {
        let gameObjects : GameObject[] = [];
        for (let child of this._core.children) {
            gameObjects.push( this._gameObjects[child.uuid] );
        }
        return gameObjects;
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
    protected _gameObjects:{[uuid:string]:GameObject} = {};
}
