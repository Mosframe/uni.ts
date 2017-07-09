/**
 * SettingsEditor.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import * as GL              from '../../Engine/Graphic';
import { System         }   from '../../Engine/System';
import { UIPanel        }   from '../../Engine/UI/UIPanel';
import { UIButton       }   from '../../Engine/UI/UIButton';
import { UINumber       }   from '../../Engine/UI/UINumber';
import { UIDiv          }   from '../../Engine/UI/UIDiv';
import { UISpan         }   from '../../Engine/UI/UISpan';
import { UIRow          }   from '../../Engine/UI/UIRow';
import { UIColor        }   from '../../Engine/UI/UIColor';
import { UIText         }   from '../../Engine/UI/UIText';
import { UIBreak        }   from '../../Engine/UI/UIBreak';
import { UISelect       }   from '../../Engine/UI/UISelect';
import { UIBoolean      }   from '../../Engine/UI/UIBoolean';
import { UICheckbox     }   from '../../Engine/UI/UICheckbox';
import { ITool          }   from '../Interfaces';
import { ISignals       }   from '../Interfaces';

/**
 * SettingsEditor
 *
 * @export
 * @class SettingsEditor
 * @extends {UIPanel}
 */
export class SettingsEditor extends UIPanel {

    // [ Constructor ]

    constructor( tool:ITool ) {

        super('settings');

        let config = tool.config;

        this.setBorderTop( '0' );
        this.setPaddingTop( '20px' );

        // [ Theme.types ]
        let options = {
            'css/light.css' : 'light',
            'css/dark.css'  : 'dark'
        };

        // [ Theme ]
        let theme = new UISelect().setWidth( '150px' );
        theme.setOptions( options );
        if( config.getKey( 'theme' ) !== undefined ) {
            theme.setValue( config.getKey( 'theme' ) );
        }
        theme.onChange( () => {
            let value = theme.getValue();
            tool.setTheme( value );
            tool.config.setKey( 'theme', value );
        });

        let themeRow = new UIRow();
        themeRow.add( new UIText( 'Theme' ).setWidth( '90px' ) );
        themeRow.add( theme );

        this.add( themeRow );
    }
}