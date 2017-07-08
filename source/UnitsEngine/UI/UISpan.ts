/**
 * UISpan.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UISpan
 *
 * @export
 * @class UISpan
 * @extends {UIElement}
 */
export class UISpan extends UIElement {

    // [ Constructors ]

    constructor ( className?:string ) {
        super( document.createElement( 'span' ), className );
    }

    // [ Core ]

    get core() : HTMLSpanElement { return <HTMLSpanElement>this._core; }
}
