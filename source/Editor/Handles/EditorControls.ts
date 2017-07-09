/**
 * EditorControls.ts
 *
 * @author qiao ( https://github.com/qiao )
 * @author mrdoob ( http://mrdoob.com )
 * @author alteredq ( http://alteredqualia.com/ )
 * @author WestLangley ( http://github.com/WestLangley )
 * @author mosframe / https://github.com/mosframe
 */

import * as GL from '../../Engine/Graphic';

/**
 * editor control state
 *
 * @enum {number}
 */
enum STATE {
    NONE    =-1,
    ROTATE  = 0,
    ZOOM    = 1,
    PAN     = 2,
}


/**
 * editor controls
 *
 * @export
 * @class EditorControls
 * @extends {GL.EventDispatcher}
 */
export class EditorControls extends GL.EventDispatcher {

    // [ Public Variables ]

    get enabled ()  : boolean       { return this._enabled; }
    set enabled ( value:boolean )   { this._enabled = value; }

	get center ()   : GL.Vector3    { return this._center; }

    // [ Public Functions ]

	focus ( target:GL.Object3D ) {
		let box = new GL.Box3().setFromObject( target );
		this._object.lookAt( this._center.copy( box.getCenter() ) );
		this.dispatchEvent( this._changeEvent );
	}

	pan ( delta:GL.Vector3 ) {

		let distance = this._object.position.distanceTo( this._center );
		delta.multiplyScalar( distance * this._panSpeed );
		delta.applyMatrix3( this._normalMatrix.getNormalMatrix( this._object.matrix ) );
		this._object.position.add( delta );
		this._center.add( delta );
		this.dispatchEvent( this._changeEvent );
	}

	zoom ( delta:GL.Vector3 ) {

		let distance = this._object.position.distanceTo( this._center );
		delta.multiplyScalar( distance * this._zoomSpeed );
		if ( delta.length() > distance ) return;
		delta.applyMatrix3( this._normalMatrix.getNormalMatrix( this._object.matrix ) );
		this._object.position.add( delta );
		this.dispatchEvent( this._changeEvent );
	}

	rotate ( delta:GL.Vector3 ) {

		this._vector.copy( this._object.position ).sub( this._center );
		this._spherical.setFromVector3( this._vector );
		this._spherical.theta += delta.x;
		this._spherical.phi += delta.y;
		this._spherical.makeSafe();
		this._vector.setFromSpherical( this._spherical );
		this._object.position.copy( this._center ).add( this._vector );
		this._object.lookAt( this._center );
		this.dispatchEvent( this._changeEvent );
	}

	dispose () {

		this._domElement.removeEventListener( 'contextmenu'  , this._onContextMenu  , false );
		this._domElement.removeEventListener( 'mousedown'    , this._onMouseDown    , false );
		this._domElement.removeEventListener( 'wheel'        , this._onMouseWheel   , false );
		this._domElement.removeEventListener( 'mousemove'    , this._onMouseMove    , false );
		this._domElement.removeEventListener( 'mouseup'      , this._onMouseUp      , false );
		this._domElement.removeEventListener( 'mouseout'     , this._onMouseUp      , false );
		this._domElement.removeEventListener( 'dblclick'     , this._onMouseUp      , false );
		this._domElement.removeEventListener( 'touchstart'   , this._onTouchStart   , false );
		this._domElement.removeEventListener( 'touchmove'    , this._onTouchMove    , false );
	}


    // [ Constructors ]

    constructor( object:GL.Object3D, domElement:Element ) {
        super();

        this._object     = object;
        this._domElement = domElement;

        this._domElement.addEventListener( 'contextmenu' , this._onContextMenu  , false );
        this._domElement.addEventListener( 'mousedown'   , this._onMouseDown    , false );
        this._domElement.addEventListener( 'wheel'       , this._onMouseWheel   , false );
        this._domElement.addEventListener( 'touchstart'  , this._onTouchStart   , false );
        this._domElement.addEventListener( 'touchmove'   , this._onTouchMove    , false );
    }

    // [ Private Variables ]

    private _enabled            : boolean    = true;
	private _center             : GL.Vector3 = new GL.Vector3();
    private _object             : GL.Object3D;
    private _domElement         : Element;
	private _panSpeed           = 0.001;
	private _zoomSpeed          = 0.001;
	private _rotationSpeed      = 0.005;

	private _state              = STATE.NONE;
	private _vector             = new GL.Vector3();
	private _normalMatrix       = new GL.Matrix3();
	private _pointer            = new GL.Vector2();
	private _pointerOld         = new GL.Vector2();
	private _spherical          = new GL.Spherical();
	private _changeEvent        = { type:'change' };

	private _touch              = new GL.Vector3();
	private _touches            = [ new GL.Vector3(), new GL.Vector3(), new GL.Vector3() ];
	private _prevTouches        = [ new GL.Vector3(), new GL.Vector3(), new GL.Vector3() ];
	private _prevDistance       = 0;

