/**
 * UIModal.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { UIElement } from './UIElement';
import { UIPanel   } from './UIPanel';

/**
 * UIModal
 *
 * @export
 * @class UIModal
 * @extends {UIElement}
 */
export class UIModal extends UIElement {

    // [ Public Functions ]

    show ( content:Element ) {
        this._container.clear();
        this._container.add( content );
        this.core.style.display = 'flex';
        return this;
    }

    hide () {
        this.core.style.display = 'none';
        return this;
    }

    // [ Constructors ]

    constructor( value?:string ) {

        super( document.createElement( 'div' ), 'modal' );

        this.core.style.position          = 'absolute';
        this.core.style.width             = '100%';
        this.core.style.height            = '100%';
        this.core.style.backgroundColor   = 'rgba(0,0,0,0.5)';
        this.core.style.display           = 'none';
        this.core.style.alignItems        = 'center';
        this.core.style.justifyContent    = 'center';

        this._container = new UIPanel();
        this._container.core.style.width             = '200px';
        this._container.core.style.padding           = '20px';
        this._container.core.style.backgroundColor   = '#ffffff';
        this._container.core.style.boxShadow         = '0px 5px 10px rgba(0,0,0,0.5)';

        this.add( this._container );

        this.onClick ( ( event:MouseEvent ) => {
            this.hide();
        });
    }

    // [ Core ]

    get core() : HTMLDivElement { return <HTMLDivElement>this._core; }

    // [ Protected Variables ]

    protected _container : UIPanel;
}
