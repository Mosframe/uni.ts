import * as GL        from '../Engine/Graphic';
import {Component   } from '../Engine/Component';
import {GameObject  } from '../Engine/GameObject';
import {Transform   } from '../Engine/Transform';
import {Ubject      } from '../Engine/Ubject';

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
}
window['UNITS'][Behaviour.name]=Behaviour;
