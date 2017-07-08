/**
 * StatusMenu.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import * as GL                          from '../../Engine/Graphic'                ;
import { UIPanel                    }   from '../../Engine/UI/UIPanel'             ;
import { UIRow                      }   from '../../Engine/UI/UIRow'               ;
import { UIButton                   }   from '../../Engine/UI/UIButton'            ;
import { UINumber                   }   from '../../Engine/UI/UINumber'            ;
import { UIText                     }   from '../../Engine/UI/UIText'              ;
import { UIBoolean                  }   from '../../Engine/UI/UIBoolean'           ;
import { UIHorizontalRule           }   from '../../Engine/UI/UIHorizontalRule'    ;
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
