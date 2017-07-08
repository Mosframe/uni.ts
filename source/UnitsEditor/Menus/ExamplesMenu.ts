/**
 * examples menu
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
import { AddObjectCommand           }   from '../Commands/AddObjectCommand'             ;
import { RemoveObjectCommand        }   from '../Commands/RemoveObjectCommand'          ;
import { SetMaterialValueCommand    }   from '../Commands/SetMaterialValueCommand'      ;
import { MultiCmdsCommand           }   from '../Commands/MultiCmdsCommand'             ;
import { Menu                       }   from './Menu'                                   ;


/**
 * examples menu
 *
 * @export
 * @class ExamplesMenu
 * @extends {Menu}
 */
export class ExamplesMenu extends Menu {

    // [ Constructor ]

    constructor( editor:IEditor ) {
        super('examples');
    }
}
