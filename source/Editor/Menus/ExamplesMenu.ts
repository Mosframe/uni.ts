/**
 * examples menu
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { THREE                         }   from '../../Engine/Core'                 ;
import { UIPanel                    }   from '../../Engine/UI/UIPanel'              ;
import { UIRow                      }   from '../../Engine/UI/UIRow'                ;
import { UIButton                   }   from '../../Engine/UI/UIButton'             ;
import { UINumber                   }   from '../../Engine/UI/UINumber'             ;
import { UIText                     }   from '../../Engine/UI/UIText'               ;
import { UIBoolean                  }   from '../../Engine/UI/UIBoolean'            ;
import { UIHorizontalRule           }   from '../../Engine/UI/UIHorizontalRule'     ;
import { ITool                      }   from '../Interfaces'                        ;
import { AddObjectCommand           }   from '../Commands/AddObjectCommand'         ;
import { RemoveObjectCommand        }   from '../Commands/RemoveObjectCommand'      ;
import { SetMaterialValueCommand    }   from '../Commands/SetMaterialValueCommand'  ;
import { MultiCmdsCommand           }   from '../Commands/MultiCmdsCommand'         ;
import { Menu                       }   from './Menu'                               ;


/**
 * examples menu
 *
 * @export
 * @class ExamplesMenu
 * @extends {Menu}
 */
export class ExamplesMenu extends Menu {

    // [ Constructor ]

    constructor( tool:ITool ) {
        super('examples');
    }
}
