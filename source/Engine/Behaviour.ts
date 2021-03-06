/**
 * Behaviour.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';
import { THREE          }   from './Core';
import { Transform      }   from './Transform';
import { Component      }   from './Component';

/**
 * Behaviours are Components that can be enabled or disabled.
 *
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
}
UnitsEngine[Behaviour.name] = Behaviour;
