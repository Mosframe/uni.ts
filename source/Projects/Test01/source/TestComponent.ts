/**
 * TestComponent.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    } from '../../../Engine';
import { Behaviour      } from '../../../Engine';

export class TestComponent extends Behaviour {

    x : number = 10;
    y : number = 20;
    z : number = 30;

}
UnitsEngine[TestComponent.name]=TestComponent;
