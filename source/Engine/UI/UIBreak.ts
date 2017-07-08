/**
 * UIBreak.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UIBreak
 *
 * @export
 * @class UIBreak
 * @extends {UIElement}
 */
export class UIBreak extends UIElement {

    // [ Constructors ]

    constructor () {
        super( document.createElement( 'br' ), 'break' );
        ;
    }

    // [ Core ]

    get core () : HTMLBRElement { return <HTMLBRElement>this._core; }
}
