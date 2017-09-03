/**
 * Quaternion.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';
import { THREE          }   from './Core';
import { Vector3        }   from './Vector3';

 /**
 * Quaternion
 *
 * @export
 * @class Quaternion
 * @extends {GL.Quaternion}
 */
export class Quaternion extends THREE.Quaternion {

    // [ Public Delegates ]

    // [ Public Static Variables ]

    /**
     * The identity rotation (Read Only).
     *
     * @readonly
     * @static
     * @type {Quaternion}
     * @memberof Quaternion
     */
    static get identity() : Quaternion { return new Quaternion(); }

    // [ Public Variables ]

    //Returns the euler angle representation of the rotation.
    get eulerAngles () : Vector3        { return new THREE.Euler().setFromQuaternion( this ).toVector3(); }
    set eulerAngles ( value:Vector3 )   { let q = this.setFromEuler( new THREE.Euler().setFromVector3(value) ); this.x = q.x; this.y = q.y; this.z = q.z; this.w = q.w; }
    /*
    this[int]	Access the x, y, z, w components using [0], [1], [2], [3] respectively.
    */

    // [ Constructors ]

    // [ Public Static Functions ]

    /*
    static Angle	Returns the angle in degrees between two rotations a and b.
    static AngleAxis	Creates a rotation which rotates angle degrees around axis.
    static Dot	The dot product between two rotations.
    static Euler	Returns a rotation that rotates z degrees around the z axis, x degrees around the x axis, and y degrees around the y axis (in that order).
    static FromToRotation	Creates a rotation which rotates from fromDirection to toDirection.
    static Inverse	Returns the Inverse of rotation.
    static Lerp	Interpolates between a and b by t and normalizes the result afterwards. The parameter t is clamped to the range [0, 1].
    static LerpUnclamped	Interpolates between a and b by t and normalizes the result afterwards. The parameter t is not clamped.
    static LookRotation	Creates a rotation with the specified forward and upwards directions.
    static RotateTowards	Rotates a rotation from towards to.
    static Slerp	Spherically interpolates between a and b by t. The parameter t is clamped to the range [0, 1].
    static SlerpUnclamped	Spherically interpolates between a and b by t. The parameter t is not clamped.
    */

    // [ Public Functions ]

    /*
    Set	Set x, y, z and w components of an existing Quaternion.
    SetFromToRotation	Creates a rotation which rotates from fromDirection to toDirection.
    SetLookRotation	Creates a rotation with the specified forward and upwards directions.
    */
    /**
     * Converts a rotation to angle-axis representation (angles in degrees).
     *
     * @returns {{axis:Vector3,angle:number}}
     * @memberof Quaternion
     */
    ToAngleAxis () : {axis:Vector3,angle:number} {

        let angle   = 0;
        let axis    = new Vector3();

        let q1 = this.x;
        let q2 = this.y;
        let q3 = this.z;

        let sin_squared = q1 * q1 + q2 * q2 + q3 * q3;

        if (sin_squared > 0.0) {
            let sin_theta = Math.sqrt(sin_squared);
            let k = 2.0 * Math.atan2(sin_theta, this.w) / sin_theta;
            axis.x = q1 * k;
            axis.y = q2 * k;
            axis.z = q3 * k;
        } else {
            let k = 2.0;
            axis.x = q1 * k;
            axis.y = q2 * k;
            axis.z = q3 * k;
        }
        return {axis,angle};
    }
    /*
    ToString	Returns a nicely formatted string of the Quaternion.
    */

    // [ Public Operators ]

    /*
    operator *	Combines rotations lhs and rhs.
    operator ==	Are two quaternions equal to each other?
    */
}
UnitsEngine[Quaternion.name] = Quaternion;
