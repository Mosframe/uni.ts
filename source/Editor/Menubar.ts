/**
 * menubar
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { UIPanel        }   from '../Engine/UI/UIPanel';
import { FileMenu       }   from './Menus/FileMenu';
import { EditMenu       }   from './Menus/EditMenu';
import { AddMenu        }   from './Menus/AddMenu';
import { PlayMenu       }   from './Menus/PlayMenu';
import { ExamplesMenu   }   from './Menus/ExamplesMenu';
import { HelpMenu       }   from './Menus/HelpMenu';
import { StatusMenu     }   from './Menus/StatusMenu';

/**
 * menubar
 *
 * @export
 * @class Menubar
 * @extends {UIPanel}
 */
export class Menubar extends UIPanel {

    constructor ( tool:any ) {
        super();

        this.setId( 'menubar' );

        this.add( new FileMenu( tool ) );
        this.add( new EditMenu( tool ) );
        this.add( new AddMenu( tool ) );
        this.add( new PlayMenu( tool ) );
        // this.add( new Menubar.View( tool ) );
        this.add( new ExamplesMenu( tool ) );
        this.add( new HelpMenu( tool ) );
        this.add( new StatusMenu( tool ) );

        document.body.appendChild( this.core );
    }
}