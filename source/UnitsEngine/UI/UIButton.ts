/**
 * UIButton.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UIButton
 *
 * @export
 * @class UIButton
 * @extends {UIElement}
 */
export class UIButton extends UIElement {

    // [ Public Variables ]

    getLabel () : string|null       { return this.core.textContent; }
    setLabel ( value:string|null )  { this.core.textContent = value; return this; }

    // [ Constructors ]

    constructor( value:string ) {
        super( document.createElement( 'button' ), 'Button' );
        this.core.textContent = value;
    }

    // [ Core ]

    get core () : HTMLButtonElement { return <HTMLButtonElement>this._core; }
}
