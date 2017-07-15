import * as GL  from '../../Engine/Graphic';
/**
 * Run-time data structure for *.unity file.
 *
 * @author mosframe / https://github.com/mosframe
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
    get name () : string        { return  this.core.name; }
    set name ( value:string )   { this.core.name = value; }
    /*
    path	Returns the relative path of the scene. Like: "Assets/MyScenes/MyScene.unity".
    rootCount	The number of root transforms of this scene.
    */

    /**
     * get GL.Scene
     *
     * @readonly
     * @type {GL.Scene}
     * @memberof Scene
     */
    get core() : GL.Scene { return this._core; }

    // [ Public Functions ]

    /*
    GetRootGameObjects	Returns all the root game objects in the scene.
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
