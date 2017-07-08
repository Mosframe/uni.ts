/**
 * UICheckbox
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UICheckbox
 *
 * @export
 * @class UICheckbox
 * @extends {UIElement}
 */
export class UICheckbox extends UIElement {

    // [ Public Variables ]

    getValue () : boolean       { return this.core.checked; }
    setValue ( value?:boolean ) { if( value !== undefined ) this.core.checked = value; return this; }

    // [ Constructors ]

    constructor ( checked?:boolean ) {

        super( document.createElement( 'input' ), 'Checkbox' );
        this.core.type = 'checkbox';
        this.setValue( checked );
    }

    // [ Core ]

    get core() : HTMLInputElement { return <HTMLInputElement>this._core; }
}
