/**
 * TransformControls.ts
 *
 * @author arodic ( https://github.com/arodic )
 * @author mosframe / https://github.com/mosframe
 */

import { GL         		}   from '../../Engine/Graphic';
import { GizmoLineMaterial  } 	from './TransformControls/GizmoLineMaterial';
import { GizmoMaterial      } 	from './TransformControls/GizmoMaterial';
import { pickerMaterial     } 	from './TransformControls/GizmoMaterial';
import { TransformGizmo     } 	from './TransformControls/TransformGizmo';
import { TranslateGizmo	    } 	from './TransformControls/TranslateGizmo';
import { RotateGizmo		} 	from './TransformControls/RotateGizmo';
import { ScaleGizmo		    } 	from './TransformControls/ScaleGizmo';

/**
 * TransformControls
 *
 * @author arodic ( https://github.com/arodic )
 * @author mosframe / https://github.com/mosframe
 * @export
 * @class TransformControls
 * @extends {GL.Object3D}
 */
export class TransformControls extends GL.Object3D {

    // [ Public Variables ]

	get object () : GL.Object3D { return this._object; }

    // [ Public Functions ]

	attach ( object:GL.Object3D ) {
		this._object = object;
		this.visible = true;
		this.update();
	}

	detach () {
		delete this._object;
		this.visible    = false;
		this._axis 	    = null;
	}

	getMode () : string {
		return this._mode;
	}

	setMode ( mode:string ) {
		this._mode = mode ? mode : this._mode;
		if ( this._mode === "scale" ) this._space = "local";
		for ( let type in this._gizmo ) this._gizmo[ type ].visible = ( type === this._mode );

		this.update();
		this.dispatchEvent( this._changeEvent );
	}

	setTranslationSnap ( translationSnap:number ) {
		this._translationSnap = translationSnap;
	}

	setRotationSnap ( rotationSnap:number ) {
		this._rotationSnap = rotationSnap;
	}

	setSize ( size:number ) {
		this._size = size;
		this.update();
		this.dispatchEvent( this._changeEvent );
	}

	/**
	 * set space
	 *
	 * @param {string} space 'world' | 'local'
	 * @memberof TransformControls
	 */
	setSpace ( space:string ) {
		this._space = space;
		this.update();
		this.dispatchEvent( this._changeEvent );
	}

	update () {

		if ( this._object === undefined ) return;

		this._object.updateMatrixWorld(true);
		this._worldPosition.setFromMatrixPosition( this._object.matrixWorld );
		this._worldRotation.setFromRotationMatrix( this._tempMatrix.extractRotation( this._object.matrixWorld ) );

		this._camera.updateMatrixWorld(true);
		this._camPosition.setFromMatrixPosition( this._camera.matrixWorld );
		this._camRotation.setFromRotationMatrix( this._tempMatrix.extractRotation( this._camera.matrixWorld ) );

		let scale = this._worldPosition.distanceTo( this._camPosition ) / 6 * this._size;
		this.position.copy( this._worldPosition );
		this.scale.set( scale, scale, scale );

		// [ camera ]
		if ( this._camera instanceof GL.PerspectiveCamera ) {

			this._eye.copy( this._camPosition ).sub( this._worldPosition ).normalize();

		} else if ( this._camera instanceof GL.OrthographicCamera ) {

			this._eye.copy( this._camPosition ).normalize();

		}

		// [ gizmo ]
		if ( this._space === "local" ) {

			this._gizmo[ this._mode ].update( this._worldRotation, this._eye );

		} else if ( this._space === "world" ) {

			this._gizmo[ this._mode ].update( new GL.Euler(), this._eye );
		}

		this._gizmo[ this._mode ].highlight( this._axis );
	}

	dispose () {

		this._domElement.removeEventListener( "mousedown"	, this._onPointerDown 	);
		this._domElement.removeEventListener( "touchstart"	, this._onPointerDown 	);
		this._domElement.removeEventListener( "mousemove"	, this._onPointerHover 	);
		this._domElement.removeEventListener( "touchmove"	, this._onPointerHover 	);
		this._domElement.removeEventListener( "mousemove"	, this._onPointerMove 	);
		this._domElement.removeEventListener( "touchmove"	, this._onPointerMove 	);
		this._domElement.removeEventListener( "mouseup"		, this._onPointerUp 	);
		this._domElement.removeEventListener( "mouseout"	, this._onPointerUp 	);
		this._domElement.removeEventListener( "touchend"	, this._onPointerUp 	);
		this._domElement.removeEventListener( "touchcancel"	, this._onPointerUp 	);
		this._domElement.removeEventListener( "touchleave"	, this._onPointerUp 	);
	}