    // [ Private Events ]

	private _onMouseDown = ( event:MouseEvent ) => {

		if ( this._enabled === false ) return;

		if ( event.button === 0 ) {

			this._state = STATE.ROTATE;

		} else if ( event.button === 1 ) {

			this._state = STATE.ZOOM;

		} else if ( event.button === 2 ) {

			this._state = STATE.PAN;

		}

		this._pointerOld.set( event.clientX, event.clientY );

		this._domElement.addEventListener( 'mousemove'   , this._onMouseMove   , false );
		this._domElement.addEventListener( 'mouseup'     , this._onMouseUp     , false );
		this._domElement.addEventListener( 'mouseout'    , this._onMouseUp     , false );
		this._domElement.addEventListener( 'dblclick'    , this._onMouseUp     , false );
	}

    private _onMouseMove = ( event:MouseEvent ) => {

		if ( this._enabled === false ) return;

		this._pointer.set( event.clientX, event.clientY );

		let movementX = this._pointer.x - this._pointerOld.x;
		let movementY = this._pointer.y - this._pointerOld.y;

		if ( this._state === STATE.ROTATE ) {

			this.rotate( new GL.Vector3( - movementX * this._rotationSpeed, - movementY * this._rotationSpeed, 0 ) );

		} else if ( this._state === STATE.ZOOM ) {

			this.zoom( new GL.Vector3( 0, 0, movementY ) );

		} else if ( this._state === STATE.PAN ) {

			this.pan( new GL.Vector3( - movementX, movementY, 0 ) );

		}

		this._pointerOld.set( event.clientX, event.clientY );
	}

	private _onMouseUp = ( event:MouseEvent ) => {

		this._domElement.removeEventListener( 'mousemove' , this._onMouseMove   , false );
		this._domElement.removeEventListener( 'mouseup'   , this._onMouseUp     , false );
		this._domElement.removeEventListener( 'mouseout'  , this._onMouseUp     , false );
		this._domElement.removeEventListener( 'dblclick'  , this._onMouseUp     , false );

		this._state = STATE.NONE;
	}

	private _onMouseWheel = ( event:MouseWheelEvent ) => {

		event.preventDefault();

		// if ( this.enabled === false ) return;

		this.zoom( new GL.Vector3( 0, 0, event.deltaY ) );

	}

	private _onTouchStart = ( event:TouchEvent ) => {

		if ( this._enabled === false ) return;

		switch ( event.touches.length ) {
        case 1:
            this._touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
            this._touches[ 1 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
            break;

        case 2:
            this._touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
            this._touches[ 1 ].set( event.touches[ 1 ].pageX, event.touches[ 1 ].pageY, 0 );
            this._prevDistance = this._touches[ 0 ].distanceTo( this._touches[ 1 ] );
            break;

		}

		this._prevTouches[ 0 ].copy( this._touches[ 0 ] );
		this._prevTouches[ 1 ].copy( this._touches[ 1 ] );
	}

    private _onTouchMove = ( event:TouchEvent ) => {

		if ( this._enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

        case 1:
            this._touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
            this._touches[ 1 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
            this.rotate( this._touches[ 0 ].sub( this._getClosest( this._touches[ 0 ], this._prevTouches ) ).multiplyScalar( - this._rotationSpeed ) );
            break;

        case 2:
            this._touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
            this._touches[ 1 ].set( event.touches[ 1 ].pageX, event.touches[ 1 ].pageY, 0 );
            let distance = this._touches[ 0 ].distanceTo( this._touches[ 1 ] );
            this.zoom( new GL.Vector3( 0, 0, this._prevDistance - distance ) );
            this._prevDistance = distance;

            let offset0 = this._touches[ 0 ].clone().sub( this._getClosest( this._touches[ 0 ], this._prevTouches ) );
            let offset1 = this._touches[ 1 ].clone().sub( this._getClosest( this._touches[ 1 ], this._prevTouches ) );
            offset0.x = - offset0.x;
            offset1.x = - offset1.x;

            this.pan( offset0.add( offset1 ).multiplyScalar( 0.5 ) );

            break;
		}

		this._prevTouches[ 0 ].copy( this._touches[ 0 ] );
		this._prevTouches[ 1 ].copy( this._touches[ 1 ] );
	}

	private _onContextMenu = ( event:Event ) => {
		event.preventDefault();
	}

    private _getClosest = ( touch:GL.Vector3, touches:GL.Vector3[] ) => {

        let closest = touches[ 0 ];

        for ( let i in touches ) {
            if ( closest.distanceTo( touch ) > touches[ i ].distanceTo( touch ) ) closest = touches[ i ];
        }
        return closest;
    }
}

