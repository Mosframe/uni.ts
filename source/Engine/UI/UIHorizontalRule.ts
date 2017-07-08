/**
 * UIHorizontalRule
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UIHorizontalRule
 *
 * @export
 * @class UIHorizontalRule
 * @extends {UIElement}
 */
export class UIHorizontalRule extends UIElement {

    // [ Constructors ]

    constructor() {

        super( document.createElement( 'hr' ), 'hr' );
    }

    // [ Core ]

    get core() : HTMLHRElement { return <HTMLHRElement>this._core; }
}