    // [ Constructor ]

    constructor( camera:GL.Camera, domElement:HTMLElement ) {
        super();

		this._camera = camera;
		this._domElement = domElement;

		this.visible = false;

		for ( let type in this._gizmo ) {
			let gizmoObj = this._gizmo[ type ];
			gizmoObj.visible = ( type === this._mode );
			this.add( gizmoObj );
		}

		this._domElement.addEventListener( "mousedown"	, this._onPointerDown	, false );
		this._domElement.addEventListener( "touchstart"	, this._onPointerDown	, false );
		this._domElement.addEventListener( "mousemove"	, this._onPointerHover	, false );
		this._domElement.addEventListener( "touchmove"	, this._onPointerHover	, false );
		this._domElement.addEventListener( "mousemove"	, this._onPointerMove	, false );
		this._domElement.addEventListener( "touchmove"	, this._onPointerMove	, false );
		this._domElement.addEventListener( "mouseup"	, this._onPointerUp		, false );
		this._domElement.addEventListener( "mouseout"	, this._onPointerUp		, false );
		this._domElement.addEventListener( "touchend"	, this._onPointerUp		, false );
		this._domElement.addEventListener( "touchcancel", this._onPointerUp		, false );
		this._domElement.addEventListener( "touchleave"	, this._onPointerUp		, false );
    }

    // [ Private Variables ]

	private _object                 : GL.Object3D;
	private _camera				    : GL.Camera;
	private _domElement 		    : HTMLElement;
	private _translationSnap	    : number | null = null;
	private _rotationSnap 		    : number | null = null;
	private _space 				    = "world";
	private _size 				    = 1;
	private _axis				    : string | null = null;

	private _mode 				    = "translate";
	private _dragging 			    = false;
	private _plane 				    = "XY";
	private _gizmo 				    = {
		"translate"	: new TranslateGizmo(),
		"rotate"	: new RotateGizmo(),
		"scale"		: new ScaleGizmo()
	};

	private _changeEvent 		    = { type: "change" };
	private _mouseDownEvent 	    = { type: "mouseDown" };
	private _mouseUpEvent 		    = { type: "mouseUp", mode: this._mode };
	private _objectChangeEvent 	    = { type: "objectChange" };

	private _ray 				    = new GL.Raycaster();
	private _pointerVector 		    = new GL.Vector2();
	private _point 				    = new GL.Vector3();
	private _offset 			    = new GL.Vector3();
	private _offsetRotation 	    = new GL.Vector3();
	private _lookAtMatrix 		    = new GL.Matrix4();
	private _eye 				    = new GL.Vector3();
	private _tempMatrix 		    = new GL.Matrix4();
	private _tempVector 		    = new GL.Vector3();
	private _tempQuaternion 	    = new GL.Quaternion();
	private _unitX 				    = new GL.Vector3( 1, 0, 0 );
	private _unitY 				    = new GL.Vector3( 0, 1, 0 );
	private _unitZ 				    = new GL.Vector3( 0, 0, 1 );
	private _quaternionXYZ 		    = new GL.Quaternion();
	private _quaternionX 		    = new GL.Quaternion();
	private _quaternionY 		    = new GL.Quaternion();
	private _quaternionZ 		    = new GL.Quaternion();
	private _quaternionE 		    = new GL.Quaternion();
	private _oldPosition 		    = new GL.Vector3();
	private _oldScale 			    = new GL.Vector3();
	private _oldRotationMatrix 	    = new GL.Matrix4();
	private _parentRotationMatrix   = new GL.Matrix4();
	private _parentScale 		    = new GL.Vector3();
	private _worldPosition 		    = new GL.Vector3();
	private _worldRotation 		    = new GL.Euler();
	private _worldRotationMatrix	= new GL.Matrix4();
	private _camPosition 			= new GL.Vector3();
	private _camRotation 			= new GL.Euler();

    // [ Private Events ]

	private _onPointerHover = ( event:MouseEvent|TouchEvent ) => {

		if ( this._object === undefined || this._dragging === true ) return;
		if ( event instanceof MouseEvent && event.button !== undefined && event.button !== 0 ) return;

		let pointer : any = event;
		if ( event instanceof TouchEvent ) {
			pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;
		}

		let axis : string|null = null;

		let intersect = this._intersectObjects( pointer, this._gizmo[ this._mode ].pickers.children );
		if ( intersect ) {
			axis = intersect.object.name;
			event.preventDefault();
		}

		if ( this._axis !== axis ) {
			this._axis = axis;
			this.update();
			this.dispatchEvent( this._changeEvent );
		}
	}

