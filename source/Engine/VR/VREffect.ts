/**
 * VREffect.ts
 *
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 * @author mosframe / https://github.com/mosframe
 *
 * WebVR Spec: http://mozvr.github.io/webvr-spec/webvr.html
 *
 * Firefox: http://mozvr.com/downloads/
 * Chromium: https://webvr.info/get-chrome
 */

import { GL   	} from '../Graphic';
import { WebVR	} from './WebVR';

/**
 * VR Effect
 *
 * @export
 * @class VREffect
 */
export class VREffect {

	// [ Public Variables ]

	get isPresenting () : boolean { return this._isPresenting; }

	// [ Public Functions ]

    getVRDisplay () : VRDisplay|null {
        return this._vrDisplay;
    }

    setVRDisplay ( value:VRDisplay ) {
        this._vrDisplay = value;
    }

	setSize ( width, height, updateStyle ) {

		this._rendererSize = { width: width, height: height };
		this._rendererUpdateStyle = updateStyle;

		if ( this._isPresenting ) {
			let eyeParamsL = this._vrDisplay.getEyeParameters( 'left' );
			this._renderer.setPixelRatio( 1 );
			this._renderer.setSize( eyeParamsL.renderWidth * 2, eyeParamsL.renderHeight, false );

		} else {
			this._renderer.setPixelRatio( this._rendererPixelRatio );
			this._renderer.setSize( width, height, updateStyle );
		}
	}

	setFullScreen ( boolean:boolean ) {

		return new Promise( ( resolve, reject ) => {

			if ( this._vrDisplay === undefined ) {
				reject( new Error( 'No VR hardware found.' ) );
				return;
			}

			if ( this._isPresenting === boolean ) {
				resolve();
				return;
			}

			if ( boolean ) {
				resolve( this._vrDisplay.requestPresent( [ { source: this._canvas } ] ) );
			} else {
				resolve( this._vrDisplay.exitPresent() );
			}
		});
	}

	requestPresent () {
		return this.setFullScreen( true );
	}

	exitPresent () {
		return this.setFullScreen( false );
	}

	requestAnimationFrame ( f ) {

		if ( this._vrDisplay !== undefined ) {
			return this._vrDisplay.requestAnimationFrame( f );
		} else {
			return window.requestAnimationFrame( f );
		}
	}

	cancelAnimationFrame ( h ) {

		if ( this._vrDisplay !== undefined ) {
			this._vrDisplay.cancelAnimationFrame( h );
		} else {
			window.cancelAnimationFrame( h );
		}
	}

	submitFrame () {

		if ( this._vrDisplay !== undefined && this._isPresenting ) {
			this._vrDisplay.submitFrame();
		}
	}

