/**
 * GamePlayer.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';
import { THREE     		}   from './Core';
import { Ubject    		}   from './Ubject';
import { UnitsBehaviour	}  	from './UnitsBehaviour';
import { Scene    		}   from './Scene';
import { Time    		}   from './Time';
import { WebVR  		}   from './VR/WebVR';

/**
 * Game Player
 *
 * @export
 * @class GamePlayer
 */
export class GamePlayer {

	// [ Public Functions ]

	load = ( json ) => {

		this._isVR = json.project.vr;
		this._renderer = new THREE.WebGLRenderer( { antialias: true } );
		this._renderer.setClearColor( 0x000000 );
		this._renderer.setPixelRatio( window.devicePixelRatio );

		if ( json.project.gammaInput  ) this._renderer.gammaInput = true;
		if ( json.project.gammaOutput ) this._renderer.gammaOutput = true;

		if ( json.project.shadows ) {

			this._renderer.shadowMap.enabled = true;
			// this.renderer.shadowMap.type = GL.PCFSoftShadowMap;
		}

		this._core.appendChild( this._renderer.domElement );

		this.setScene( this._loader.parse( json.scene ) );
		this.setCamera( this._loader.parse( json.camera ) );

		this._behaviourEvents = {
			awake					: [],
			start					: [],
			onApplicationQuit		: [],

			update					: [],

			onKeyDown				: [],
			onKeyUp					: [],

			onMouseDown				: [],
			onMouseUp				: [],
			onMouseMove				: [],

			onTouchStart			: [],
			onTouchEnd				: [],
			onTouchMove				: [],
		};

		this._scriptEvents = {
			awake					: [],
			start					: [],
			onApplicationQuit		: [],

			update					: [],

			onKeyDown				: [],
			onKeyUp					: [],

			onMouseDown				: [],
			onMouseUp				: [],
			onMouseMove				: [],

			onTouchStart			: [],
			onTouchEnd				: [],
			onTouchMove				: [],
		};

		let scriptWrapParams 	= 'player,renderer,scene,camera';
		let scriptWrapResultObj = {};

		for ( let eventKey in this._scriptEvents ) {

			scriptWrapParams += ',' + eventKey;
			scriptWrapResultObj[ eventKey ] = eventKey;
		}

		let scriptWrapResult = JSON.stringify( scriptWrapResultObj ).replace( /\"/g, '' );

		if( this._scene !== undefined && this._scene.core !== undefined ) {

			// [ register events ]

			// [ GameObject ]
			this._scene.fromJSON( json );
			let ubjects = this._scene['__ubjects'];
			for( let key in ubjects ) {
				let ubject = ubjects[key];
				if( ubject instanceof UnitsBehaviour ) {
					for( let name in this._behaviourEvents ) {
						let method = ubject[name];
						if( method !== undefined ) {
							this._behaviourEvents[ name ].push( ubject );
						}
					}
				}
			}

			// [ Scripts ]
			for ( let uuid in json.scripts ) {

				let object = this._scene.core.getObjectByProperty( 'uuid', uuid );
				if ( object === undefined ) {
					console.warn( 'AppPlayer: Script without object.', uuid );
					continue;
				}

				let scripts = json.scripts[ uuid ];
				for ( let i = 0; i < scripts.length; i ++ ) {

					let script = scripts[ i ];

					// [ Bind functions to object ]
					let functions = ( new Function( scriptWrapParams, script.source + '\nreturn ' + scriptWrapResult + ';' ).bind( object ) )( this, this._renderer, this._scene, this._camera );

					for ( let name in functions ) {

						if ( functions[ name ] === undefined ) continue;
						if ( this._scriptEvents[ name ] === undefined ) {

							console.warn( 'AppPlayer: Event type not supported (', name, ')' );
							continue;
						}
						this._scriptEvents[ name ].push( functions[ name ].bind( object ) );
					}
				}
			}
		}

		// [ dispatch awake event ]
		this._dispatchBehaviour( 'awake', arguments );
		this._dispatch( this._scriptEvents.awake, arguments );
	}

	setCamera = ( value ) => {

		this._camera = value;
		this._camera.aspect = this._width / this._height;
		this._camera.updateProjectionMatrix();

		if ( this._isVR === true ) {

			this._cameraVR = new THREE.PerspectiveCamera();
			this._cameraVR.projectionMatrix = this._camera.projectionMatrix;
			this._camera.add( this._cameraVR );

			this._controls = new THREE.VRControls( this._cameraVR );
			this._effect = new THREE.VREffect( this._renderer );

			if ( WebVR.isAvailable() === true ) {

				this._core.appendChild( WebVR.getButton( this._effect ) );

			}

			//if ( WebVR.isLatestAvailable() === false ) {
			//	this.dom.appendChild( WebVR.getMessage() );
			//}
		}
	}

	setScene = ( value ) => {
		this._scene = new Scene( value );
	}

	setSize = ( width, height ) => {

		this._width = width;
		this._height = height;

		if ( this._camera ) {
			this._camera.aspect = this._width / this._height;
			this._camera.updateProjectionMatrix();
		}

		if ( this._renderer ) {
			this._renderer.setSize( width, height );
		}
	}

	play = () => {

		document.addEventListener( 'keydown'	, this._onKeyDown 		);
		document.addEventListener( 'keyup'		, this._onKeyUp 		);
		document.addEventListener( 'mousedown'	, this._onMouseDown 	);
		document.addEventListener( 'mouseup'	, this._onMouseUp 		);
		document.addEventListener( 'mousemove'	, this._onMouseMove 	);
		document.addEventListener( 'touchstart'	, this._onTouchStart 	);
		document.addEventListener( 'touchend'	, this._onTouchEnd 		);
		document.addEventListener( 'touchmove'	, this._onTouchMove 	);

		// [ start ]
		this._dispatchBehaviour( 'start', arguments );
		this._dispatch( this._scriptEvents.start, arguments );

		// [ tick ]
		Time.reset();
		this._request = requestAnimationFrame( this._animate );
	}

	stop = () => {

		document.removeEventListener( 'keydown'		, this._onKeyDown 		);
		document.removeEventListener( 'keyup'		, this._onKeyUp 		);
		document.removeEventListener( 'mousedown'	, this._onMouseDown 	);
		document.removeEventListener( 'mouseup'		, this._onMouseUp 		);
		document.removeEventListener( 'mousemove'	, this._onMouseMove 	);
		document.removeEventListener( 'touchstart'	, this._onTouchStart 	);
		document.removeEventListener( 'touchend'	, this._onTouchEnd 		);
		document.removeEventListener( 'touchmove'	, this._onTouchMove 	);

		this._dispatchBehaviour( 'onApplicationQuit', arguments );
		this._dispatch( this._scriptEvents.onApplicationQuit, arguments );
		cancelAnimationFrame( this._request );
	}

	dispose = () => {

		while ( this._core.children.length ) {
			if( this._core.firstChild ) {
				this._core.removeChild( this._core.firstChild );
			}
		}

		this._renderer.dispose();

		this._camera 	= undefined;
		this._renderer 	= undefined;
		delete this._scene;
	}

	// [ Constructor ]

	constructor ( parent:HTMLDivElement ) {

		this._loader 			= new THREE.ObjectLoader();
		this._behaviourEvents 	= {};
		this._scriptEvents 		= {};
		this._core 				= document.createElement( 'div' );
		this._width 			= 500;
		this._height 			= 500;

        parent.appendChild( this._core );
	}

	// [ Private Variables ]

	private _core 	    		: HTMLDivElement;
	private _width 	    		: number;
	private _height 			: number;
	private _loader 			: THREE.ObjectLoader;
	private _camera 			: any;
	private _scene 				: Scene;
	private _renderer 			: any;
	private _controls 			: any;
	private _effect 			: any;
	private _cameraVR 			: any;
	private _isVR				: any;
	private _behaviourEvents 	: any;
	private _scriptEvents		: any;
	private _request			: any;


	// [ Private Functions ]

	private _dispatch = ( array, event ) => {

		for ( let i = 0, len = array.length; i < len; i ++ ) {
			array[ i ]( event );
		}
	}
	private _dispatchBehaviour = ( name:string, event:any ) => {

		let array = this._behaviourEvents[name];
		for( let o of array ) {
			o[name]( event );
		}
	}

	private _animate = ( time:number ) => {

		this._request = requestAnimationFrame( this._animate );
		try {
			Time['_update']();
			this._dispatchBehaviour( 'update', undefined );
			this._dispatch( this._scriptEvents.update, { time:Time.time, delta:Time.deltaTime } );
		} catch ( e ) {
			console.error( ( e.message || e ), ( e.stack || "" ) );
		}

		if ( this._isVR === true ) {

			this._camera.updateMatrixWorld();
			this._controls.update();
			this._effect.render( this._scene.core, this._cameraVR );

		} else {

			this._renderer.render( this._scene.core, this._camera );
		}
	}

	// [ Private Events ]

	private _onKeyDown = ( event ) => {

		this._dispatchBehaviour( 'onKeyDown', event );
		this._dispatch( this._scriptEvents.onKeyDown, event );
	}

	private _onKeyUp = ( event ) => {

		this._dispatchBehaviour( 'onKeyUp', event );
		this._dispatch( this._scriptEvents.onKeyUp, event );
	}

	private _onMouseDown = ( event ) => {

		this._dispatchBehaviour( 'onMouseDown', event );
		this._dispatch( this._scriptEvents.onMouseDown, event );
	}

	private _onMouseUp = ( event ) => {

		this._dispatchBehaviour( 'onMouseUp', event );
		this._dispatch( this._scriptEvents.onMouseUp, event );
	}

	private _onMouseMove = ( event ) => {

		this._dispatchBehaviour( 'onMouseMove', event );
		this._dispatch( this._scriptEvents.onMouseMove, event );
	}

	private _onTouchStart = ( event ) => {

		this._dispatchBehaviour( 'onTouchStart', event );
		this._dispatch( this._scriptEvents.onTouchStart, event );
	}

	private _onTouchEnd = ( event ) => {

		this._dispatchBehaviour( 'onTouchEnd', event );
		this._dispatch( this._scriptEvents.onTouchEnd, event );
	}

	private _onTouchMove = ( event ) => {

		this._dispatchBehaviour( 'onTouchMove', event );
		this._dispatch( this._scriptEvents.onTouchMove, event );
	}
}
