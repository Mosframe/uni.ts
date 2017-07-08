/**
 * UIPanel.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UIPanel
 *
 * @export
 * @class UIPanel
 * @extends {UIElement}
 */
export class UIPanel extends UIElement {

    // [ Constructors ]

    constructor () {

        super( document.createElement( 'div' ), 'panel' );
    }

    // [ Core ]

    get core() : HTMLDivElement { return <HTMLDivElement>this._core; }
}
