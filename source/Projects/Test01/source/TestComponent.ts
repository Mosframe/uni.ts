/**
 * TestComponent.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine        } from '../../../Engine';
import { THREE              } from '../../../Engine';
import { UnitsBehaviour     } from '../../../Engine';
import { Quaternion         } from '../../../Engine';
import { Space              } from '../../../Engine';
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

        this.testRotate();
    }

    private testRotate() {

        let eulerAngles = new Vector3( 360 * Time.deltaTime, 0, 0 );
        //let eulerAngles = new Vector3( 0, 360 * Time.deltaTime, 0 );
        //let eulerAngles = new Vector3( 0, 0, 360 * Time.deltaTime );

        //this.transform.Rotate( eulerAngles, Space.Self );
        this.transform.Rotate( eulerAngles, Space.World );

        console.log( Time.deltaTime, this.transform.core.getWorldRotation().x*THREE.Math.RAD2DEG );
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
