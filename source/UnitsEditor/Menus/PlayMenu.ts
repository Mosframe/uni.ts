/**
 * PlayMenu.ts
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
 * play menu
 *
 * @export
 * @class PlayMenu
 * @extends {Menu}
 */
export class PlayMenu extends Menu {

    constructor( editor:IEditor ) {
        super('play');

        let signals     = editor.signals;
        let isPlaying   = false;

        let title = new UIPanel();
        title.setClass( 'title' );
        title.setTextContent( 'Play' );
        title.onClick( () => {

            if ( isPlaying ) {
                isPlaying = false;
                title.setTextContent( 'Play' );
                signals.stopPlayer.dispatch();
            } else {
                isPlaying = true;
                title.setTextContent( 'Stop' );
                signals.startPlayer.dispatch();
            }
        });
        this.add( title );
    }
}
