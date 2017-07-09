/**
 * ViewMenu.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import * as GL                          from '../../Engine/Graphic'                ;
import { WebVR                      }   from '../../Engine/VR/WebVR'               ;
import { UIPanel                    }   from '../../Engine/UI/UIPanel'             ;
import { UIRow                      }   from '../../Engine/UI/UIRow'               ;
import { UIButton                   }   from '../../Engine/UI/UIButton'            ;
import { UINumber                   }   from '../../Engine/UI/UINumber'            ;
import { UIText                     }   from '../../Engine/UI/UIText'              ;
import { UIBoolean                  }   from '../../Engine/UI/UIBoolean'           ;
import { UIHorizontalRule           }   from '../../Engine/UI/UIHorizontalRule'    ;
import { ITool                      }   from '../Interfaces'                            ;
import { Menu                       }   from './Menu'                                   ;

/**
 * view menu
 *
 * @export
 * @class ViewMenu
 * @extends {Menu}
 */
export class ViewMenu extends Menu {

    constructor( tool:ITool ) {
        super('view');

        let title = new UIPanel();
        title.setClass( 'title' );
        title.setTextContent( 'View' );
        this.add( title );

        let options = new UIPanel();
        options.setClass( 'options' );
        this.add( options );

        // [ VR mode ]

        let option = new UIRow();
        option.setClass( 'option' );
        option.setTextContent( 'VR mode' );
        option.onClick( () => {

            if ( WebVR.isAvailable() ) {
                tool.signals.enterVR.dispatch();
            } else {
                alert( 'WebVR not available' );
            }
        });
        options.add( option );

    }
}
