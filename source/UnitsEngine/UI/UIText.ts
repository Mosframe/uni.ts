/**
 * UIText
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UIText
 *
 * @export
 * @class UIText
 * @extends {UIElement}
 */
export class UIText extends UIElement {

    // [ Public Variables ]

    getValue () : string|null   { return this.core.textContent; }
    setValue ( value?:string )  { if( value !== undefined ) this.core.textContent = value; return this; }

    // [ Constructors ]

    constructor ( text:string='' ) {

        super( document.createElement( 'span' ), 'Text' );

        this.core.style.cursor          = 'default';
        this.core.style.display         = 'inline-block';
        this.core.style.verticalAlign   = 'middle';

        this.setValue( text );
    }

    // [ Core ]

    get core() : HTMLSpanElement { return <HTMLSpanElement>this._core; }
}
