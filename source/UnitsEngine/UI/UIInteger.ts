/**
 * UIInteger
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UIInteger
 *
 * @export
 * @class UIInteger
 * @extends {UIElement}
 */
export class UIInteger extends UIElement {

    // [ Public Variables ]

    min : number;
    max : number;

    // [ Public Functions ]

    getStep () : number         { return this._step; }
    setStep ( value:number )    { this._step = parseInt( value.toString() ); return this; }
    getValue () : number        { return this._value; }
    setValue ( value:number )   {

        if( value !== undefined ) {

            value = parseInt ( value.toString() );

            if( value < this.min ) value = this.min;
            if( value > this.max ) value = this.max;

            this._value = value;
            this.core.value = value.toString();

            return this;
        }
    }

    setRange ( min:number, max:number ) {
        this.min = min;
        this.max = max;
        return this;
    }

    // [ Constructors ]

    constructor ( number:number ) {

        super( document.createElement( 'input' ), 'integer' );

        this.min                =-Infinity;
        this.max                = Infinity;
        this._distance          = 0;
        this._onMouseDownValue  = 0;
        this._pointer           = [ 0, 0 ];
        this._prevPointer       = [ 0, 0 ];

        this.setStep        ( 1 );
        this.setValue       ( number );
        this._blur          ( );

        this.onKeyDown      ( this._onKeyDown   );
        this.onMouseDown    ( this._onMouseDown );
        this.onChange       ( this._onChange    );
        this.onFocus        ( this._onFocus     );
        this.onBlur         ( this._onBlur      );

        this._changeEvent = document.createEvent ( 'HTMLEvents' );
        this._changeEvent.initEvent ( 'change', true, true );
    }


    // [ Protected Variables ]

    protected _value                : number;
    protected _step                 : number;
    protected _changeEvent          : Event;
    protected _distance             : number;
    protected _onMouseDownValue     : number;
    protected _pointer              : number[];
    protected _prevPointer          : number[];

    // [ Core ]

    get core() : HTMLInputElement { return <HTMLInputElement>this._core; }

    // [ Protected Functions ]

	protected _onKeyDown = ( event:KeyboardEvent ) => {

		event.stopPropagation();
	}

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
		value = Math.min( this.max, Math.max( this.min, value ) ) | 0;

		if( currentValue !== value ) {
			this.setValue(value);
			this.core.dispatchEvent( this._changeEvent );
		}

		this._prevPointer = [ event.clientX, event.clientY ];
	}

	protected _onMouseUp = ( event:MouseEvent ) => {

		document.removeEventListener( 'mousemove'   , this._onMouseMove  , false );
		document.removeEventListener( 'mouseup'     , this._onMouseUp    , false );

		if( Math.abs( this._distance ) < 2 ) {
			this.core.focus();
			this.core.select();
		}
	}

    protected _onChange = ( event:Event ) => {

        this.setValue( parseInt( this.core.value ) );
    }

	protected _onFocus = ( event:FocusEvent ) => {

		this._core.style.backgroundColor    = '';
		this._core.style.cursor             = '';
	}

	protected _onBlur = ( event:any ) => {

        this._blur();
	}

	protected _blur = () => {

		this._core.style.backgroundColor    = 'transparent';
		this._core.style.cursor             = 'col-resize';
	}
}
