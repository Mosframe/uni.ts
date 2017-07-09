/**
 * PlayMenu.ts
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
import { ITool                    }   from '../Interfaces'                            ;
import { Menu                       }   from './Menu'                                   ;

/**
 * play menu
 *
 * @export
 * @class PlayMenu
 * @extends {Menu}
 */
export class PlayMenu extends Menu {

    constructor( editor:ITool ) {
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
