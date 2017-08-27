/**
 * TransformControls.ts
 *
 * @author arodic ( https://github.com/arodic )
 * @author mosframe / https://github.com/mosframe
 */

import { THREE         		}   from '../../../Engine/Core';
import { GizmoLineMaterial  } 	from './GizmoLineMaterial';
import { GizmoMaterial      } 	from './GizmoMaterial';
import { pickerMaterial     } 	from './GizmoMaterial';
import { TransformGizmo     } 	from './TransformGizmo';
import { TranslateGizmo	    } 	from './TranslateGizmo';
import { RotateGizmo		} 	from './RotateGizmo';
import { ScaleGizmo		    } 	from './ScaleGizmo';

/**
 * TransformControls
 *
 * @author arodic ( https://github.com/arodic )
 * @author mosframe / https://github.com/mosframe
 * @export
 * @class TransformControls
 * @extends {GL.Object3D}
 */
export class TransformControls extends THREE.Object3D {

    // [ Public Variables ]

	get object () : THREE.Object3D { return this._object; }

    // [ Public Functions ]

	attach ( object:THREE.Object3D ) {
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
		if( this._mode === "scale" ) this._space = "local";
		for( let type in this._gizmo ) this._gizmo[ type ].visible = ( type === this._mode );

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

		if( this._object === undefined ) return;

		// world matrix 갱신
		this._object.updateMatrixWorld(true);
		// world 이동값 갱신
		this._worldPosition.setFromMatrixPosition( this._object.matrixWorld );
		// world 회전값 갱신
		this._worldRotation.setFromRotationMatrix( this._tempMatrix.extractRotation( this._object.matrixWorld ) );

		this._camera.updateMatrixWorld(true);
		this._camPosition.setFromMatrixPosition( this._camera.matrixWorld );
		this._camRotation.setFromRotationMatrix( this._tempMatrix.extractRotation( this._camera.matrixWorld ) );

		let scale = this._worldPosition.distanceTo( this._camPosition ) / 6 * this._size;
		this.position.copy( this._worldPosition );
		this.scale.set( scale, scale, scale );

		// [ camera ]
		if ( this._camera instanceof THREE.PerspectiveCamera ) {

			this._eye.copy( this._camPosition ).sub( this._worldPosition ).normalize();

		} else if ( this._camera instanceof THREE.OrthographicCamera ) {

			this._eye.copy( this._camPosition ).normalize();

		}

		// [ gizmo ]
		if ( this._space === "local" ) {

			this._gizmo[ this._mode ].update( this._worldRotation, this._eye );

		} else if ( this._space === "world" ) {

			this._gizmo[ this._mode ].update( new THREE.Euler(), this._eye );
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

    constructor( camera:THREE.Camera, domElement:HTMLElement ) {
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

	private _object                 : THREE.Object3D;
	private _camera				    : THREE.Camera;
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

	private _unitX 				    = new THREE.Vector3( 1, 0, 0 );
	private _unitY 				    = new THREE.Vector3( 0, 1, 0 );
	private _unitZ 				    = new THREE.Vector3( 0, 0, 1 );

	private _ray 				    = new THREE.Raycaster();
	private _lookAtMatrix 		    = new THREE.Matrix4();
	private _eye 				    = new THREE.Vector3();

	private _quaternionXYZ 		    = new THREE.Quaternion(); // quaternion xyz
	private _quaternionX 		    = new THREE.Quaternion(); // quaternion x
	private _quaternionY 		    = new THREE.Quaternion(); // quaternion y
	private _quaternionZ 		    = new THREE.Quaternion(); // quaternion z
	private _quaternionE 		    = new THREE.Quaternion(); // quaternion eye

	private _parentScale 		    = new THREE.Vector3()	; // parent scale
	private _parentRotMatrix   		= new THREE.Matrix4()	; // parent rotation matrix

	private _startRayPosition   	= new THREE.Vector3()	; // start intersect position
	private _startRayRotation 	  	= new THREE.Vector3()	; // start intersect rotation

	private _startObjPosition 	   	= new THREE.Vector3()	; // start object position
	private _startObjScale 			= new THREE.Vector3()	; // start object scale
	private _startLocalRotMatrix 		= new THREE.Matrix4()	; // start object rotation matrix

	private _worldPosition 		    = new THREE.Vector3()	; // current object world space position
	private _worldRotation 		    = new THREE.Euler()		; // current object world space rotation
	private _startWorldRotMatrix	= new THREE.Matrix4()	; // current object world space rotation matrix

	private _camPosition 			= new THREE.Vector3();
	private _camRotation 			= new THREE.Euler();

	private _tempMatrix 		    = new THREE.Matrix4()	; // temp matrix
	private _tempPosition1 		    = new THREE.Vector3()	; // temp position1
	private _tempPosition2 		    = new THREE.Vector3()	; // temp position2
	private _tempRotation 		    = new THREE.Vector3()	; // temp rotation
	private _tempQuaternion 	    = new THREE.Quaternion(); // temp quternion

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

						this._startObjPosition.copy( this._object.position );
						this._startObjScale.copy( this._object.scale );

						this._startLocalRotMatrix.extractRotation( this._object.matrix );
						this._startWorldRotMatrix.extractRotation( this._object.matrixWorld );

						this._parentRotMatrix.extractRotation( this._object.parent.matrixWorld );
						this._parentScale.setFromMatrixScale( this._tempMatrix.getInverse( this._object.parent.matrixWorld ) );

						this._startRayPosition.copy( planeIntersect.point );
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

		//this._tempPosition2 = new THREE.Vector3();
		this._tempPosition2.copy( planeIntersect.point );

		if ( this._mode === "translate" ) {

			this._tempPosition2.sub( this._startRayPosition );
			this._tempPosition2.multiply( this._parentScale );

			if ( this._space === "local" ) {

				this._tempPosition2.applyMatrix4( this._tempMatrix.getInverse( this._startWorldRotMatrix ) );

				if ( this._axis.search( "X" ) === - 1 ) this._tempPosition2.x = 0;
				if ( this._axis.search( "Y" ) === - 1 ) this._tempPosition2.y = 0;
				if ( this._axis.search( "Z" ) === - 1 ) this._tempPosition2.z = 0;

				this._tempPosition2.applyMatrix4( this._startLocalRotMatrix );

				this._object.position.copy( this._startObjPosition );
				this._object.position.add( this._tempPosition2 );
			}

			if ( this._space === "world" || this._axis.search( "XYZ" ) !== - 1 ) {

				if ( this._axis.search( "X" ) === - 1 ) this._tempPosition2.x = 0;
				if ( this._axis.search( "Y" ) === - 1 ) this._tempPosition2.y = 0;
				if ( this._axis.search( "Z" ) === - 1 ) this._tempPosition2.z = 0;

				this._tempPosition2.applyMatrix4( this._tempMatrix.getInverse( this._parentRotMatrix ) );

				this._object.position.copy( this._startObjPosition );
				this._object.position.add( this._tempPosition2 );
			}

			if ( this._translationSnap !== null ) {

				if ( this._space === "local" ) {

					this._object.position.applyMatrix4( this._tempMatrix.getInverse( this._startWorldRotMatrix ) );
				}

				if ( this._axis.search( "X" ) !== - 1 ) this._object.position.x = Math.round( this._object.position.x / this._translationSnap ) * this._translationSnap;
				if ( this._axis.search( "Y" ) !== - 1 ) this._object.position.y = Math.round( this._object.position.y / this._translationSnap ) * this._translationSnap;
				if ( this._axis.search( "Z" ) !== - 1 ) this._object.position.z = Math.round( this._object.position.z / this._translationSnap ) * this._translationSnap;

				if ( this._space === "local" ) {

					this._object.position.applyMatrix4( this._startWorldRotMatrix );
				}
			}

		} else if ( this._mode === "scale" ) {

			this._tempPosition2.sub( this._startRayPosition );
			this._tempPosition2.multiply( this._parentScale );

			if ( this._space === "local" ) {

				if ( this._axis === "XYZ" ) {

					let scale = 1 + ( ( this._tempPosition2.y ) / Math.max( this._startObjScale.x, this._startObjScale.y, this._startObjScale.z ) );

					this._object.scale.x = this._startObjScale.x * scale;
					this._object.scale.y = this._startObjScale.y * scale;
					this._object.scale.z = this._startObjScale.z * scale;

				} else {

					this._tempPosition2.applyMatrix4( this._tempMatrix.getInverse( this._startWorldRotMatrix ) );

					if ( this._axis === "X" ) this._object.scale.x = this._startObjScale.x * ( 1 + this._tempPosition2.x / this._startObjScale.x );
					if ( this._axis === "Y" ) this._object.scale.y = this._startObjScale.y * ( 1 + this._tempPosition2.y / this._startObjScale.y );
					if ( this._axis === "Z" ) this._object.scale.z = this._startObjScale.z * ( 1 + this._tempPosition2.z / this._startObjScale.z );
				}
			}

		} else if ( this._mode === "rotate" ) {

			// 교차점을 로컬 좌표계로 변환
			this._tempPosition1.copy( this._startRayPosition ).sub( this._worldPosition );
			this._tempPosition1.multiply( this._parentScale );

			this._tempPosition2.sub( this._worldPosition );
			this._tempPosition2.multiply( this._parentScale );

			//this._tempRotation = new THREE.Vector3();

			if ( this._axis === "E" ) {

				this._tempPosition2.applyMatrix4( this._tempMatrix.getInverse( this._lookAtMatrix ) );
				this._tempPosition1.applyMatrix4( this._tempMatrix.getInverse( this._lookAtMatrix ) );

				this._tempRotation.set( Math.atan2( this._tempPosition2.z, this._tempPosition2.y ), Math.atan2( this._tempPosition2.x, this._tempPosition2.z ), Math.atan2( this._tempPosition2.y, this._tempPosition2.x ) );
				this._startRayRotation.set( Math.atan2( this._tempPosition1.z, this._tempPosition1.y ), Math.atan2( this._tempPosition1.x, this._tempPosition1.z ), Math.atan2( this._tempPosition1.y, this._tempPosition1.x ) );

				this._tempQuaternion.setFromRotationMatrix( this._tempMatrix.getInverse( this._parentRotMatrix ) );

				this._quaternionE.setFromAxisAngle( this._eye, this._tempRotation.z - this._startRayRotation.z );
				this._quaternionXYZ.setFromRotationMatrix( this._startWorldRotMatrix );

				this._tempQuaternion.multiplyQuaternions( this._tempQuaternion, this._quaternionE );
				this._tempQuaternion.multiplyQuaternions( this._tempQuaternion, this._quaternionXYZ );

				this._object.quaternion.copy( this._tempQuaternion );

			} else if ( this._axis === "XYZE" ) {

				let rotationAxis = this._tempPosition2.clone().cross( this._tempPosition1 ).normalize();
				let rotationEular = new THREE.Euler( rotationAxis.x, rotationAxis.y, rotationAxis.z );
				this._quaternionE.setFromEuler( rotationEular ); // rotation axis

				this._tempQuaternion.setFromRotationMatrix( this._tempMatrix.getInverse( this._parentRotMatrix ) );

				this._quaternionX.setFromAxisAngle( rotationAxis, - this._tempPosition2.clone().angleTo( this._tempPosition1 ) );
				this._quaternionXYZ.setFromRotationMatrix( this._startWorldRotMatrix );

				this._tempQuaternion.multiplyQuaternions( this._tempQuaternion, this._quaternionX );
				this._tempQuaternion.multiplyQuaternions( this._tempQuaternion, this._quaternionXYZ );

				this._object.quaternion.copy( this._tempQuaternion );

			} else if ( this._space === "local" ) {

				// inverse world space rotation.
				this._tempPosition1.applyMatrix4( this._tempMatrix.getInverse( this._startWorldRotMatrix ) );
				this._tempPosition2.applyMatrix4( this._tempMatrix.getInverse( this._startWorldRotMatrix ) );

				// set world space ratation.
				this._startRayRotation.set( Math.atan2( this._tempPosition1.z, this._tempPosition1.y )
									 , Math.atan2( this._tempPosition1.x, this._tempPosition1.z )
									 , Math.atan2( this._tempPosition1.y, this._tempPosition1.x ) );
				this._tempRotation.set( Math.atan2( this._tempPosition2.z, this._tempPosition2.y )
									   , Math.atan2( this._tempPosition2.x, this._tempPosition2.z )
									   , Math.atan2( this._tempPosition2.y, this._tempPosition2.x ) );

				// set local space rotation.
				this._quaternionXYZ.setFromRotationMatrix( this._startLocalRotMatrix );

				// set world space rotation
				if ( this._rotationSnap !== null ) {

					this._quaternionX.setFromAxisAngle( this._unitX, Math.round( ( this._tempRotation.x - this._startRayRotation.x ) / this._rotationSnap ) * this._rotationSnap );
					this._quaternionY.setFromAxisAngle( this._unitY, Math.round( ( this._tempRotation.y - this._startRayRotation.y ) / this._rotationSnap ) * this._rotationSnap );
					this._quaternionZ.setFromAxisAngle( this._unitZ, Math.round( ( this._tempRotation.z - this._startRayRotation.z ) / this._rotationSnap ) * this._rotationSnap );

				} else {

					this._quaternionX.setFromAxisAngle( this._unitX, this._tempRotation.x - this._startRayRotation.x );
					this._quaternionY.setFromAxisAngle( this._unitY, this._tempRotation.y - this._startRayRotation.y );
					this._quaternionZ.setFromAxisAngle( this._unitZ, this._tempRotation.z - this._startRayRotation.z );

				}

				if ( this._axis === "X" ) this._quaternionXYZ.multiplyQuaternions( this._quaternionXYZ, this._quaternionX );
				if ( this._axis === "Y" ) this._quaternionXYZ.multiplyQuaternions( this._quaternionXYZ, this._quaternionY );
				if ( this._axis === "Z" ) this._quaternionXYZ.multiplyQuaternions( this._quaternionXYZ, this._quaternionZ );

				this._object.quaternion.copy( this._quaternionXYZ );

			} else if ( this._space === "world" ) {

				this._tempRotation.set( Math.atan2( this._tempPosition2.z, this._tempPosition2.y ), Math.atan2( this._tempPosition2.x, this._tempPosition2.z ), Math.atan2( this._tempPosition2.y, this._tempPosition2.x ) );
				this._startRayRotation.set( Math.atan2( this._tempPosition1.z, this._tempPosition1.y ), Math.atan2( this._tempPosition1.x, this._tempPosition1.z ), Math.atan2( this._tempPosition1.y, this._tempPosition1.x ) );

				this._tempQuaternion.setFromRotationMatrix( this._tempMatrix.getInverse( this._parentRotMatrix ) );

				if ( this._rotationSnap !== null ) {

					this._quaternionX.setFromAxisAngle( this._unitX, Math.round( ( this._tempRotation.x - this._startRayRotation.x ) / this._rotationSnap ) * this._rotationSnap );
					this._quaternionY.setFromAxisAngle( this._unitY, Math.round( ( this._tempRotation.y - this._startRayRotation.y ) / this._rotationSnap ) * this._rotationSnap );
					this._quaternionZ.setFromAxisAngle( this._unitZ, Math.round( ( this._tempRotation.z - this._startRayRotation.z ) / this._rotationSnap ) * this._rotationSnap );

				} else {

					this._quaternionX.setFromAxisAngle( this._unitX, this._tempRotation.x - this._startRayRotation.x );
					this._quaternionY.setFromAxisAngle( this._unitY, this._tempRotation.y - this._startRayRotation.y );
					this._quaternionZ.setFromAxisAngle( this._unitZ, this._tempRotation.z - this._startRayRotation.z );

				}

				this._quaternionXYZ.setFromRotationMatrix( this._startWorldRotMatrix );

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

	/**
	 * intersect objects
	 *
	 * 현재 카메라의 뷰포트상의 2D 포인터를 이용하여 지정된 3D오브젝트둘과의 첫번째 교차점을 얻는다.
	 *
	 * @private
	 * @memberof TransformControls
	 */
	private _intersectObjects = ( pointer:any, objects:THREE.Object3D[] ) => {

		// pointer를 clientRect 좌표계로 변환
		let rect = this._domElement.getBoundingClientRect();
		let x = ( pointer.clientX - rect.left ) / rect.width;
		let y = ( pointer.clientY - rect.top ) / rect.height;

		// 카메라 좌표계로 변환
		this._ray.setFromCamera( {x:(x*2)-1, y:-(y*2)+1}, this._camera );

		// 교차 판정
		let intersections = this._ray.intersectObjects( objects, true );
		return intersections[ 0 ] ? intersections[ 0 ] : false;
	}
}

