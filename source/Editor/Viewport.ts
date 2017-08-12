/**
 * Viewport.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { GL                 	}   from '../Engine/Graphic';
import { Signal  			    }   from 'signals';
import { WebVR				    }   from '../Engine/VR/WebVR';
import { VREffect			    }   from '../Engine/VR/VREffect';
import { VRControls			    }   from '../Engine/VR/VRControls';
import { UIPanel 		        }   from '../Engine/UI/UIPanel';
import { SetPositionCommand	    }   from '../Editor/Commands/SetPositionCommand';
import { SetRotationCommand	    }   from '../Editor/Commands/SetRotationCommand';
import { SetScaleCommand	    }   from '../Editor/Commands/SetScaleCommand';
import { EditorControls		    }   from '../Editor/Handles/EditorControls';
import { TransformControls	    }   from '../Editor/Handles/TransformControls';
import { ITool			    	}   from './Interfaces';
import { ViewportInfo		    }   from './ViewportInfo';


/**
 * Viewport
 *
 * @export
 * @class Viewport
 * @extends {UIPanel}
 */
export class Viewport extends UIPanel {

    // [ Public ]

	getIntersects ( point:GL.Vector2, objects:GL.Object3D[] ) : GL.Intersection[] {
		this._mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );
		this._raycaster.setFromCamera( this._mouse, this.camera );
		return this._raycaster.intersectObjects( objects );
	}

	getMousePosition( dom:HTMLElement, x:number, y:number ) : number[] {
		let rect = dom.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];
	}


    // [ Constructor ]

    constructor( tool:ITool ) {
		super();

        this.setId( 'viewport' );
        this.setPosition( 'absolute' );

		this.tool 		= tool;
		this.camera 		= tool.camera;
		this.scene 			= tool.scene.core;
		this.sceneHelpers 	= tool.sceneHelpers;
		this.renderer 		= null;
		this.objects 		= [];

		// [ Viewport Info ]
        this.add( new ViewportInfo( tool ) );

		// [ Web VR ]
		if( WebVR.isAvailable() ) {
			this.vrCamera = new GL.PerspectiveCamera();
			this.vrCamera.projectionMatrix = this.camera.projectionMatrix;
			this.camera.add( this.vrCamera );
		}

		// [ Helper - Grid  ]

		let grid = new GL.GridHelper( 60, 60 );
		this.sceneHelpers.add( grid );

		// [ Helper - Box ]

		let box = new GL.Box3();

		this.selectionBox = new GL.BoxHelper();
		this.selectionBox.material.depthTest = false;
		this.selectionBox.material.transparent = true;
		this.selectionBox.visible = false;
		this.sceneHelpers.add( this.selectionBox );

		this.objectPositionOnDown 	= null;
		this.objectRotationOnDown 	= null;
		this.objectScaleOnDown 		= null;

		this.transformControls = new TransformControls( this.camera, this.core );
		this.transformControls.addEventListener( 'change', () => {

			let object = this.transformControls.object;
			if( object !== undefined ) {

				//this.selectionBox.setFromObject( object );
				this.selectionBox['object'] = object;
				this.selectionBox.update();

				let helper = tool.helpers[ object.id ];
				if( helper ) {
					helper['update']();
				}

				this.tool.signals.refreshSidebarObject3D.dispatch( object );
			}
			this.render();
		});

		this.transformControls.addEventListener( 'mouseDown', () => {

			let object = this.transformControls.object;
			if( object ) {
				this.objectPositionOnDown 	= object.position.clone();
				this.objectRotationOnDown 	= object.rotation.clone();
				this.objectScaleOnDown 		= object.scale.clone();
				this.controls.enabled = false;
			}
		});

		this.transformControls.addEventListener( 'mouseUp', () => {

			let object = this.transformControls.object;
			if( object !== undefined ) {

				switch( this.transformControls.getMode() ) {
				case 'translate':
					if( ! this.objectPositionOnDown.equals( object.position ) ) {
						this.tool.execute( new SetPositionCommand( object, object.position, this.objectPositionOnDown ) );
					}
					break;
				case 'rotate':
					if ( ! this.objectRotationOnDown.equals( object.rotation ) ) {
						this.tool.execute( new SetRotationCommand( object, object.rotation, this.objectRotationOnDown ) );
					}
					break;
				case 'scale':
					if ( ! this.objectScaleOnDown.equals( object.scale ) ) {
						this.tool.execute( new SetScaleCommand( object, object.scale, this.objectScaleOnDown ) );
					}
					break;
				}
			}
			this.controls.enabled = true;
		});

		this.sceneHelpers.add( this.transformControls );

		// [ object picking ]

		this._raycaster = new GL.Raycaster();
		this._mouse 	= new GL.Vector2();

		// [ events ]

		this.core.addEventListener( 'mousedown'		, this._onMouseDown		, false );
		this.core.addEventListener( 'touchstart'	, this._onTouchStart	, false );
		this.core.addEventListener( 'dblclick'		, this._onDoubleClick	, false );

		// controls need to be added *after* main logic,
		// otherwise controls.enabled doesn't work.

		this.controls = new EditorControls( this.camera, this.core );
		this.controls.addEventListener( 'change', () => {
			this.transformControls.update();
			this.tool.signals.cameraChanged.dispatch( this.camera );
		});

		this.tool.signals.editorCleared.add( () => {
			this.controls.center.set( 0, 0, 0 );
			this.render();
		});

		this.tool.signals.enterVR.add( () => {
			this.vrEffect.isPresenting ? this.vrEffect.exitPresent() : this.vrEffect.requestPresent();
		});

		this.tool.signals.themeChanged.add( ( value ) => {
			switch ( value ) {
			case 'css/light.css':
				this.sceneHelpers.remove( grid );
				grid = new GL.GridHelper( 60, 60, 0x444444, 0x888888 );
				this.sceneHelpers.add( grid );
				break;
			case 'css/dark.css':
				this.sceneHelpers.remove( grid );
				grid = new GL.GridHelper( 60, 60, 0xbbbbbb, 0x888888 );
				this.sceneHelpers.add( grid );
				break;
			}
			this.render();
		});

		this.tool.signals.transformModeChanged.add( ( mode:string ) => {
			this.transformControls.setMode( mode );
		});

		this.tool.signals.snapChanged.add( ( dist:any ) => {
			this.transformControls.setTranslationSnap( dist );
		});

		this.tool.signals.spaceChanged.add( ( space:string ) => {
			this.transformControls.setSpace( space );
		});

		this.tool.signals.rendererChanged.add( ( newRenderer:GL.WebGLRenderer ) => {

			if ( this.renderer !== null ) {
				this.core.removeChild( this.renderer.domElement );
			}

			this.renderer = newRenderer;

			this.renderer.autoClear = false;
			//this.renderer.autoUpdateScene = false;
			this.renderer.setPixelRatio( window.devicePixelRatio );
			this.renderer.setSize( this.core.offsetWidth, this.core.offsetHeight );

			this.core.appendChild( this.renderer.domElement );

			if ( WebVR.isAvailable() ) {

				this.vrControls = new VRControls( this.vrCamera );
				this.vrEffect = new VREffect( this.renderer );

				window.addEventListener( 'vrdisplaypresentchange', ( event ) => {

					window['effect'].isPresenting ? this.tool.signals.enteredVR.dispatch() : this.tool.signals.exitedVR.dispatch();

				}, false );
			}

			this.render();
		});

		this.tool.signals.sceneGraphChanged.add( () => {
			this.render();
		});

		this.tool.signals.cameraChanged.add( () => {
			this.render();
		});

		this.tool.signals.objectSelected.add( ( object:GL.Object3D ) => {

			this.selectionBox.visible = false;
			this.transformControls.detach();

			if ( object !== null && object !== this.scene && object !== this.camera ) {

				box.setFromObject( object );

				if ( box.isEmpty() === false ) {
					this.selectionBox['object'] = object;
					this.selectionBox.update();
					this.selectionBox.visible = true;
				}

				this.transformControls.attach( object );
			}

			this.render();
		});

		this.tool.signals.objectFocused.add( ( object:GL.Object3D ) => {
			this.controls.focus( object );
		});

		this.tool.signals.geometryChanged.add( ( object:GL.Object3D ) => {
			if( object !== undefined ) {
				this.selectionBox.update( object );
			}
			this.render();
		});

		this.tool.signals.objectAdded.add( ( object:GL.Object3D ) => {

			object.traverse( ( child:GL.Object3D ) => {
				this.objects.push( child );
			});
		});

		this.tool.signals.objectChanged.add( ( object:GL.Object3D ) => {

			if ( tool.selected === object ) {

				this.selectionBox['object'] = object;
				this.selectionBox.update();
				this.transformControls.update();
			}

			if ( object instanceof GL.PerspectiveCamera ) {

				object.updateProjectionMatrix();

			}

			let helper = tool.helpers[ object.id ];
			if ( helper !== undefined ) {
				helper['update']();
			}
			this.render();
		});

		this.tool.signals.objectRemoved.add( ( object ) => {

			object.traverse( ( child:GL.Object3D ) => {
				this.objects.splice( this.objects.indexOf( child ), 1 );
			});
		});

		this.tool.signals.helperAdded.add( ( object:GL.Object3D ) => {
			this.objects.push( object.getObjectByName( 'picker' ) );
		});

		this.tool.signals.helperRemoved.add( ( object:GL.Object3D ) => {
			this.objects.splice( this.objects.indexOf( object.getObjectByName( 'picker' ) ), 1 );
		});

		this.tool.signals.materialChanged.add( ( material:GL.Material ) => {
			this.render();
		});

		// [ fog ]

		this.tool.signals.sceneBackgroundChanged.add( ( backgroundColor:number ) => {
			this.scene.background.setHex( backgroundColor );
			this.render();
		});

		this._currentFogType = '';

		this.tool.signals.sceneFogChanged.add( ( fogType:string, fogColor:number, fogNear:number, fogFar:number, fogDensity:number ) => {

			if( this._currentFogType !== fogType ) {
				switch( fogType ) {
				case 'None':
					(<any>this.scene).fog = null;
					break;
				case 'Fog':
					this.scene.fog = new GL.Fog(fogColor);
					break;
				case 'FogExp2':
					this.scene.fog = new GL.FogExp2(fogColor);
					break;

				}
				this._currentFogType = fogType;
			}

			if ( this.scene.fog instanceof GL.Fog ) {
				this.scene.fog.color.setHex( fogColor );
				this.scene.fog.near = fogNear;
				this.scene.fog.far = fogFar;
			} else if ( this.scene.fog instanceof GL.FogExp2 ) {
				this.scene.fog.color.setHex( fogColor );
				this.scene.fog.density = fogDensity;
			}

			this.render();
		});

		this.tool.signals.windowResize.add( () => {

			// TODO: Move this out?

			tool.DEFAULT_CAMERA.aspect = this.core.offsetWidth / this.core.offsetHeight;
			tool.DEFAULT_CAMERA.updateProjectionMatrix();

			if( this.camera instanceof GL.PerspectiveCamera ) {
				this.camera.aspect = this.core.offsetWidth / this.core.offsetHeight;
				this.camera.updateProjectionMatrix();
			}

			if( this.renderer ) {
				this.renderer.setSize( this.core.offsetWidth, this.core.offsetHeight );
			}

			this.render();
		});

		this.tool.signals.showGridChanged.add( ( showGrid:boolean ) => {
			grid.visible = showGrid;
			this.render();
		});

		requestAnimationFrame( this._animate );

        document.body.appendChild( this.core );
	}


	// [ Protected ]

	private tool 					: ITool;
	private renderer 				: GL.WebGLRenderer | null;
	private camera 					: GL.Camera;
	private scene 					: GL.Scene;
	private sceneHelpers 			: GL.Scene;
	private objects 				: GL.Object3D[];
	private controls 				: EditorControls;
	private transformControls 		: TransformControls;
	private selectionBox 			: GL.BoxHelper;
	private vrEffect				: VREffect;
	private vrControls				: VRControls;
	private vrCamera				: GL.PerspectiveCamera;

	private objectPositionOnDown 	: any;
	private objectRotationOnDown 	: any;
	private objectScaleOnDown 		: any;

	private _raycaster 				: GL.Raycaster 	= new GL.Raycaster();
	private _mouse 					: GL.Vector2 	= new GL.Vector2();
	private _onDownPosition 		: GL.Vector2 	= new GL.Vector2();
	private _onUpPosition 			: GL.Vector2 	= new GL.Vector2();
	private _onDoubleClickPosition 	: GL.Vector2 	= new GL.Vector2();
	private _currentFogType 		: string;

	private _animate = () => {

		requestAnimationFrame( this._animate );

		if( this.vrEffect && this.vrEffect.isPresenting ) {
			this.render();
		}
	}

	private render() {

		//console.log("render");

		this.sceneHelpers.updateMatrixWorld(true);
		this.scene.updateMatrixWorld(true);

		if ( this.vrEffect && this.vrEffect.isPresenting ) {

			this.vrControls.update();

			this.camera.updateMatrixWorld(true);

			this.vrEffect.render( this.scene, this.vrCamera );
			this.vrEffect.render( this.sceneHelpers, this.vrCamera );

		} else {

			//console.log(this.renderer);

			if( this.renderer ) {
				this.renderer.render( this.scene, this.camera );
				this.renderer.render( this.sceneHelpers, this.camera );
			}
		}
	}

	private _onHandleClick = () => {

		if( this._onDownPosition.distanceTo( this._onUpPosition ) === 0 ) {
			let intersects = this.getIntersects( this._onUpPosition, this.objects );

			if ( intersects.length > 0 ) {

				let object = intersects[ 0 ].object;

				if ( object.userData.object !== undefined ) {
					this.tool.select( object.userData.object );
				} else {
					this.tool.select( object );
				}

			} else {
				this.tool.select( null );
			}
			this.render();
		}
	}

	private _onMouseDown = ( event:MouseEvent ) => {

		event.preventDefault();

		let array = this.getMousePosition( this.core, event.clientX, event.clientY );
		this._onDownPosition.fromArray( array );

		document.addEventListener( 'mouseup', this._onMouseUp, false );
	}

	private _onMouseUp = ( event:MouseEvent ) => {

		let array = this.getMousePosition( this.core, event.clientX, event.clientY );
		this._onUpPosition.fromArray( array );

		this._onHandleClick();

		document.removeEventListener( 'mouseup', this._onMouseUp, false );
	}

	private _onTouchStart = ( event:TouchEvent ) => {

		let touch = event.changedTouches[ 0 ];

		let array = this.getMousePosition( this.core, touch.clientX, touch.clientY );
		this._onDownPosition.fromArray( array );

		document.addEventListener( 'touchend', this._onTouchEnd, false );

	}

	private _onTouchEnd = ( event:TouchEvent ) => {

		let touch = event.changedTouches[ 0 ];

		let array = this.getMousePosition( this.core, touch.clientX, touch.clientY );
		this._onUpPosition.fromArray( array );

		this._onHandleClick();

		document.removeEventListener( 'touchend', this._onTouchEnd, false );

	}

	private _onDoubleClick = ( event ) => {

		let array = this.getMousePosition( this.core, event.clientX, event.clientY );
		this._onDoubleClickPosition.fromArray( array );

		let intersects = this.getIntersects( this._onDoubleClickPosition, this.objects );

		if( intersects.length > 0 ) {

			let intersect = intersects[ 0 ];

			this.tool.signals.objectFocused.dispatch( intersect.object );
		}
	}
}
