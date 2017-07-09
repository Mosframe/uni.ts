/**
 * HierarchyWindow.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UIWindow           }   from '../Engine/UI/UIWindow';
import { ITool              }   from './Interfaces';
import { HierarchyEditor    }   from './Editors/HierarchyEditor';
//import { PropertiesPanel    }   from '../Panels/Properties';
//import { AnimationPanel     }   from '../Panels/Animation';
//import { ScriptPanel        }   from '../Panels/Script';

/**
 * scene hierarchy window
 *
 * @export
 * @class HierarchyWindow
 * @extends {UIWindow}
 */
export class HierarchyWindow extends UIWindow {

    // [ Constructor ]

    constructor ( editor:ITool ) {

        super( 'hierarchy',
            new HierarchyEditor( editor ),
            //new PropertiesPanel( editor ),
            //new AnimationPanel( editor ),
            //new ScriptPanel( editor ),
        );
    }
}
