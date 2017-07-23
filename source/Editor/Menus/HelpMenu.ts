/**
 * HelpMenu.ts
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
import { ITool                      }   from '../Interfaces'                            ;
import { Menu                       }   from './Menu'                                   ;


/**
 * help menu
 *
 * @export
 * @class HelpMenu
 * @extends {Menu}
 */
export class HelpMenu extends Menu {

    constructor( tool:ITool ) {
        super('help');

        // [ Title ]
        let title = new UIPanel();
        title.setClass( 'title' );
        title.setTextContent( 'Help' );
        this.add( title );

        // [ Options ]
        let options = new UIPanel();
        options.setClass( 'options' );
        this.add( options );

        // [ Source code - three.js ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Source code (three.js)' );
            option.onClick( () => {

                window.open( 'https://github.com/mrdoob/three.js/tree/master/tool', '_blank' )
            });
            options.add( option );
        }
        // [ Source code - Uni.ts ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Source code (Uni.ts)' );
            option.onClick( () => {

                window.open( 'https://github.com/mosframe/unicon/tree/master/server/unicon-tool', '_blank' )
            });
            options.add( option );
        }

        // [ About ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'About (three.js)' );
            option.onClick( () => {

                window.open( 'http://threejs.org', '_blank' );
            });
            options.add( option );
        }
    }
}
