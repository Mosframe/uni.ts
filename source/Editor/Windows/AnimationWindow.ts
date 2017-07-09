/**
 * AnimationWindow.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UIWindow           }   from '../../Engine/UI/UIWindow';
import { ITool              }   from '../Interfaces';
import { AnimationEditor     }   from '../Editors/AnimationEditor';

/**
 * AnimationWindow
 *
 * @export
 * @class AnimationWindow
 * @extends {UIWindow}
 */
export class AnimationWindow extends UIWindow {

    // [ Constructor ]

    constructor ( tool:ITool ) {

        super( 'animation', new AnimationEditor( tool ) );
    }
}
