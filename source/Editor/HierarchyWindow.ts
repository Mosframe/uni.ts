/**
 * HierarchyWindow.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UIWindow           }   from '../Engine/UI/UIWindow';
import { ITool              }   from './Interfaces';
import { HierarchyEditor    }   from './Editors/HierarchyEditor';
import { PropertiesEditor   }   from './Editors/PropertiesEditor';
import { AnimationEditor    }   from './Editors/AnimationEditor';
import { ScriptEditor       }   from './Editors/ScriptEditor';

/**
 * scene hierarchy window
 *
 * @export
 * @class HierarchyWindow
 * @extends {UIWindow}
 */
export class HierarchyWindow extends UIWindow {

    // [ Constructor ]

    constructor ( tool:ITool ) {

        super( 'hierarchy',
            new HierarchyEditor( tool ),
            new PropertiesEditor( tool ),
            new AnimationEditor( tool ),
            new ScriptEditor( tool ),
        );
    }
}
