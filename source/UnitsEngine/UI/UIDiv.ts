/**
 * UIDiv
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UIDiv
 *
 * @export
 * @class UIDiv
 * @extends {UIElement}
 */
export class UIDiv extends UIElement {

    // [ Constructor ]

    constructor() {

        super( document.createElement( 'div' ), 'Div' );
    }

    // [ Core ]

    get core() : HTMLDivElement { return <HTMLDivElement>this._core; }
}
