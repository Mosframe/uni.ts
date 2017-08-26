/**
 * TestComponent.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine        } from '../../../Engine';
import { GL                 } from '../../../Engine';
import { UnitsBehaviour     } from '../../../Engine';
import { Quaternion         } from '../../../Engine';
import { Time               } from '../../../Engine';
import { Vector3            } from '../../../Engine';

export class TestComponent extends UnitsBehaviour {

    x : number = 10;
    y : number = 20;
    z : number = 30;

    protected awake () {
         console.log( this.constructor.name+'.'+this.awake.name );
         console.log('time',Time.time);
    }
    protected onEnable () {
         console.log( this.constructor.name+'.'+this.onEnable.name );
    }
    protected onDisable () {
        console.log( this.constructor.name+'.'+this.onDisable.name );
    }
    protected start () {
        console.log( this.constructor.name+'.'+this.start.name );
        console.log('time',Time.time);
    }

    protected update () {

        let rotation = this.transform.localRotation;

        //console.log('deltaTime',Time.deltaTime);

        let eulerAngles = new Vector3( 1 * Time.deltaTime, 0, 0 );
        this.transform.rotate( eulerAngles );

        console.log( this.transform.localEulerAngles );
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
