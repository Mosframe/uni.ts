/**
 * RightSidebar1.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { UITab              }   from '../Engine/UI/UITab';
import { ITool              }   from './Interfaces';
import { HierarchyWindow    }   from './HierarchyWindow';
import { ProjectWindow      }   from './ProjectWindow';
//import { SettingsWindow     }   from './Windows/Settings';


/**
 * right sidebar 1
 *
 * @export
 * @class Sidebar
 * @extends {TabPanel}
 */
export class RightSidebar1 extends UITab {

    // [ Constructor ]

    constructor ( tool : ITool ) {
        super('right-sidebar1');

        // [ TAB ]
        this.attach ( new HierarchyWindow( tool ) );
        this.attach ( new ProjectWindow  ( tool ) );
        //this.attach ( new SettingsWindow ( tool ) );

        // default tab
        this._select( 'hierarchy' );

        document.body.appendChild( this.core );
    }
}