	render ( scene:GL.Scene, camera:GL.PerspectiveCamera, renderTarget?:any, forceClear?:any ) {

		if ( this._vrDisplay && this._isPresenting ) {

			let autoUpdate = scene.autoUpdate;

			if ( autoUpdate ) {

				scene.updateMatrixWorld(true);
				scene.autoUpdate = false;

			}

			let eyeParamsL = this._vrDisplay.getEyeParameters( 'left' );
			let eyeParamsR = this._vrDisplay.getEyeParameters( 'right' );

			this._eyeTranslationL.fromArray( Array.from( eyeParamsL.offset ) );
			this._eyeTranslationR.fromArray( Array.from( eyeParamsR.offset ) );

			if ( Array.isArray( scene ) ) {

				console.warn( 'GL.VREffect.render() no longer supports arrays. Use object.layers instead.' );
				scene = scene[ 0 ];
			}

			// When rendering we don't care what the recommended size is, only what the actual size
			// of the backbuffer is.
			let size = this._renderer.getSize();
			let layers = this._vrDisplay.getLayers();
			let leftBounds;
			let rightBounds;

			if ( layers.length ) {
				let layer = layers[ 0 ];
				if( layer ) {
					leftBounds = layer.leftBounds && layer.leftBounds.length === 4 ? layer.leftBounds : this._defaultLeftBounds;
					rightBounds = layer.rightBounds && layer.rightBounds.length === 4 ? layer.rightBounds : this._defaultRightBounds;
				}
			} else {
				leftBounds = this._defaultLeftBounds;
				rightBounds = this._defaultRightBounds;
			}

			this._renderRectL = {
				x: Math.round( size.width * leftBounds[ 0 ] ),
				y: Math.round( size.height * leftBounds[ 1 ] ),
				width: Math.round( size.width * leftBounds[ 2 ] ),
				height: Math.round( size.height * leftBounds[ 3 ] )
			};
			this._renderRectR = {
				x: Math.round( size.width * rightBounds[ 0 ] ),
				y: Math.round( size.height * rightBounds[ 1 ] ),
				width: Math.round( size.width * rightBounds[ 2 ] ),
				height: Math.round( size.height * rightBounds[ 3 ] )
			};

			if ( renderTarget ) {
				this._renderer.setRenderTarget( renderTarget );
				renderTarget.scissorTest = true;
			} else {
				(<any>this._renderer).setRenderTarget( null );
				this._renderer.setScissorTest( true );
			}

			if ( this._renderer.autoClear || forceClear ) this._renderer.clear();

			if ( camera.parent === null ) camera.updateMatrixWorld(true);

			camera.matrixWorld.decompose( this._cameraL.position, this._cameraL.quaternion, this._cameraL.scale );

			this._cameraR.position.copy( this._cameraL.position );
			this._cameraR.quaternion.copy( this._cameraL.quaternion );
			this._cameraR.scale.copy( this._cameraL.scale );

			this._cameraL.translateOnAxis( this._eyeTranslationL, this._cameraL.scale.x );
			this._cameraR.translateOnAxis( this._eyeTranslationR, this._cameraR.scale.x );

			if ( this._frameData ) {

				this._vrDisplay.depthNear = camera.near;
				this._vrDisplay.depthFar = camera.far;

				this._vrDisplay.getFrameData( this._frameData );

				this._cameraL.projectionMatrix.elements = this._frameData.leftProjectionMatrix;
				this._cameraR.projectionMatrix.elements = this._frameData.rightProjectionMatrix;

			} else {

				this._cameraL.projectionMatrix = this.fovToProjection( eyeParamsL.fieldOfView, true, camera.near, camera.far );
				this._cameraR.projectionMatrix = this.fovToProjection( eyeParamsR.fieldOfView, true, camera.near, camera.far );
			}

			// render left eye
			if ( renderTarget ) {

				renderTarget.viewport.set( this._renderRectL.x, this._renderRectL.y, this._renderRectL.width, this._renderRectL.height );
				renderTarget.scissor.set( this._renderRectL.x, this._renderRectL.y, this._renderRectL.width, this._renderRectL.height );

			} else {

				this._renderer.setViewport( this._renderRectL.x, this._renderRectL.y, this._renderRectL.width, this._renderRectL.height );
				this._renderer.setScissor( this._renderRectL.x, this._renderRectL.y, this._renderRectL.width, this._renderRectL.height );

			}
			this._renderer.render( scene, this._cameraL, renderTarget, forceClear );

			// render right eye
			if ( renderTarget ) {

				renderTarget.viewport.set( this._renderRectR.x, this._renderRectR.y, this._renderRectR.width, this._renderRectR.height );
				renderTarget.scissor.set( this._renderRectR.x, this._renderRectR.y, this._renderRectR.width, this._renderRectR.height );

			} else {

				this._renderer.setViewport( this._renderRectR.x, this._renderRectR.y, this._renderRectR.width, this._renderRectR.height );
				this._renderer.setScissor( this._renderRectR.x, this._renderRectR.y, this._renderRectR.width, this._renderRectR.height );

			}
			this._renderer.render( scene, this._cameraR, renderTarget, forceClear );

			if ( renderTarget ) {

				renderTarget.viewport.set( 0, 0, size.width, size.height );
				renderTarget.scissor.set( 0, 0, size.width, size.height );
				renderTarget.scissorTest = false;
				(<any>this._renderer).setRenderTarget( null );

			} else {

				this._renderer.setViewport( 0, 0, size.width, size.height );
				this._renderer.setScissorTest( false );
			}

			if ( autoUpdate ) {

				scene.autoUpdate = true;
			}

			if ( this._autoSubmitFrame ) {

				this.submitFrame();
			}

			return;
		}

		// Regular render mode if not HMD

		this._renderer.render( scene, camera, renderTarget, forceClear );

	}

