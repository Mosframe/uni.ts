/**
 * Tool.ts
 *
 * @author mrdoob ( http://mrdoob.com )
 * @author mosframe / https://github.com/mosframe
 */

import * as signals       	from 'signals';
import * as GL         		from '../Engine/Graphic';
import { Signal      	} 	from 'signals';
import { 				} 	from './date';
import { ICommand    	} 	from './interfaces';
import { ITool     		} 	from './interfaces';
import { ISignals    	} 	from './interfaces';
import { Config      	} 	from './Config';
import { History     	} 	from './History';
import { Loader      	} 	from './Loader';
import { Storage     	} 	from './Storage';
import { Command     	} 	from './Commands/Command';

import { GameObject     }   from '../Engine/GameObject';
import { Scene     		}   from '../Engine/Scene';
import { SceneManager	}	from '../Engine/SceneManager';

/**
 * Tool
 *
 * @export
 * @class Tool
 * @implements {ITool}
 */
export class Tool implements ITool {

    // [ Public Variables ]

    config          : Config;
    signals         : ISignals;
    DEFAULT_CAMERA  : GL.PerspectiveCamera;
	history         : History;
    storage         : Storage;
	loader          : Loader;
	camera          : GL.Camera;
	scene           : Scene;
	sceneHelpers    : GL.Scene;
	geometries      : {[uuid:string]:GL.Geometry|GL.BufferGeometry};
	materials       : {[uuid:string]:GL.Material};
	textures        : {[uuid:string]:GL.Texture};
	scripts         : {[uuid:string]:any[]};
	selected        : GL.Object3D | null;
	helpers         : {[uuid:string]:GL.Object3D};

    // [ Public Functions ]

    setTheme ( value:string ) {
        let theme = <HTMLLinkElement>document.getElementById( 'theme' );
		theme.href = value;
		this.signals.themeChanged.dispatch( value );
    }

	setScene ( scene:Scene ) {

		this.scene.core.uuid = scene.core.uuid;
		this.scene.name = scene.name;

		if ( scene.core.background !== null ) this.scene.core.background = scene.core.background.clone();
		if ( scene.core.fog !== null ) this.scene.core.fog = scene.core.fog.clone();

		this.scene.core.userData = JSON.parse( JSON.stringify( scene.core.userData ) );

		// avoid render per object

		this.signals.sceneGraphChanged.active = false;

		let gameObjects = scene.getRootGameObjects();

		for (let c=0;c<gameObjects.length; ++c) {
			this.addObject( gameObjects[c] );
		}

		this.signals.sceneGraphChanged.active = true;
		this.signals.sceneGraphChanged.dispatch();
	}

	addObject ( gameObject:GameObject ) {

		gameObject.core.traverse( ( child:GL.Object3D ) => {

			if( child instanceof GL.Mesh ){
                this.addGeometry( child.geometry );
                this.addMaterial( child.material );
            }

			this.addHelper( child );
		});

		this.scene.add( gameObject );

		this.signals.objectAdded.dispatch( gameObject.core );
		this.signals.sceneGraphChanged.dispatch();
	}

	moveObject ( object:GL.Object3D, parent:GL.Object3D, before:GL.Object3D ) {

		if( parent === undefined ) {
			parent = this.scene.core;
		}

		parent.add( object );

		// sort children array

		if( before !== undefined ) {
			var index = parent.children.indexOf( before );
			parent.children.splice( index, 0, object );
			parent.children.pop();
		}

		this.signals.sceneGraphChanged.dispatch();
	}

	nameObject ( gameObject:GameObject, name:string ) {
		gameObject.name = name;
		this.signals.sceneGraphChanged.dispatch();
	}

    removeObject ( gameObject:GameObject ) {

		if( gameObject.core.parent === null ) return; // avoid deleting the camera or scene

		gameObject.core.traverse( ( child:GL.Object3D ) => {
			this.removeHelper( child );
		});

		this.scene.remove( gameObject );

		this.signals.objectRemoved.dispatch( gameObject.core );
		this.signals.sceneGraphChanged.dispatch();
	}

	addGeometry ( geometry:GL.Geometry|GL.BufferGeometry ) {
		this.geometries[ geometry.uuid ] = geometry;
	}

