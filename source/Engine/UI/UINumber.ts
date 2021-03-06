/**
 * UINumber
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UINumber
 *
 * @export
 * @class UINumber
 * @extends {UIElement}
 */
export class UINumber extends UIElement {

    // [ Public Functions ]

    getValue () : number                { return this._value; }
    setValue ( value?:number|string )   {
        if( value !== undefined ) {
            if( typeof value === 'string' ) {
                value = parseFloat( value );
            }

            if( value < this._min ) value = this._min;
            if( value > this._max ) value = this._max;

            this._value = value;
            this.core.value = value.toFixed( this._precision );

            if( this._unit !== '' ) this.core.value += ' ' + this._unit;
        }
        return this;
    }

    setPrecision ( precision:number ) {
        this._precision = precision;
        return this;
    }

    setStep ( step:number ) {
        this._step = step;
        return this;
    }

    setRange( min:number, max:number ) {
        this._min = min;
        this._max = max;
        return this;
    }

    setUnit ( unit:string ) {
        this._unit = unit;
        return this;
    }

    // [ Constructors ]

    constructor ( number?:number ) {

        super( document.createElement( 'input' ), 'number' );

        this._value         = 0;
        this._min           =-Infinity;
        this._max           = Infinity;
        this._precision     = 2;
        this._step          = 1;
        this._unit          = '';

        this.core.value     = '0.00';
        this.setValue ( number );

        this._changeEvent = document.createEvent( 'HTMLEvents' );
        this._changeEvent.initEvent( 'change', true, true );

        this._distance          = 0;
        this._onMouseDownValue  = 0;
        this._pointer           = [ 0, 0 ];
        this._prevPointer       = [ 0, 0 ];
        this._blur ();

        this.onKeyDown ( ( event:KeyboardEvent ) => {
            event.stopPropagation();
            if( event.keyCode === 13 ) this.core.blur();
        });

        this._core.addEventListener( 'mousedown', this._onMouseDown  , false );
        this._core.addEventListener( 'focus'    , this._onFocus      , false );
        this._core.addEventListener( 'blur'     , this._onBlur       , false );
        this._core.addEventListener( 'change'   , this._onChange     , false );
    }


    // [ Protected Variables ]

    protected _value                : number;
    protected _changeEvent          : Event;
    protected _distance             : number;
    protected _onMouseDownValue     : number;
    protected _pointer              : number[];
    protected _prevPointer          : number[];
    protected _min                  : number;
    protected _max                  : number;
    protected _precision            : number;
    protected _step                 : number;
    protected _unit                 : string;


    // [ Core ]

    get core() : HTMLInputElement { return <HTMLInputElement>this._core; }

    // [ Protected Functions ]

	protected _onMouseDown = ( event:MouseEvent ) => {

		event.preventDefault();

		this._distance          = 0;
		this._onMouseDownValue  = this._value;
		this._prevPointer       = [ event.clientX, event.clientY ];

		document.addEventListener( 'mousemove'  , this._onMouseMove   , false );
		document.addEventListener( 'mouseup'    , this._onMouseUp     , false );
	}

	protected _onMouseMove = ( event:MouseEvent ) => {

		let currentValue = this._value;

		this._pointer = [ event.clientX, event.clientY ];
		this._distance += ( this._pointer[ 0 ] - this._prevPointer[ 0 ] ) - ( this._pointer[ 1 ] - this._prevPointer[ 1 ] );

		let value = this._onMouseDownValue + ( this._distance / ( event.shiftKey ? 5 : 50 ) ) * this._step;
		value = Math.min( this._max, Math.max( this._min, value ) );

		if( currentValue !== value ) {
			this.setValue( value );
			//this.core.dispatchEvent( this._changeEvent );
		}

		this._prevPointer = [ event.clientX, event.clientY ];
	}

	protected _onMouseUp = ( event:MouseEvent ) => {

		document.removeEventListener( 'mousemove'   , this._onMouseMove  , false );
		document.removeEventListener( 'mouseup'     , this._onMouseUp    , false );

        if( this._onMouseDownValue !== this._value ) {
            this.core.dispatchEvent( this._changeEvent );
        }

		if( Math.abs( this._distance ) < 2 ) {
			this.core.focus();
			this.core.select();
		}
	}

    protected _onChange = ( event:Event ) => {

        this.setValue( this.core.value );
    }

	protected _onFocus = ( event:FocusEvent ) => {

        if( this._core.style ) {
            this._core.style.backgroundColor    = '';
            this._core.style.cursor             = '';
        }
	}

	protected _onBlur = ( event:FocusEvent ) => {

        this._blur();
	}

	protected _blur = () => {

        if( this._core.style ) {
            this._core.style.backgroundColor    = 'transparent';
            this._core.style.cursor             = 'col-resize';
        }
	}
}