	dispose () {

		window.removeEventListener( 'vrdisplaypresentchange', this.onVRDisplayPresentChange, false );

	}

    // [ Constructor ]

	constructor ( renderer:GL.WebGLRenderer, onError?:Function ) {

		this._renderer = renderer;
		this._onError = onError;

		this._eyeTranslationL = new GL.Vector3();
		this._eyeTranslationR = new GL.Vector3();

		if ( 'VRFrameData' in window ) {
			this._frameData = new window['VRFrameData'];
		} else {
            this._frameData = null;
        }

        WebVR.getVRDisplays( (displays:VRDisplay[]) => {
            this._vrDisplays = displays;
            if( displays.length > 0 ) {
                this._vrDisplay = this._vrDisplays[0];
            } else {
                if( this._onError ) {
                    this._onError( 'VR input not available.' );
                }
            }
        });

		//

		this._isPresenting = false;
		this._rendererSize = renderer.getSize();
		this._rendererUpdateStyle = false;
		this._rendererPixelRatio = renderer.getPixelRatio();


		// VR presentation

		this._canvas = renderer.domElement;
		this._defaultLeftBounds = [ 0.0, 0.0, 0.5, 1.0 ];
		this._defaultRightBounds = [ 0.5, 0.0, 0.5, 1.0 ];

		window.addEventListener( 'vrdisplaypresentchange', this.onVRDisplayPresentChange, false );

		this._autoSubmitFrame = true;

		// render

		this._cameraL = new GL.PerspectiveCamera();
		this._cameraL.layers.enable( 1 );

		this._cameraR = new GL.PerspectiveCamera();
		this._cameraR.layers.enable( 2 );
	}


    // [ Private Variables ]

	private _isPresenting 			: boolean;
	private _vrDisplay           	: VRDisplay;
	private _vrDisplays          	: VRDisplay[];
	private _rendererSize        	: { width: number, height: number };
	private _rendererUpdateStyle 	: boolean;
	private _rendererPixelRatio  	: number;
	private _canvas              	: HTMLCanvasElement;
	private _renderer            	: GL.WebGLRenderer;
	private _onError             	?: Function;
	private _cameraL             	: GL.Camera;
	private _cameraR             	: GL.Camera;
	private _autoSubmitFrame     	: boolean;
	private _eyeTranslationL     	: GL.Vector3;
	private _eyeTranslationR     	: GL.Vector3;
	private _renderRectL         	: {x:number,y:number,width:number,height:number};
	private _renderRectR         	: {x:number,y:number,width:number,height:number};
	private _frameData           	: VRFrameData|null;
	private _defaultLeftBounds   	: number[];
	private _defaultRightBounds  	: number[];

    // [ Private Functions ]

	private fovToNDCScaleOffset = ( fov:any ) => {

		let pxscale = 2.0 / ( fov.leftTan + fov.rightTan );
		let pxoffset = ( fov.leftTan - fov.rightTan ) * pxscale * 0.5;
		let pyscale = 2.0 / ( fov.upTan + fov.downTan );
		let pyoffset = ( fov.upTan - fov.downTan ) * pyscale * 0.5;
		return { scale: [ pxscale, pyscale ], offset: [ pxoffset, pyoffset ] };

	}

