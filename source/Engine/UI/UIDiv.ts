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

    constructor( className?:string ) {

        super( document.createElement( 'div' ), className );
    }

    // [ Core ]

    get core() : HTMLDivElement { return <HTMLDivElement>this._core; }
}
