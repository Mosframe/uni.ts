/**
 * ProjectWindow.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UIWindow           }   from '../Engine/UI/UIWindow';
import { ITool              }   from './Interfaces';
import { ProjectEditor      }   from './Editors/ProjectEditor';

/**
 * project window
 *
 * @export
 * @class ProjectWindow
 * @extends {UIWindow}
 */
export class ProjectWindow extends UIWindow {

    // [ Constructor ]

    constructor ( editor:ITool ) {

        super( 'project', new ProjectEditor( editor ) );
    }
}
