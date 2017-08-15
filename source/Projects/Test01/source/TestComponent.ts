/**
 * TestComponent.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { Behaviour  } from '../../../Engine/UnitsEngine';

export class TestComponent extends Behaviour {

    x : number = 10;
    y : number = 20;
    z : number = 30;

}
window['UNITS'][TestComponent.name]=TestComponent;