	private _onPointerDown = ( event:MouseEvent|TouchEvent ) => {

		if ( this._object === undefined || this._dragging === true ) return;
		if ( event instanceof MouseEvent && event.button !== undefined && event.button !== 0 ) return;

		let pointer : any = event;

		if( event instanceof TouchEvent ) {
			pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;
		}

		if( pointer instanceof MouseEvent ) {
			if ( pointer.button === 0 || pointer.button === undefined ) {

				let intersect = this._intersectObjects( pointer, this._gizmo[ this._mode ].pickers.children );
				if ( intersect ) {

					event.preventDefault();
					event.stopPropagation();

					this.dispatchEvent( this._mouseDownEvent );

					this._axis = intersect.object.name;

					this.update();

					this._eye.copy( this._camPosition ).sub( this._worldPosition ).normalize();

					this._gizmo[ this._mode ].setActivePlane( this._axis, this._eye );

					let planeIntersect = this._intersectObjects( pointer, [ this._gizmo[ this._mode ].activePlane ] );

					if ( planeIntersect ) {

						this._oldPosition.copy( this._object.position );
						this._oldScale.copy( this._object.scale );

						this._oldRotationMatrix.extractRotation( this._object.matrix );
						this._worldRotationMatrix.extractRotation( this._object.matrixWorld );

						this._parentRotationMatrix.extractRotation( this._object.parent.matrixWorld );
						this._parentScale.setFromMatrixScale( this._tempMatrix.getInverse( this._object.parent.matrixWorld ) );

						this._offset.copy( planeIntersect.point );
					}
				}
			}
		}

		this._dragging = true;
	}

