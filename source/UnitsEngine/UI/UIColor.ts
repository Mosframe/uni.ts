/**
 * UIColor.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UIColor
 *
 * @export
 * @class UIColor
 * @extends {UIElement}
 */
export class UIColor extends UIElement {

    // [ Public Variables ]

    getValue () : string            { return this.core.value; }
    setValue ( value:string )       { this.core.value=value; return this; }
    getHexValue () : number         { return parseInt(this.core.value.substr(1), 16); }
    setHexValue ( value:number )    { this.core.value = '#' + ('000000'+value.toString(16)).slice(-6); return this }

    // [ Constructors ]

    constructor () {

        super( document.createElement( 'input' ), 'color' );

        this.core.type          = 'color';

        this.setWidth           ( '64px'        );
        this.setHeight          ( '17px'        );
        this.setBorder          ( '0px'         );
        this.setPadding         ( '2px'         );
        this.setValue           ( '#ffffff'     );
        this.setBackgroundColor ( 'transparent' );
    }

    // [ Core ]

    get core() : HTMLInputElement { return <HTMLInputElement>this._core; }
}