	setGeometryName ( geometry:GL.Geometry|GL.BufferGeometry, name:string ) {
		geometry.name = name;
		this.signals.sceneGraphChanged.dispatch();
	}

	addMaterial ( material:GL.Material ) {
		this.materials[ material.uuid ] = material;
	}

	setMaterialName ( material:GL.Material, name:string ) {
		material.name = name;
		this.signals.sceneGraphChanged.dispatch();
	}

	addTexture ( texture:GL.Texture ) {
		this.textures[ texture.uuid ] = texture;
	}

	addHelper ( object:GL.Object3D ) {

        let helper : GL.Object3D;

        if( object instanceof GL.Camera ) {

            helper = new GL.CameraHelper( object );

        } else if ( object instanceof GL.PointLight ) {

            helper = new GL.PointLightHelper( object, 1 );

        } else if ( object instanceof GL.DirectionalLight ) {

            helper = new GL.DirectionalLightHelper( object, 1 );

        } else if ( object instanceof GL.SpotLight ) {

            helper = new GL.SpotLightHelper( object );

        } else if ( object instanceof GL.HemisphereLight ) {

            helper = new GL.HemisphereLightHelper( object, 1 );

        } else if ( object instanceof GL.SkinnedMesh ) {

            helper = new GL.SkeletonHelper( object );

        } else {
            // no helper for this object type
            return;
        }

		let geometry = new GL.SphereBufferGeometry( 2, 4, 2 );
		let material = new GL.MeshBasicMaterial( { color:0xff0000, visible:false } );

        let picker = new GL.Mesh( geometry, material );
        picker.name = 'picker';
        picker.userData.object = object;
        helper.add( picker );

        this.sceneHelpers.add( helper );
        this.helpers[ object.id ] = helper;

        this.signals.helperAdded.dispatch( helper );
	}

	removeHelper ( object:GL.Object3D ) {

		if( this.helpers[ object.id ] !== undefined ) {

			var helper = this.helpers[ object.id ];
			helper.parent.remove( helper );

			delete this.helpers[ object.id ];

			this.signals.helperRemoved.dispatch( helper );
		}
	}

	addScript ( object:GL.Object3D, script:object ) {

		if( this.scripts[ object.uuid ] === undefined ) {
			this.scripts[ object.uuid ] = [];
		}

		this.scripts[ object.uuid ].push( script );
		this.signals.scriptAdded.dispatch( script );
	}

	removeScript ( object:GL.Object3D, script:object ) {

		if( this.scripts[ object.uuid ] === undefined ) return;

		let index = this.scripts[ object.uuid ].indexOf( script );

		if( index !== - 1 ) {
			this.scripts[ object.uuid ].splice( index, 1 );
		}

		this.signals.scriptRemoved.dispatch( script );
	}

	select ( object:GL.Object3D|null ) {

		if( this.selected === object ) return;

		let uuid : string|null = null;

		if( object !== null ) {
			uuid = object.uuid;
		}

		this.selected = object;

		this.config.setKey( 'selected', uuid );
		this.signals.objectSelected.dispatch( object );
	}

	selectById ( id:number ) {
		if( id === this.camera.id ) {
			this.select( this.camera );
			return;
		}
		this.select( this.scene.core.getObjectById( id ) );
	}

	selectByUuid ( uuid:string ) {
		this.scene.core.traverse( ( child ) => {
			if( child.uuid === uuid ) {
				this.select( child );
			}
		});
	}

	deselect () {
		this.select( null );
	}

	focus ( object:GL.Object3D ) {

		this.signals.objectFocused.dispatch( object );
	}

	focusById ( id:number ) {

		this.focus( this.scene.core.getObjectById( id ) );
	}

	clear () {

		this.history.clear();
		this.storage.clear();

		this.camera.copy( this.DEFAULT_CAMERA );
		this.scene.core.background.setHex( 0xaaaaaa );
		this.scene.core.fog = new GL.Fog(0);

		let gameObjects = this.scene.getRootGameObjects();
		for (let c=0; c<gameObjects.length; ++c) {
			this.removeObject( gameObjects[c] );
		}

		this.geometries = {};
		this.materials  = {};
		this.textures   = {};
		this.scripts    = {};

		this.deselect();

		this.signals.editorCleared.dispatch();
	}

