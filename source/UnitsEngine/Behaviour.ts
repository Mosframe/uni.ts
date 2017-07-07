import * as GL        from '../UnitsEngine/Graphic';
import {Component   } from '../UnitsEngine/Component';
import {GameObject  } from '../UnitsEngine/GameObject';
import {Transform   } from '../UnitsEngine/Transform';
import {Ubject      } from '../UnitsEngine/Ubject';

/**
 * Behaviours are Components that can be enabled or disabled.
 *
 * @author mosframe / https://github.com/mosframe
 * @export
 * @class Behaviour
 * @extends {Component}
 */
export class Behaviour extends Component {

    // [ Public Variables ]

    /*
    enabled	Enabled Behaviours are Updated, disabled Behaviours are not.
    isActiveAndEnabled	Has the Behaviour had enabled called.
    */

    /**
     * The Transform attached to this GameObject.
     *
     * @type {Transform}
     * @memberof Component
     */
    get transform() : Transform { return this.gameObject.transform; }

    // [ Constructors ]

    // [ Public Functions ]

    // [ Public Static Variables ]

    // [ Public Static Functions ]

    // [ Public Operators ]

    // [ Public Events ]

    // [ public Messages ]

    // [ Protected Variables ]

    // [ Protected Functions ]

    // [ Protected Static Variables ]

    // [ Protected Static Functions ]
}
