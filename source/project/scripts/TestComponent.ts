/**
 * TestComponent.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { components } from '../../Engine/Component';
import { Behaviour  } from '../../Engine/Behaviour';

export class TestComponent extends Behaviour {

    x : number = 10;
    y : number = 20;
    z : number = 30;

}

components[TestComponent.name] = TestComponent;

