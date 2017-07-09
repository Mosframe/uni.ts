/**
 * SettingsWindow.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UIWindow           }   from '../Engine/UI/UIWindow';
import { ITool              }   from './Interfaces';
import { SettingsEditor     }   from './Editors/SettingsEditor';
import { HistoryEditor      }   from './Editors/HistoryEditor';

/**
 * settings window
 *
 * @export
 * @class SettingWindow
 * @extends {UIWindow}
 */
export class SettingsWindow extends UIWindow {

    // [ Constructor ]

    constructor ( tool:ITool ) {
        super( 'settings',
            new SettingsEditor( tool ),
            new HistoryEditor( tool ),
        );
    }
}
