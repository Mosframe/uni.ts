/**
 * TestComponent.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine        } from '../../../Engine';
import { UnitsBehaviour     } from '../../../Engine';
import { Quaternion         } from '../../../Engine';

export class TestComponent extends UnitsBehaviour {

    x : number = 10;
    y : number = 20;
    z : number = 30;

    protected awake () {
         console.log( 'awake', this.constructor.name );
    }
    protected onEnable () {
         console.log( 'onEnable', this.constructor.name );

    }
    protected onDisable () {
         console.log( 'onDisable', this.constructor.name );

    }
    protected start () {
         console.log( 'start', this.constructor.name );

    }

    protected update () {

        //let rotation = this.transform.localRotation;

        this.transform.Rotate( );

        //this.transform.localRotation = rotation;
    }


    protected onKeyDown ( event:KeyboardEvent ) {

    }
    protected onKeyUp ( event:KeyboardEvent ) {

    }

    protected onMouseDown ( event:MouseEvent ) {

    }
    protected onMouseUp ( event:MouseEvent ) {

    }
    protected onMouseMove ( event:MouseEvent ) {

    }

    protected onTouchDown ( event:TouchEvent ) {

    }
    protected onTouchUp ( event:TouchEvent ) {

    }
    protected onTouchMove ( event:TouchEvent ) {

    }



}
UnitsEngine[TestComponent.name]=TestComponent;