	fromJSON ( meta:any ) {

		console.log(meta);

		let loader = new GL.ObjectLoader();
		let camera = <GL.Camera>loader.parse( meta.camera );

		this.camera.copy( camera );
        if( this.camera instanceof GL.PerspectiveCamera ) {
            this.camera.aspect = this.DEFAULT_CAMERA.aspect;
            this.camera.updateProjectionMatrix();
        }

		this.history.fromJSON( meta.history );
		this.scripts = meta.scripts;

		let scene = new Scene();
		scene.fromJSON( meta );

		console.log( "Tool.fromJSON" , scene);

		this.setScene( scene );
	}

	toJSON () : any {

		// scripts clean up

		let scene   = this.scene;
		let scripts = this.scripts;

		for( let key in scripts ) {
			let script = scripts[ key ];
			if ( script.length === 0 || scene.core.getObjectByProperty( 'uuid', key ) === undefined ) {
				delete scripts[ key ];
			}
		}

		//
		let meta = {

			metadata: {},
			project : {
				gammaInput  : this.config.getKey( 'project/renderer/gammaInput' ),
				gammaOutput : this.config.getKey( 'project/renderer/gammaOutput' ),
				shadows     : this.config.getKey( 'project/renderer/shadows' ),
				vr          : this.config.getKey( 'project/vr' )
			},
			camera  : this.camera.toJSON(),
			scripts : this.scripts,
			history : this.history.toJSON()
		};

		this.scene.toJSON(meta);

		return meta;
	}

	objectByUuid ( uuid:string ) : GL.Object3D {
		return this.scene.core.getObjectByProperty( 'uuid', uuid );
	}

    execute ( cmd:ICommand, optionalName?:string ) {
		this.history.execute( cmd, optionalName );
	}

	undo () {
		this.history.undo();
	}

	redo () {
		this.history.redo();
	}

    // [ Constructors ]

    constructor() {

        // [ Signals ]
        this.signals = {
            editScript              : new Signal(),
            startPlayer             : new Signal(),
            stopPlayer              : new Signal(),
            enterVR                 : new Signal(),
            enteredVR               : new Signal(),
            exitedVR                : new Signal(),
            showModal               : new Signal(),
            editorCleared           : new Signal(),
            savingStarted           : new Signal(),
            savingFinished          : new Signal(),
            themeChanged            : new Signal(),
            transformModeChanged    : new Signal(),
            snapChanged             : new Signal(),
            spaceChanged            : new Signal(),
            rendererChanged         : new Signal(),
            sceneBackgroundChanged  : new Signal(),
            sceneFogChanged         : new Signal(),
            sceneGraphChanged       : new Signal(),
            cameraChanged           : new Signal(),
            geometryChanged         : new Signal(),
            objectSelected          : new Signal(),
            objectFocused           : new Signal(),
            objectAdded             : new Signal(),
            objectChanged           : new Signal(),
            objectRemoved           : new Signal(),
            helperAdded             : new Signal(),
            helperRemoved           : new Signal(),
            materialChanged         : new Signal(),
            scriptAdded             : new Signal(),
            scriptChanged           : new Signal(),
            scriptRemoved           : new Signal(),
            windowResize            : new Signal(),
            showGridChanged         : new Signal(),
            refreshSidebarObject3D  : new Signal(),
            historyChanged          : new Signal(),
        };

		this.DEFAULT_CAMERA         = new GL.PerspectiveCamera( 50, 1, 0.1, 10000 );
        this.DEFAULT_CAMERA.name    = 'Camera';
        this.DEFAULT_CAMERA.position.set( 20, 10, 20 );
        this.DEFAULT_CAMERA.lookAt( new GL.Vector3() );

        this.camera                 = this.DEFAULT_CAMERA.clone();
        this.config                 = new Config( 'uni.ts' );
        this.history                = new History( this );
        this.storage                = new Storage();
        this.loader                 = new Loader( this );

		SceneManager.loadScene( 'Scene' );
        this.scene                  = SceneManager.getActiveScene();
        this.scene.name             = 'Scene';
        this.scene.core.background  = new GL.Color( 0xaaaaaa );
        this.sceneHelpers           = new GL.Scene();

        this.geometries             = {};
        this.materials              = {};
        this.textures               = {};
        this.scripts                = {};
        this.helpers                = {};

        this.selected               = null;
    }
}
