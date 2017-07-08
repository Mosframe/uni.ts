/**
 * ViewMenu.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import * as GL                          from '../../UnitsEngine/Graphic'                ;
import { WebVR                      }   from '../../UnitsEngine/VR/WebVR'               ;
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
 * view menu
 *
 * @export
 * @class ViewMenu
 * @extends {Menu}
 */
export class ViewMenu extends Menu {

    constructor( editor:IEditor ) {
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
                editor.signals.enterVR.dispatch();
            } else {
                alert( 'WebVR not available' );
            }
        });
        options.add( option );

    }
}
