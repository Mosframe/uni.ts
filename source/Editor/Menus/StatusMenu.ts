/**
 * StatusMenu.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { GL                         }   from '../../Engine/Graphic'                 ;
import { UIPanel                    }   from '../../Engine/UI/UIPanel'              ;
import { UIRow                      }   from '../../Engine/UI/UIRow'                ;
import { UIButton                   }   from '../../Engine/UI/UIButton'             ;
import { UINumber                   }   from '../../Engine/UI/UINumber'             ;
import { UIText                     }   from '../../Engine/UI/UIText'               ;
import { UIBoolean                  }   from '../../Engine/UI/UIBoolean'            ;
import { UIHorizontalRule           }   from '../../Engine/UI/UIHorizontalRule'     ;
import { ITool                      }   from '../Interfaces'                        ;
import { Menu                       }   from './Menu'                               ;

/**
 * status menu
 *
 * @export
 * @class StatusMenu
 * @extends {Menu}
 */
export class StatusMenu extends Menu {

    constructor( tool:ITool ) {
        super('status');
        this.setClass( 'menu right' );

        let autosave = new UIBoolean( tool.config.getKey( 'autosave' ), 'autosave' );
        autosave.text.setColor( '#888' );
        autosave.onChange( () => {

            let value = autosave.getValue();
            tool.config.setKey( 'autosave', value );
            if ( value ) {
                tool.signals.sceneGraphChanged.dispatch();
            }
        });
        this.add( autosave );

        tool.signals.savingStarted.add( () => {

            autosave.text.setTextDecoration( 'underline' );
        });

        tool.signals.savingFinished.add( () => {

            autosave.text.setTextDecoration( 'none' );
        });

        let version = new UIText( 'r' + GL.REVISION );
        version.setClass( 'title' );
        version.setOpacity( '0.5' );
        this.add( version );
    }
}
