/**
 * UISelect.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UISelect
 *
 * @export
 * @class UISelect
 * @extends {UIElement}
 */
export class UISelect extends UIElement {

    // [ Public Variables ]

    getValue () : string            { return this.core.value; }
    setValue ( value:string )       { if( value !== undefined ) this.core.value = value; return this; }

    getMultiple () : boolean        { return this.core.multiple; }
    setMultiple ( value:boolean )   { this.core.multiple = value; return this; }

    getOptions () : string[] {

        let options:string[] = [];

        for( let key in this._core.children ) {
            let child = this._core.children[key];
            if( child instanceof HTMLOptionElement ) {
                options.push( child.innerHTML );
            }
        }
        return options;
    }

    setOptions ( options:{[title:string]:string} ) {

    	let selected = this.core.value;

        while( this._core.children.length > 0 ) {
            if( this._core.firstChild ) this._core.removeChild( this._core.firstChild );
        }

        for( let title in options ) {
            let option = document.createElement( 'option' );
            option.value = title;
            option.innerHTML = options[ title ];
            this._core.appendChild( option );
        }

        this.core.value = selected;
        return this;
    }

    // [ Constructors ]

    constructor () {

        super( document.createElement( 'select' ), 'select' );
        this.core.style.padding = '2px';
    }

    // [ Core ]

    get core() : HTMLSelectElement { return <HTMLSelectElement>this._core; }
}