	private _onPointerMove = ( event:MouseEvent|TouchEvent ) => {

		if ( this._object === undefined || this._axis === null || this._dragging === false ) return;
		if ( event instanceof MouseEvent && event.button !== undefined && event.button !== 0 ) return;

		let pointer : any = event;

		if( event instanceof TouchEvent ) {
			pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;
		}

		let planeIntersect = this._intersectObjects( pointer, [ this._gizmo[ this._mode ].activePlane ] );

		if ( planeIntersect === false ) return;

		event.preventDefault();
		event.stopPropagation();

		this._point.copy( planeIntersect.point );

		if ( this._mode === "translate" ) {

			this._point.sub( this._offset );
			this._point.multiply( this._parentScale );

			if ( this._space === "local" ) {

				this._point.applyMatrix4( this._tempMatrix.getInverse( this._worldRotationMatrix ) );

				if ( this._axis.search( "X" ) === - 1 ) this._point.x = 0;
				if ( this._axis.search( "Y" ) === - 1 ) this._point.y = 0;
				if ( this._axis.search( "Z" ) === - 1 ) this._point.z = 0;

				this._point.applyMatrix4( this._oldRotationMatrix );

				this._object.position.copy( this._oldPosition );
				this._object.position.add( this._point );
			}

			if ( this._space === "world" || this._axis.search( "XYZ" ) !== - 1 ) {

				if ( this._axis.search( "X" ) === - 1 ) this._point.x = 0;
				if ( this._axis.search( "Y" ) === - 1 ) this._point.y = 0;
				if ( this._axis.search( "Z" ) === - 1 ) this._point.z = 0;

				this._point.applyMatrix4( this._tempMatrix.getInverse( this._parentRotationMatrix ) );

				this._object.position.copy( this._oldPosition );
				this._object.position.add( this._point );
			}

			if ( this._translationSnap !== null ) {

				if ( this._space === "local" ) {

					this._object.position.applyMatrix4( this._tempMatrix.getInverse( this._worldRotationMatrix ) );
				}

				if ( this._axis.search( "X" ) !== - 1 ) this._object.position.x = Math.round( this._object.position.x / this._translationSnap ) * this._translationSnap;
				if ( this._axis.search( "Y" ) !== - 1 ) this._object.position.y = Math.round( this._object.position.y / this._translationSnap ) * this._translationSnap;
				if ( this._axis.search( "Z" ) !== - 1 ) this._object.position.z = Math.round( this._object.position.z / this._translationSnap ) * this._translationSnap;

				if ( this._space === "local" ) {

					this._object.position.applyMatrix4( this._worldRotationMatrix );
				}
			}

		} else if ( this._mode === "scale" ) {

			this._point.sub( this._offset );
			this._point.multiply( this._parentScale );

			if ( this._space === "local" ) {

				if ( this._axis === "XYZ" ) {

					let scale = 1 + ( ( this._point.y ) / Math.max( this._oldScale.x, this._oldScale.y, this._oldScale.z ) );

					this._object.scale.x = this._oldScale.x * scale;
					this._object.scale.y = this._oldScale.y * scale;
					this._object.scale.z = this._oldScale.z * scale;

				} else {

					this._point.applyMatrix4( this._tempMatrix.getInverse( this._worldRotationMatrix ) );

					if ( this._axis === "X" ) this._object.scale.x = this._oldScale.x * ( 1 + this._point.x / this._oldScale.x );
					if ( this._axis === "Y" ) this._object.scale.y = this._oldScale.y * ( 1 + this._point.y / this._oldScale.y );
					if ( this._axis === "Z" ) this._object.scale.z = this._oldScale.z * ( 1 + this._point.z / this._oldScale.z );
				}
			}

		} else if ( this._mode === "rotate" ) {

			this._point.sub( this._worldPosition );
			this._point.multiply( this._parentScale );
			this._tempVector.copy( this._offset ).sub( this._worldPosition );
			this._tempVector.multiply( this._parentScale );

			let rotation = new GL.Vector3();

			if ( this._axis === "E" ) {

				this._point.applyMatrix4( this._tempMatrix.getInverse( this._lookAtMatrix ) );
				this._tempVector.applyMatrix4( this._tempMatrix.getInverse( this._lookAtMatrix ) );

				rotation.set( Math.atan2( this._point.z, this._point.y ), Math.atan2( this._point.x, this._point.z ), Math.atan2( this._point.y, this._point.x ) );
				this._offsetRotation.set( Math.atan2( this._tempVector.z, this._tempVector.y ), Math.atan2( this._tempVector.x, this._tempVector.z ), Math.atan2( this._tempVector.y, this._tempVector.x ) );

				this._tempQuaternion.setFromRotationMatrix( this._tempMatrix.getInverse( this._parentRotationMatrix ) );

				this._quaternionE.setFromAxisAngle( this._eye, rotation.z - this._offsetRotation.z );
				this._quaternionXYZ.setFromRotationMatrix( this._worldRotationMatrix );

				this._tempQuaternion.multiplyQuaternions( this._tempQuaternion, this._quaternionE );
				this._tempQuaternion.multiplyQuaternions( this._tempQuaternion, this._quaternionXYZ );

				this._object.quaternion.copy( this._tempQuaternion );

			} else if ( this._axis === "XYZE" ) {

				let rotationAxis = this._point.clone().cross( this._tempVector ).normalize();
				let rotationEular = new GL.Euler( rotationAxis.x, rotationAxis.y, rotationAxis.z );
				this._quaternionE.setFromEuler( rotationEular ); // rotation axis

				this._tempQuaternion.setFromRotationMatrix( this._tempMatrix.getInverse( this._parentRotationMatrix ) );

				this._quaternionX.setFromAxisAngle( rotationAxis, - this._point.clone().angleTo( this._tempVector ) );
				this._quaternionXYZ.setFromRotationMatrix( this._worldRotationMatrix );

				this._tempQuaternion.multiplyQuaternions( this._tempQuaternion, this._quaternionX );
				this._tempQuaternion.multiplyQuaternions( this._tempQuaternion, this._quaternionXYZ );

				this._object.quaternion.copy( this._tempQuaternion );

			} else if ( this._space === "local" ) {

				this._point.applyMatrix4( this._tempMatrix.getInverse( this._worldRotationMatrix ) );

				this._tempVector.applyMatrix4( this._tempMatrix.getInverse( this._worldRotationMatrix ) );

				rotation.set( Math.atan2( this._point.z, this._point.y ), Math.atan2( this._point.x, this._point.z ), Math.atan2( this._point.y, this._point.x ) );
				this._offsetRotation.set( Math.atan2( this._tempVector.z, this._tempVector.y ), Math.atan2( this._tempVector.x, this._tempVector.z ), Math.atan2( this._tempVector.y, this._tempVector.x ) );

				this._quaternionXYZ.setFromRotationMatrix( this._oldRotationMatrix );

				if ( this._rotationSnap !== null ) {

					this._quaternionX.setFromAxisAngle( this._unitX, Math.round( ( rotation.x - this._offsetRotation.x ) / this._rotationSnap ) * this._rotationSnap );
					this._quaternionY.setFromAxisAngle( this._unitY, Math.round( ( rotation.y - this._offsetRotation.y ) / this._rotationSnap ) * this._rotationSnap );
					this._quaternionZ.setFromAxisAngle( this._unitZ, Math.round( ( rotation.z - this._offsetRotation.z ) / this._rotationSnap ) * this._rotationSnap );

				} else {

					this._quaternionX.setFromAxisAngle( this._unitX, rotation.x - this._offsetRotation.x );
					this._quaternionY.setFromAxisAngle( this._unitY, rotation.y - this._offsetRotation.y );
					this._quaternionZ.setFromAxisAngle( this._unitZ, rotation.z - this._offsetRotation.z );

				}

				if ( this._axis === "X" ) this._quaternionXYZ.multiplyQuaternions( this._quaternionXYZ, this._quaternionX );
				if ( this._axis === "Y" ) this._quaternionXYZ.multiplyQuaternions( this._quaternionXYZ, this._quaternionY );
				if ( this._axis === "Z" ) this._quaternionXYZ.multiplyQuaternions( this._quaternionXYZ, this._quaternionZ );

				this._object.quaternion.copy( this._quaternionXYZ );

			} else if ( this._space === "world" ) {

				rotation.set( Math.atan2( this._point.z, this._point.y ), Math.atan2( this._point.x, this._point.z ), Math.atan2( this._point.y, this._point.x ) );
				this._offsetRotation.set( Math.atan2( this._tempVector.z, this._tempVector.y ), Math.atan2( this._tempVector.x, this._tempVector.z ), Math.atan2( this._tempVector.y, this._tempVector.x ) );

				this._tempQuaternion.setFromRotationMatrix( this._tempMatrix.getInverse( this._parentRotationMatrix ) );

				if ( this._rotationSnap !== null ) {

					this._quaternionX.setFromAxisAngle( this._unitX, Math.round( ( rotation.x - this._offsetRotation.x ) / this._rotationSnap ) * this._rotationSnap );
					this._quaternionY.setFromAxisAngle( this._unitY, Math.round( ( rotation.y - this._offsetRotation.y ) / this._rotationSnap ) * this._rotationSnap );
					this._quaternionZ.setFromAxisAngle( this._unitZ, Math.round( ( rotation.z - this._offsetRotation.z ) / this._rotationSnap ) * this._rotationSnap );

				} else {

					this._quaternionX.setFromAxisAngle( this._unitX, rotation.x - this._offsetRotation.x );
					this._quaternionY.setFromAxisAngle( this._unitY, rotation.y - this._offsetRotation.y );
					this._quaternionZ.setFromAxisAngle( this._unitZ, rotation.z - this._offsetRotation.z );

				}

				this._quaternionXYZ.setFromRotationMatrix( this._worldRotationMatrix );

				if ( this._axis === "X" ) this._tempQuaternion.multiplyQuaternions( this._tempQuaternion, this._quaternionX );
				if ( this._axis === "Y" ) this._tempQuaternion.multiplyQuaternions( this._tempQuaternion, this._quaternionY );
				if ( this._axis === "Z" ) this._tempQuaternion.multiplyQuaternions( this._tempQuaternion, this._quaternionZ );

				this._tempQuaternion.multiplyQuaternions( this._tempQuaternion, this._quaternionXYZ );

				this._object.quaternion.copy( this._tempQuaternion );
			}
		}

		this.update();
		this.dispatchEvent( this._changeEvent );
		this.dispatchEvent( this._objectChangeEvent );
	}

