/**
 * HelpMenu.ts
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
 * help menu
 *
 * @export
 * @class HelpMenu
 * @extends {Menu}
 */
export class HelpMenu extends Menu {

    constructor( editor:IEditor ) {
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

                window.open( 'https://github.com/mrdoob/three.js/tree/master/editor', '_blank' )
            });
            options.add( option );
        }
        // [ Source code - Unicon ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Source code (Unicon)' );
            option.onClick( () => {

                window.open( 'https://github.com/mosframe/unicon/tree/master/server/unicon-editor', '_blank' )
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
