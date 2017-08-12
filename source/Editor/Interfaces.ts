/**
 * Editor interfaces
 *
 * @author mosframe / https://github.com/mosframe
 */

import { GL         }   from '../Engine/Graphic';
import { GameObject }   from '../Engine/GameObject';
import { Scene      }   from '../Engine/Scene';
import { Signal     }   from 'signals';
import { Config     }   from './Config';


/**
 * Command interface
 *
 * @export
 * @interface ICommand
 */
export interface ICommand {

	id              : number;
	type            : string;
	name            : string;
	inMemory        : boolean;
	updatable       : boolean;
    object          : GL.Object3D;
    script          : object;
    attributeName   : string;
    json            : any;

    execute         ();
    undo            ();
    toJSON          () : any;
    fromJSON        ( json:any );
    update          ( cmd:ICommand );
}

/**
 * Tool interface
 *
 * @export
 * @interface ITool
 */
export interface ITool {

    config          : Config;
    signals         : ISignals;
    DEFAULT_CAMERA  : GL.PerspectiveCamera;
	history         : IHistory;
    storage         : IStorage;
	loader          : ILoader;
	camera          : GL.Camera;
	scene           : Scene;
	sceneHelpers    : GL.Scene;
	geometries      : {[uuid:string]:GL.Geometry|GL.BufferGeometry};
	materials       : {[uuid:string]:GL.Material};
	textures        : {[uuid:string]:GL.Texture};
	scripts         : {[uuid:string]:any[]};
	selected        : GL.Object3D | null;
	helpers         : {[uuid:string]:GL.Object3D};

    setTheme        ( value:string );
	setScene        ( scene:Scene );
    addObject       ( object:GL.Object3D );
	moveObject      ( object:GL.Object3D, parent:GL.Object3D, before:GL.Object3D );
	nameObject      ( object:GL.Object3D, name:string );
    removeObject    ( object:GL.Object3D );
	addGeometry     ( geometry:GL.Geometry|GL.BufferGeometry );
	setGeometryName ( geometry:GL.Geometry|GL.BufferGeometry, name:string );
	addMaterial     ( material:GL.Material );
	setMaterialName ( material:GL.Material, name:string );
	addTexture      ( texture:GL.Texture );
	addHelper       ( object:GL.Object3D );
	removeHelper    ( object:GL.Object3D );
	addScript       ( object:GL.Object3D, script:object );
	removeScript    ( object:GL.Object3D, script:object );
	select          ( object:GL.Object3D|null );
	selectById      ( id:number );
	selectByUuid    ( uuid:string );
    deselect        ();
	focus           ( object:GL.Object3D );
	focusById       ( id:number );
	clear           ();
	fromJSON        ( json:any );
	toJSON          () : any;
	objectByUuid    ( uuid:string ) : GL.Object3D;
    execute         ( cmd:ICommand, optionalName?:string );
	undo            ();
	redo            ();
}

export interface IHistory {
    undos           : ICommand[];
    redos           : ICommand[];

    lastCmdTime     : Date;
    idCounter       : number;
    historyDisabled : boolean;

	execute ( cmd:ICommand, optionalName?:string );
	undo () : ICommand|undefined;
	redo () : ICommand|undefined;
	toJSON () : any;
	fromJSON ( json:any );
	clear ();
	goToState ( id:number );
	enableSerialization ( id:number );
}

export interface ILoader {
    loadFile ( file:File );
}

/**
 * Editor Signals interface
 *
 * @export
 * @interface ISignals
 */
export interface ISignals {
    // [ script ]
    editScript              : Signal,
    // [ player ]
    startPlayer             : Signal,
    stopPlayer              : Signal,
    // [ VR ]
    enterVR                 : Signal,
    enteredVR               : Signal,
    exitedVR                : Signal,
    // [ actions ]
    showModal               : Signal,
    // [ notifications ]
    editorCleared           : Signal,
    savingStarted           : Signal,
    savingFinished          : Signal,
    themeChanged            : Signal,
    transformModeChanged    : Signal,
    snapChanged             : Signal,
    spaceChanged            : Signal,
    rendererChanged         : Signal,
    sceneBackgroundChanged  : Signal,
    sceneFogChanged         : Signal,
    sceneGraphChanged       : Signal,
    cameraChanged           : Signal,
    geometryChanged         : Signal,
    objectSelected          : Signal,
    objectFocused           : Signal,
    objectAdded             : Signal,
    objectChanged           : Signal,
    objectRemoved           : Signal,
    helperAdded             : Signal,
    helperRemoved           : Signal,
    materialChanged         : Signal,
    scriptAdded             : Signal,
    scriptChanged           : Signal,
    scriptRemoved           : Signal,
    windowResize            : Signal,
    showGridChanged         : Signal,
    refreshSidebarObject3D  : Signal,
    historyChanged          : Signal,
}

/**
 * IStorage
 *
 * @export
 * @interface IStorage
 */
export interface IStorage {

	name        : string;
	version     : number;
	indexedDB   : IDBFactory;
	database    : any;
}

