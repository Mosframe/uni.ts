/**
 * PropertiesEditor.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { GL             }   from '../../Engine/Graphic';
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
import { UITab          }   from '../../Engine/UI/UITab';
import { ITool          }   from '../Interfaces';
import { ISignals       }   from '../Interfaces';
import { ObjectWindow   }   from '../Windows/ObjectWindow';
import { GeometryWindow }   from '../Windows/GeometryWindow';
import { MaterialWindow }   from '../Windows/MaterialWindow';

/**
 * properties panel
 *
 * @export
 * @class PropertiesPanel
 * @extends {TabPanel}
 */
export class PropertiesEditor extends UITab {

    // [ Constructor ]

    constructor ( tool:ITool ) {
        super( 'properties' );

        this.setBorderTop( '0px' );
        this.setBorderBottom( '0px' );
        this.setPaddingLeft( '0px' );
        this.setPaddingTop( '0px' );

        this.attach ( new ObjectWindow( tool ) );
        this.attach ( new GeometryWindow( tool ) );
        this.attach ( new MaterialWindow( tool ) );

        this._select( 'object' );
    }
}
