/**
 * UIBoolean.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { UIElement  }   from './UIElement';
import { UISpan     }   from './UISpan';
import { UICheckbox }   from './UICheckbox';
import { UIText     }   from './UIText';

/**
 * UIBoolean
 *
 * @export
 * @class Boolean
 * @extends {UISpan}
 */
export class UIBoolean extends UISpan {

    // [ Public Variables ]

    get text () : UIText        { return this._text; }

    // [ Public Functions ]

    getValue () : boolean       { return this._checkbox.getValue(); }
    setValue ( value:boolean )  { this._checkbox.setValue(value); return this; }

    // [ Constructor ]

    constructor ( boolean, text:string ) {
        super();

        this.setMarginRight( '10px' );
        this._checkbox = new UICheckbox( boolean );
        this._text = new UIText( text ).setMarginLeft( '3px' );
        this.add( this._checkbox );
        this.add( this._text );
    }

    // [ Protected Variables ]

    protected _checkbox    : UICheckbox;
    protected _text        : UIText;
}

