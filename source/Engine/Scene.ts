/**
 * Scene.ts
 *
 * @author mosframe / https://github.com/mosframe
 *
 * @export
 * @class Scene
 */

import { UnitsEngine    }   from './UnitsEngine';
import { THREE          }   from './Core';
import { Type           }   from './Type';
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
     * @type {THREE.Scene}
     * @memberof Scene
     */
    get core() : THREE.Scene { return this._core; }

    // [ Public Functions ]

    /**
     * add Object
     *
     * @param {THREE.Object3D} object
     * @memberof Scene
     */
    add( object:THREE.Object3D ) {
        this._core.add( object );
    }
    /**
     * remove object
     *
     * @param {THREE.Object3D} object
     * @memberof Scene
     */
    remove ( object:THREE.Object3D ) {
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

        // [ Object3D ]
        meta.scene = this._core.toJSON();

        // [ Ubjects ]

        for( let uuid in this.__ubjects ) {
            this.__ubjects[uuid]['__avaliable'] = false;
        }
        meta.ubjects = {};
        let object3Ds = this.getAllObjects();

        for( let uuid in object3Ds ) {
            let obj = this.__ubjects[uuid];
            if( obj !== undefined ) {
                this.serialize( obj, meta );
            }
        }

        // [ avaliable ]
        this.validateUbjects();

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

        // [ Object3Ds ]

        let loader = new THREE.ObjectLoader();
        this._core = <THREE.Scene>loader.parse( meta.scene );

        // [ Ubjects ]

        let object3Ds = this.getAllObjects();
        this.clearUbjects();
        for( let uuid in meta.ubjects ) {
            this.deserialize( meta.ubjects[uuid], meta, object3Ds );
        }

        console.log( "Scene.fromJSON.ubjects", this.__ubjects );
    }

    /**
     * serialize
     *
     * @static
     * @param {any} target
     * @param {any} [meta]
     * @returns {*}
     * @memberof Util
     */
    serialize ( target:any, meta?:any ) : any {

        let output : any = {};

        // [ boolean | number | string ]
        if( typeof target === 'boolean' || typeof target === 'number' || typeof target === 'string' ) {
            output = target;
        }
        else
        // [ object ]
        if (typeof target === 'object') {

            // [ Array ]
            if( target instanceof Array ) {
                output = [];
                for( let key in target ) {
                    output[key] = this.serialize( target[key], meta );
                }
            }
            else
            // [ GL.Object3D ]
            if( target instanceof THREE.Object3D ) {
                output.module = 'GL';
                output.uuid = target.uuid;
            }
            else
            // [ GL.Material ]
            if( target instanceof THREE.Material ) {
                output.module = 'GL';
                output.uuid = target.uuid;
            }
            else
            // [ GL.Geometry ]
            if( target instanceof THREE.Geometry ) {
                output.module = 'GL';
                output.uuid = target.uuid;
            }
            else
            // [ Ubject ]
            if( target instanceof Ubject ) {

                // [ serialized sequence ]
                // 1. module name
                // 2. uuid
                // 3. class name
                // 4. class valiables

                // [ register ]
                if( meta.ubjects[target.uuid] === undefined ) {
                    let ubject:any ={};
                    ubject.module = 'UNITS';
                    ubject.uuid = target.uuid;
                    meta.ubjects[target.uuid] = ubject;

                    // [ class ]
                    if( target.constructor.name in UnitsEngine ) {
                        ubject.class = target.constructor.name;
                        target['__avaliable'] = true;
                    }

                    // [ properties ]
                    for( let key in target ) {
                        let value = target[key];
                        if( key[1] !== '_' ) { // __member
                            if ( typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' || typeof value === 'object' ) {
                                meta.ubjects[target.uuid][key] = this.serialize( value, meta );
                            }
                        }
                    }
                }

                output.module = 'UNITS';
                output.uuid = target.uuid;
            }
        }
        return output;
    }

    /**
     * deserialize
     *
     * @param {*} meta
     * @param {*} metaRoot
     * @param {{[uuid:string]:THREE.Object3D}} objects
     * @returns
     * @memberof Scene
     */
    deserialize( meta:any, metaRoot:any, objects:{[uuid:string]:THREE.Object3D} ) {

        let target:any;

        // [ boolean | number | string ]
        if( typeof meta === 'boolean' || typeof meta === 'number' || typeof meta === 'string' ) {
            target = meta;
        }
        else
        // [ array ]
        if( meta instanceof Array ) {
            target = [];
            for( let key in meta ) {
                target[key] = this.deserialize( meta[key], metaRoot, objects );
            }
        }
        else
        // [ object ]
        if( typeof meta === 'object' ) {

            // [ GL ]
            if( meta.module === 'GL' ) {
                if( meta.uuid in objects ) {
                    target = objects[meta.uuid];
                }
            }
            else
            // [ UNITS ]
            if( meta.module === 'UNITS' ) {

                if( meta.uuid in this.__ubjects ) {
                    target = this.__ubjects[meta.uuid];
                } else {

                    target = {};

                    if( meta.uuid in metaRoot.ubjects ) {
                        meta = metaRoot.ubjects[meta.uuid];

                        // [ instantiate ]
                        if( meta.class in UnitsEngine ) {
                            target = new UnitsEngine[meta.class]();
                            this.__ubjects[meta.uuid] = target;

                            for( let key in meta ) {
                                if( key !== 'module' && key !== 'class' ) {
                                    target[key] = this.deserialize( meta[key], metaRoot, objects );
                                }
                            }
                       }
                    }
                }
            }
        }
        return target;
    }

    /**
     * validate Ubjects
     *
     * @static
     * @memberof Ubject
     */
    validateUbjects() {

        let removes:any = [];
        for( let c in this.__ubjects ) {
            let o = this.__ubjects[c];
            if( !o ) {
                removes.push(c);
            }
            else
            if( !o['__avaliable'] ) {
                removes.push(c);
            }
        }
        for( let c in removes ) {
            delete this.__ubjects[removes[c]];
        }
    }

    /**
     * clear all ubjects
     *
     * @static
     * @memberof Ubject
     */
    clearUbjects() {
        this.__ubjects = {};
    }

    /**
     * Returns all the root objects in the scene.
     *
     * @returns {THREE.Object3D[]}
     * @memberof Scene
     */
    getRootObjects () : THREE.Object3D[] {
        let objects : THREE.Object3D[] = [];
        for (let child of this._core.children) {
            objects.push( child );
        }
        return objects;
    }
    /**
     * Resutns all objects in the scene.
     *
     * @returns {{[uuid:string]:THREE.Object3D}}
     * @memberof Scene
     */
    getAllObjects () : {[uuid:string]:THREE.Object3D} {

        let objects : {[uuid:string]:THREE.Object3D}  = {};
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


    /**
     * find
     *
     * @static
     * @param {string} uuid
     * @returns {Ubject}
     * @memberof Ubject
     */
    findUbjectByUUID ( uuid:string ) : Ubject {
        return this.__ubjects[uuid];
    }
    /**
     * find
     *
     * @static
     * @param {string} uuid
     * @returns {Ubject}
     * @memberof Ubject
     */
    findUbjectByName<T extends Ubject > ( type:Type<T>, name:string ) : T|undefined {

        let objects : THREE.Object3D[] = [];
        for (let key in this.__ubjects) {
            let ubject = this.__ubjects[key];
            if( ubject instanceof type ) {
                if( ubject.name === name ) {
                    return <T>ubject;
                }
            }
        }
    }

    registerUbject ( uuid:string, ubject:Ubject ) {
        this.__ubjects[uuid] = ubject;
    }

    removeUbject ( uuid:string ) {
        delete this.__ubjects[uuid];
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

    constructor( core?:THREE.Scene ) {
        if( core === undefined ) {
            this._core = new THREE.Scene();
        } else {
            this._core = core;
        }
    }

    // [ Private Variables ]

    private _core     : THREE.Scene;
    private __ubjects : {[uuid:string]:Ubject} = {};

    // [ Private Functions ]

    /**
     * real time process
     *
     * @private
     * @memberof Scene
     */
    private _rt() {

        // [ Initialization ]
        // awake : 인스턴스 생성 후 최초 gameObject가 활성화 될때 호출됨
        // onEnable : gameObject가 활성화 되었을때 호출됨
        // start : 인스턴스 된 후에 최초 한번만 호출됨

        // [ Physics Cycles ]
        // fixedUpdate : 물리 사이클에서 매 사이클마다 호출됨
        // yield WaitForFixedUpdate
        // internal physics update
        // OnTriggerXXX
        // OnCollisionXXX

        // [ Input Events ]
        // OnMouseXXX

        // [ Game Logic ]
        // update
        // yield null
        // yield waitForSeconds
        // yield www
        // yield startCoroutine
        // internal animation update
        // late update

        // [ scene rendering ]

        // [ Gizmo rendering ]

        // [ GUI rendering ]

        // [ End frame ]
        // yield waitForEndOfFrame

        // [ Pausing ]
        // onApplicationPause

        // [ Disable ]
        // onDisable : 비활성화되어 있는동안에만 호출된다...

        // [ Decommissioning ]
        // onApplicationQuit
        // onDisable
        // onDestroy

    }

}
UnitsEngine[Scene.name] = Scene;
