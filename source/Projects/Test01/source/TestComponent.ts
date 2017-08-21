/**
 * TestComponent.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine        } from '../../../Engine';
import { GL                 } from '../../../Engine';
import { UnitsBehaviour     } from '../../../Engine';
import { Quaternion         } from '../../../Engine';
import { Vector3            } from '../../../Engine';

export class TestComponent extends UnitsBehaviour {

    x : number = 10;
    y : number = 20;
    z : number = 30;

    protected awake () {
         console.log( this.constructor.name+'.'+this.awake.name );
    }
    protected onEnable () {
         console.log( this.constructor.name+'.'+this.onEnable.name );
    }
    protected onDisable () {
        console.log( this.constructor.name+'.'+this.onDisable.name );
    }
    protected start () {
        console.log( this.constructor.name+'.'+this.start.name );
    }

    protected update (time,deltaTime) {

        //let rotation = this.transform.localRotation;

        let eulerAngles = this.transform.eulerAngles;
        eulerAngles.x += GL.Math.DEG2RAD * 1 * deltaTime;
        this.transform.rotate( eulerAngles );

        //this.transform.localRotation = rotation;
    }


    protected onKeyDown ( event:KeyboardEvent ) {
        console.log( this.constructor.name+'.'+this.onKeyDown.name );
    }
    protected onKeyUp ( event:KeyboardEvent ) {
        console.log( this.constructor.name+'.'+this.onKeyUp.name );
    }

    protected onMouseDown ( event:MouseEvent ) {
        console.log( this.constructor.name+'.'+this.onMouseDown.name );
    }
    protected onMouseUp ( event:MouseEvent ) {
        console.log( this.constructor.name+'.'+this.onMouseUp.name );
    }
    protected onMouseMove ( event:MouseEvent ) {
        //console.log( this.constructor.name+'.'+this.onMouseMove.name );
    }

    protected onTouchDown ( event:TouchEvent ) {
        console.log( this.constructor.name+'.'+this.onTouchDown.name );
    }
    protected onTouchUp ( event:TouchEvent ) {
        console.log( this.constructor.name+'.'+this.onTouchUp.name );
    }
    protected onTouchMove ( event:TouchEvent ) {
        //console.log( this.constructor.name+'.'+this.onTouchMove.name );
    }



}
UnitsEngine[TestComponent.name]=TestComponent;
