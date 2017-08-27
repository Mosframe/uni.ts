/**
 * UnitsBehaviour.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';
import { THREE          }   from './Core';
import { Transform      }   from './Transform';
import { Behaviour      }   from './Behaviour';

/**
 * UnitsBehaviour is the base class from which every Units script derives.
 *
 * @export
 * @class Behaviour
 * @extends {Component}
 */
export class UnitsBehaviour extends Behaviour {

    // [ Public Functions ]

    protected awake             () {}
    protected onEnable          () {}
    protected onDisable         () {}
    protected start             () {}
    protected update            () {}

    /*
    protected fixedUpdate       () {}

    protected onTriggerEnter    () {}
    protected onTriggerStay     () {}
    protected onTriggerExit     () {}

    protected onCollisionEnter  () {}
    protected onCollisionStay   () {}
    protected onCollisionExit   () {}

    protected onMouseEnter      () {}
    protected onMouseExit       () {}
    protected onMouseDown       () {}
    protected onMouseUp         () {}
    */

    protected onKeyDown     ( event:KeyboardEvent ) {}
    protected onKeyUp       ( event:KeyboardEvent ) {}

    protected onMouseDown   ( event:MouseEvent ) {}
    protected onMouseUp     ( event:MouseEvent ) {}
    protected onMouseMove   ( event:MouseEvent ) {}

    protected onTouchDown   ( event:TouchEvent ) {}
    protected onTouchUp     ( event:TouchEvent ) {}
    protected onTouchMove   ( event:TouchEvent ) {}

    // [ Constructors ]

    constructor () {
        super();
    }



}
UnitsEngine[UnitsBehaviour.name] = Behaviour;