	private fovPortToProjection = ( fov:any, rightHanded?:boolean, zNear?:number, zFar?:number ) => {

		rightHanded = rightHanded === undefined ? true : rightHanded;
		zNear = zNear === undefined ? 0.01 : zNear;
		zFar = zFar === undefined ? 10000.0 : zFar;

		let handednessScale = rightHanded ? - 1.0 : 1.0;

		// start with an identity matrix
		let mobj = new GL.Matrix4();
		let m = mobj.elements;

		// and with scale/offset info for normalized device coords
		let scaleAndOffset = this.fovToNDCScaleOffset( fov );

		// X result, map clip edges to [-w,+w]
		m[ 0 * 4 + 0 ] = scaleAndOffset.scale[ 0 ];
		m[ 0 * 4 + 1 ] = 0.0;
		m[ 0 * 4 + 2 ] = scaleAndOffset.offset[ 0 ] * handednessScale;
		m[ 0 * 4 + 3 ] = 0.0;

		// Y result, map clip edges to [-w,+w]
		// Y offset is negated because this proj matrix transforms from world coords with Y=up,
		// but the NDC scaling has Y=down (thanks D3D?)
		m[ 1 * 4 + 0 ] = 0.0;
		m[ 1 * 4 + 1 ] = scaleAndOffset.scale[ 1 ];
		m[ 1 * 4 + 2 ] = - scaleAndOffset.offset[ 1 ] * handednessScale;
		m[ 1 * 4 + 3 ] = 0.0;

		// Z result (up to the app)
		m[ 2 * 4 + 0 ] = 0.0;
		m[ 2 * 4 + 1 ] = 0.0;
		m[ 2 * 4 + 2 ] = zFar / ( zNear - zFar ) * - handednessScale;
		m[ 2 * 4 + 3 ] = ( zFar * zNear ) / ( zNear - zFar );

		// W result (= Z in)
		m[ 3 * 4 + 0 ] = 0.0;
		m[ 3 * 4 + 1 ] = 0.0;
		m[ 3 * 4 + 2 ] = handednessScale;
		m[ 3 * 4 + 3 ] = 0.0;

		mobj.transpose();
		return mobj;

	}

	private fovToProjection = ( fov:any, rightHanded?:boolean, zNear?:number, zFar?:number ) => {

		let DEG2RAD = Math.PI / 180.0;

		let fovPort = {
			upTan: Math.tan( fov.upDegrees * DEG2RAD ),
			downTan: Math.tan( fov.downDegrees * DEG2RAD ),
			leftTan: Math.tan( fov.leftDegrees * DEG2RAD ),
			rightTan: Math.tan( fov.rightDegrees * DEG2RAD )
		};

		return this.fovPortToProjection( fovPort, rightHanded, zNear, zFar );
	}

	// [ Private Events ]

	private onVRDisplayPresentChange = () => {

		let wasPresenting = this._isPresenting;
		this._isPresenting = this._vrDisplay !== undefined && this._vrDisplay.isPresenting;

		if ( this._isPresenting ) {

			let eyeParamsL = this._vrDisplay.getEyeParameters( 'left' );
			let eyeWidth = eyeParamsL.renderWidth;
			let eyeHeight = eyeParamsL.renderHeight;

			if ( ! wasPresenting ) {

				this._rendererPixelRatio = this._renderer.getPixelRatio();
				this._rendererSize = this._renderer.getSize();

				this._renderer.setPixelRatio( 1 );
				this._renderer.setSize( eyeWidth * 2, eyeHeight, false );

			}

		} else if ( wasPresenting ) {

			this._renderer.setPixelRatio( this._rendererPixelRatio );
			this._renderer.setSize( this._rendererSize.width, this._rendererSize.height, this._rendererUpdateStyle );

		}
	}


}
