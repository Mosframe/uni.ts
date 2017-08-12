/**
 * VRControls.ts
 *
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 * @author Mosframe / https://github.com/Mosframe
 */

import { GL     }   from '../Graphic';
import { WebVR  }   from './WebVR';

/**
 * VR Controls
 *
 * @export
 * @class VRControls
 */
export class VRControls {

    // [ Public Variables ]

    get scale      ()  : number     { return this._scale;       }
    get standing   ()  : boolean    { return this._standing;    }
    get userHeight ()  : number     { return this._userHeight;  }

    // [ Public Functions ]

    getVRDisplay () : VRDisplay|null {
        return this._vrDisplay;
    }

    setVRDisplay ( value:VRDisplay ) {
        this._vrDisplay = value;
    }

    getStandingMatrix () : GL.Matrix4 {
        return this._standingMatrix;
    }

    update () {

        if ( this._vrDisplay ) {

            let pose;

            if ( this._vrDisplay.getFrameData ) {
                if( this._frameData ) {
                    this._vrDisplay.getFrameData( this._frameData );
                    pose = this._frameData.pose;
                }
            } else if ( this._vrDisplay.getPose ) {
                pose = this._vrDisplay.getPose();
            }

            if ( pose.orientation !== null ) {
                this._object.quaternion.fromArray( pose.orientation );
            }

            if ( pose.position !== null ) {
                this._object.position.fromArray( pose.position );
            } else {
                this._object.position.set( 0, 0, 0 );
            }

            if ( this._standing ) {
                if ( this._vrDisplay.stageParameters ) {
                    this._object.updateMatrix();
                    this._standingMatrix.fromArray( Array.from(this._vrDisplay.stageParameters.sittingToStandingTransform) );
                    this._object.applyMatrix( this._standingMatrix );
                } else {
                    this._object.position.setY( this._object.position.y + this._userHeight );
                }
            }
            this._object.position.multiplyScalar( this._scale );
        }
    }

    dispose () {
        this._vrDisplay = null;
    }

    // [ Constructor ]

    constructor ( object:GL.Object3D, onError?:Function ) {

        this._object            = object;
        this._onError           = onError;
        this._standingMatrix    = new GL.Matrix4();

		if ( 'VRFrameData' in window ) {
			this._frameData = new window['VRFrameData'];
		} else {
            this._frameData = null;
        }

        WebVR.getVRDisplays( (displays:VRDisplay[]) => {
            this._vrDisplays = displays;
            if( displays.length > 0 ) {
                this._vrDisplay = this._vrDisplays[0];
            } else {
                if( this._onError ) {
                    this._onError( 'VR input not available.' );
                }
            }
        });

        // the Rift SDK returns the position in meters
        // this scale factor allows the user to define how meters
        // are converted to scene units.
        this._scale = 1;

        // If true will use "standing space" coordinate system where y=0 is the
        // floor and x=0, z=0 is the center of the room.
        this._standing = false;

        // Distance from the users eyes to the floor in meters. Used when
        // standing=true but the VRDisplay doesn't provide stageParameters.
        this._userHeight = 1.6;
    }

    // [ Private Variables ]

    private _object         : GL.Object3D;
    private _onError        ?: Function;
	private _vrDisplay      : VRDisplay|null;
    private _vrDisplays     : VRDisplay[];
    private _standingMatrix : GL.Matrix4;
    private _frameData      : VRFrameData|null;
    private _scale          : number;
    private _standing       : boolean;
    private _userHeight     : number;

}