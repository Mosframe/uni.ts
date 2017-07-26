/**
 * Scene.ts
 *
 * @author mosframe / https://github.com/mosframe
 *
 * @export
 * @class Scene
 */

import * as GL              from './Graphic';
import { Ubject         }   from './Ubject';
import { GameObject     }   from './GameObject';
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
        meta.scene = this._core.toJSON();

        // 모든 게임오브젝트들과 연결되어 있는 Ubject들만 저장한다.
        // 필요없는 객체들은 모두 제거한다.
        // 씬에 존재하는 GameObject들만 저장한다.
        // uuid로 검색

        // gameObject[uuid]
        //    components[]
        //       link objects[]


        let uuids : string[] = [];
        this.core.traverse( object => {
            uuids.push( object.uuid );
            if( 'material' in object ) {
                uuids.push( object['material'].uuid );
            }
            if( 'geometry' in object ) {
                uuids.push( object['geometry'].uuid );
            }
        });


        Ubject.serialize( meta, uuids );

        //Ubject.serialize( meta );

        console.log("Scene.toJSON.meta", meta);

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

        let objects : {[uuid:string]:GL.Object3D|GL.Material|GL.Geometry} = {};
        this.core.traverse( object => {
            objects[object.uuid]=object;
            if( 'material' in object ) {
                objects[object['material'].uuid] = object['material'];
            }
            if( 'geometry' in object ) {
                objects[object['geometry'].uuid] = object['geometry'];
            }
        });

        Ubject.deserialize( meta, objects );

        //console.log("Scene.fromJSON.objects", Ubject['_ubjects'] );

        this._gameObjects = {};
        for (let key in Ubject['_ubjects'] ) {

            if( Ubject['_ubjects'][key] instanceof GameObject ) {
                let gameObject = <GameObject>Ubject['_ubjects'][key];
                this._gameObjects[gameObject.core.uuid] = gameObject;
            }
        }

        //console.log("Scene.fromJSON.gameObjects", this._gameObjects);
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
    protected _gameObjects:{[uuid:string]:GameObject} = {}; // all gameObjects in scene
}
