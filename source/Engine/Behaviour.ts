/**
 * Behaviour.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import *            as GL               from './Graphic';
import { Behaviour  as IBehaviour   }   from './Interfaces';
import { Transform  as ITransform   }   from './Interfaces';
import { Component                  }   from './Component';

/**
 * Behaviours are Components that can be enabled or disabled.
 *
 * @export
 * @class Behaviour
 * @extends {Component}
 */
export class Behaviour extends Component implements IBehaviour  {

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
    get transform() : ITransform { return this.gameObject.transform; }

    // [ Constructors ]
}
window['UNITS'][Behaviour.name]=Behaviour;
