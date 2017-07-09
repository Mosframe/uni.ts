/**
 * UIWindow
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UIPanel    }   from './UIPanel';
import { UISpan     }   from './UISpan';

/**
 * UIWindow
 *
 * @export
 * @class Window
 * @extends {UISpan}
 */
export class UIWindow extends UISpan {

    // [ Public Functions ]

    getPanel ( title:string ) : UIPanel {
        return this._panels[title];
    }

    // [ Constructor ]

    constructor ( title:string, ...panels:UIPanel[] ) {
        super();

        this.setTitle( title );

        for( let panel of panels ) {
            this._panels[ panel.getTitle() ] = panel;
            this.add( panel );
        }
    }

    // [ Protected Variables ]

    protected _panels : {[title:string]:UIPanel} = {}
}
