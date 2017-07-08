/**
 * UIInput
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UIInput
 *
 * @export
 * @class UIInput
 * @extends {UIElement}
 */
export class UIInput extends UIElement {

    // [ Public Variables ]

    getValue () : string        { return this.core.value; }
    setValue ( value?:string )  { if( value !== undefined ) this.core.value = value; return this; }

    // [ Constructors ]

    constructor ( text?:string ) {

        super( document.createElement( 'input' ), 'input' );

        this.setPadding ( '2px' );
        this.setBorder  ( '1px solid transparent' );
        this.setValue   ( text );
        this.onKeyDown  ( ( event:KeyboardEvent ) => { event.stopPropagation(); } );
    }

    // [ core ]

    get core() : HTMLInputElement { return <HTMLInputElement>this._core; }
}
