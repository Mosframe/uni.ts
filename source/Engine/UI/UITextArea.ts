/**
 * UITextArea
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import {UIElement} from './UIElement';

/**
 * UITextArea
 *
 * @export
 * @class UITextArea
 * @extends {UIElement}
 */
export class UITextArea extends UIElement {

    // [ Public Variables ]

    getValue () : string        { return this.core.value; }
    setValue ( value:string )   { if( value !== undefined ) this.core.value = value; return this; }

    // [ Constructors ]

    constructor () {

        super( document.createElement( 'textarea' ), 'textarea' );

        this.core.style.padding     = '2px';
        this.core.spellcheck        = false;

        this.onKeyDown ( ( event:KeyboardEvent ) =>{

            event.stopPropagation();

            if ( event.keyCode === 9 ) {

                event.preventDefault();

                let cursor = this.core.selectionStart;
                this.core.value = this.core.value.substring( 0, cursor ) + '\t' + this.core.value.substring( cursor );
                this.core.selectionStart = cursor + 1;
                this.core.selectionEnd = this.core.selectionStart;
            }
        });
    }

    // [ Core ]

    get core() : HTMLTextAreaElement { return <HTMLTextAreaElement>this._core; }
}
