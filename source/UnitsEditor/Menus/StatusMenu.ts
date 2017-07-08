/**
 * StatusMenu.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import * as GL                          from '../../UnitsEngine/Graphic'                ;
import { UIPanel                    }   from '../../UnitsEngine/UI/UIPanel'             ;
import { UIRow                      }   from '../../UnitsEngine/UI/UIRow'               ;
import { UIButton                   }   from '../../UnitsEngine/UI/UIButton'            ;
import { UINumber                   }   from '../../UnitsEngine/UI/UINumber'            ;
import { UIText                     }   from '../../UnitsEngine/UI/UIText'              ;
import { UIBoolean                  }   from '../../UnitsEngine/UI/UIBoolean'           ;
import { UIHorizontalRule           }   from '../../UnitsEngine/UI/UIHorizontalRule'    ;
import { IEditor                    }   from '../Interfaces'                            ;
import { Menu                       }   from './Menu'                                   ;

/**
 * status menu
 *
 * @export
 * @class StatusMenu
 * @extends {Menu}
 */
export class StatusMenu extends Menu {

    constructor( editor:IEditor ) {
        super('status');
        this.setClass( 'menu right' );

        let autosave = new UIBoolean( editor.config.getKey( 'autosave' ), 'autosave' );
        autosave.text.setColor( '#888' );
        autosave.onChange( () => {

            let value = autosave.getValue();
            editor.config.setKey( 'autosave', value );
            if ( value ) {
                editor.signals.sceneGraphChanged.dispatch();
            }
        });
        this.add( autosave );

        editor.signals.savingStarted.add( () => {

            autosave.text.setTextDecoration( 'underline' );
        });

        editor.signals.savingFinished.add( () => {

            autosave.text.setTextDecoration( 'none' );
        });

        let version = new UIText( 'r' + GL.REVISION );
        version.setClass( 'title' );
        version.setOpacity( '0.5' );
        this.add( version );
    }
}
