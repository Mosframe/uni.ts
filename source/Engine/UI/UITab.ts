/**
 * UITab.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { UIPanel    }   from './UIPanel';
import { UIButton   }   from './UIButton';
import { UINumber   }   from './UINumber';
import { UIDiv      }   from './UIDiv';
import { UISpan     }   from './UISpan';
import { UIText     }   from './UIText';
import { UIBoolean  }   from './UIBoolean';
import { UIWindow   }   from './UIWindow';

/**
 * UITab
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 * @export
 * @class UITab
 * @extends {UIPanel}
 */
export class UITab extends UIPanel {

    // [ Public Functions ]

    attach ( window:UIWindow ) {

        let title = window.getTitle();
        if( title in this._windows ) return;

        let headerName = title.charAt(0).toUpperCase() + title.slice(1);
        let header = new UIText( headerName ).setTitle(title);
        this._headers[ header.getTitle() ] = header;
        this._tabs.add( header );

        header.onClick( this._onTabClick );
        this._windows[ title ] = window;

        this.add( window );
    }

    detach ( window:UIWindow ) {

        let title = window.getTitle();
        if( title in this._windows ) {

            let header = this._headers[ title ];
            header.releaseEvent('click');

            delete this._headers[ title ];
            delete this._windows[ title ];

            this._tabs.remove( window );
            this.remove( window );
        }
    }

    // [ Constructor ]

    constructor ( id:string ) {
        super();

        this.setId( id );
        this.setPaddingRight( '0px' );

        // [ TAB ]
        this._tabs = new UIDiv();
        this._tabs.setId( 'tabs' );
        this.add( this._tabs );
    }

    // [ Protected Variables ]

    protected _tabs     : UIDiv;
    protected _headers  : {[title:string]:UIText} = {};
    protected _windows  : {[title:string]:UISpan} = {};

    // [ Protected Functions ]

    protected _select ( title:string ) {

        // [ Header ]
        for( let t in this._headers ) {
            this._headers[t].setClass( '' );
        }
        this._headers[title].setClass('selected');

        // [ Windows ]
        for( let w in this._windows ) {
            this._windows[w].setDisplay( 'none' );
        }
        this._windows[title].setDisplay( '' );
    }

    // [ private Events ]

    private _onTabClick = ( event:MouseEvent ) => {
        this._select( event.target['title'] );
    }
}
