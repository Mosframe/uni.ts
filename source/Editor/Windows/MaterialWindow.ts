/**
 * MaterialWindow.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UIWindow           }   from '../../Engine/UI/UIWindow';
import { ITool              }   from '../Interfaces';
import { MaterialEditor     }   from '../Editors/MaterialEditor';

/**
 * MaterialWindow
 *
 * @export
 * @class MaterialWindow
 * @extends {UIWindow}
 */
export class MaterialWindow extends UIWindow {

    // [ Constructor ]

    constructor ( tool:ITool ) {

        super( 'material', new MaterialEditor( tool ) );
    }
}
