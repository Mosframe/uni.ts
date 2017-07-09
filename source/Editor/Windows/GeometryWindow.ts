/**
 * GeometryWindow.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UIWindow           }   from '../../Engine/UI/UIWindow';
import { ITool              }   from '../Interfaces';
import { GeometryEditor     }   from '../Editors/GeometryEditor';

/**
 * GeometryWindow
 *
 * @export
 * @class GeometryWindow
 * @extends {UIWindow}
 */
export class GeometryWindow extends UIWindow {

    // [ Constructor ]

    constructor ( tool:ITool ) {

        super( 'geometry', new GeometryEditor( tool ) );
    }
}
