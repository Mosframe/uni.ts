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

    constructor ( editor:any ) {
        super();

        this.setId( 'menubar' );

        this.add( new FileMenu( editor ) );
        this.add( new EditMenu( editor ) );
        this.add( new AddMenu( editor ) );
        this.add( new PlayMenu( editor ) );
        // this.add( new Menubar.View( editor ) );
        this.add( new ExamplesMenu( editor ) );
        this.add( new HelpMenu( editor ) );
        this.add( new StatusMenu( editor ) );

        document.body.appendChild( this.core );
    }
}