	private _onPointerUp = ( event:MouseEvent|TouchEvent ) => {

		event.preventDefault(); // Prevent MouseEvent on mobile

		if ( event instanceof MouseEvent && event.button !== undefined && event.button !== 0 ) return;

		if ( this._dragging && ( this._axis !== null ) ) {

			this._mouseUpEvent.mode = this._mode;
			this.dispatchEvent( this._mouseUpEvent );
		}

		this._dragging = false;

		if ( 'TouchEvent' in window && event instanceof TouchEvent ) {

			// Force "rollover"

			this._axis = null;
			this.update();
			this.dispatchEvent( this._changeEvent );

		} else {
			this._onPointerHover( event );
		}
	}

    // [ Private Functions ]

	private _intersectObjects = ( pointer:any, objects:GL.Object3D[] ) => {

		let rect = this._domElement.getBoundingClientRect();
		let x = ( pointer.clientX - rect.left ) / rect.width;
		let y = ( pointer.clientY - rect.top ) / rect.height;

		this._pointerVector.set( ( x * 2 ) - 1, - ( y * 2 ) + 1 );
		this._ray.setFromCamera( this._pointerVector, this._camera );

		let intersections = this._ray.intersectObjects( objects, true );
		return intersections[ 0 ] ? intersections[ 0 ] : false;
	}
}

