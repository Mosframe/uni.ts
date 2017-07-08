/**
 * UIRow.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UIRow
 *
 * @export
 * @class UIRow
 * @extends {UIElement}
 */
export class UIRow extends UIElement {

    // [ Constructors ]

    constructor () {

        super( document.createElement( 'div' ), 'Row' );
    }

    // [ Core ]

    get core() : HTMLDivElement { return <HTMLDivElement>this._core; }
}
