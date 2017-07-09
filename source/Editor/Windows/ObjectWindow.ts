/**
 * ObjectWindow.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UIWindow           }   from '../../Engine/UI/UIWindow';
import { ITool              }   from '../Interfaces';
import { ObjectEditor       }   from '../Editors/ObjectEditor';

/**
 * ObjectWindow
 *
 * @export
 * @class ObjectWindow
 * @extends {UIWindow}
 */
export class ObjectWindow extends UIWindow {

    // [ Constructor ]

    constructor ( tool:ITool ) {

        super( 'object', new ObjectEditor( tool ) );
    }
}
