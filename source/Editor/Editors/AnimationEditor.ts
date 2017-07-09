/**
 * AnimationEditor.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import * as GL              from '../../Engine/Graphic';
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
import { UIOutliner     }   from '../UI/UIOutliner';
import { ITool          }   from '../Interfaces';
import { ISignals       }   from '../Interfaces';

/**
 * AnimationEditor
 *
 * @export
 * @class AnimationEditor
 * @extends {UIPanel}
 */
export class AnimationEditor extends UIPanel {

    // [ Constructor ]

    constructor ( tool:ITool ) {
        super( 'animation' );

        this.setBorderTop( '0' );
        this.setPaddingTop( '20px' );
        this.setPaddingRight( '0px' );

        this.setDisplay( 'none' );

        this.add( new UIText( 'Animation' ).setTextTransform( 'uppercase' ) );
        this.add( new UIBreak() );
        this.add( new UIBreak() );

        let animationsRow = new UIRow();
        this.add( animationsRow );
    }
}
