/**
 * Transform.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';
import { GL             }   from './Graphic';
import { Component      }   from './Component';
import { GameObject     }   from './GameObject';
import { Matrix4x4      }   from './Matrix4x4';
import { Quaternion     }   from './Quaternion';
import { Vector3        }   from './Vector3';

/**
 * Position, rotation and scale of an object.
 * Every object in a scene has a Transform.
 * It's used to store and manipulate the position, rotation and scale of the object.
 * Every Transform can have a parent, which allows you to apply position, rotation and scale hierarchically.
 * This is the hierarchy seen in the Hierarchy pane.
 * They also support enumerators so you can loop through children using
 *
 * @author mosframe / https://github.com/mosframe
 * @export
 * @class Transform
 * @extends {Component}
 */
export class Transform extends Component {

    // [ Public Static Variables ]

    // [ Public Variables ]

    /**
     * get Object3D
     *
     * @readonly
     * @type {GL.Object3D}
     * @memberof Transform
     */
    get core() : GL.Object3D                { return this.gameObject.core; }

    /*
    childCount	The number of children the Transform has.
    */
    get eulerAngles() : Vector3             { return this.core.localToWorld( this.localEulerAngles ); }
    set eulerAngles( value:Vector3 )        { this.localEulerAngles = this.core.worldToLocal(value); }
    /*
    forward	The blue axis of the transform in world space.
    hasChanged	Has the transform changed since the last time the flag was set to 'false'?
    hierarchyCapacity	The transform capacity of the transform's hierarchy data structure.
    hierarchyCount	The number of transforms in the transform's hierarchy data structure.
    */
    get localEulerAngles() : Vector3        { return new Vector3(this.core.rotation.x*GL.Math.RAD2DEG,this.core.rotation.y*GL.Math.RAD2DEG,this.core.rotation.z*GL.Math.RAD2DEG); }
    set localEulerAngles( value:Vector3 )   { this.core.rotation.x = value.x*GL.Math.DEG2RAD; this.core.rotation.y = value.y*GL.Math.DEG2RAD; this.core.rotation.z = value.z*GL.Math.DEG2RAD; }
    get localPosition() : Vector3           { return this.core.position; }
    set localPosition( value:Vector3 )      { this.core.position.set( value.x, value.y, value.z ); }
    get localRotation() : Quaternion        { return <Quaternion>(new Quaternion().setFromEuler( this.core.rotation )); }
    set localRotation( value:Quaternion )   { this.core.rotation = new GL.Euler().setFromQuaternion( value ); }
    get localScale() : Vector3              { return this.core.scale; }
    set localScale( value:Vector3 )         { this.core.scale.set( value.x, value.y, value.z ); }

    get localToWorldMatrix() : Matrix4x4    { return this.core.matrix; }
    get lossyScale() : Vector3              { return this.core.getWorldScale(); }
    //	The parent of the transform.
    get parent () : Transform               {
        let go = <GameObject>this.__scene.findUbjectByUUID( this.core.uuid );
        return go.transform;
    }
    set parent ( value:Transform )          { this.setParent( value ); }

    get position() : Vector3                { return this.core.localToWorld(this.core.position); }
    set position( value:Vector3 )           { let localPos = this.core.worldToLocal(value); this.core.position.set( localPos.x, localPos.y, localPos.z ); }
    /*
    right	The red axis of the transform in world space.
    root	Returns the topmost transform in the hierarchy.
    */
    get rotation() : Quaternion             { return <Quaternion>this.core.quaternion; }
    set rotation( value:Quaternion )        { this.core.quaternion = value; }
    /*
    up	The green axis of the transform in world space.
    */
    get worldToLocalMatrix() : Matrix4x4    { return this.core.matrixWorld; }

    // [ Public Functions ]

    /*
    DetachChildren	Unparents all children.
    Find	Finds a child by name and returns it.
    GetChild	Returns a transform child by index.
    GetSiblingIndex	Gets the sibling index.
    InverseTransformDirection	Transforms a direction from world space to local space. The opposite of Transform.TransformDirection.
    InverseTransformPoint	Transforms position from world space to local space.
    InverseTransformVector	Transforms a vector from world space to local space. The opposite of Transform.TransformVector.
    IsChildOf	Is this transform a child of parent?
    */
    lookAt( traget:Transform, worldUp:Vector3=Vector3.up ) {
        // TODO : worldUp 처리가 필요함
        this.core.lookAt( traget.position );
    }
    lookAt2( traget:Vector3 ) {
        this.core.lookAt(traget);
    }

    /*
    Rotate	Applies a rotation of eulerAngles.z degrees around the z axis, eulerAngles.x degrees around the x axis, and eulerAngles.y degrees around the y axis (in that order).
    RotateAround	Rotates the transform about axis passing through point in world coordinates by angle degrees.
    SetAsFirstSibling	Move the transform to the start of the local transform list.
    SetAsLastSibling	Move the transform to the end of the local transform list.
    */
    /**
     * Set the parent of the transform.
     *
     * @param {(Transform|undefined)} [parent=undefined]
     * @memberof Transform
     */
    setParent( parent:Transform|undefined=undefined ) {

        console.log( 'scale', this.lossyScale );

        // get parent
        let nextParent:GL.Object3D;
        if( parent ) {
            nextParent = parent.core;
        } else {
            nextParent = this.__scene.core;
        }

        // detach
        let currParent = this.core.parent;
        if( currParent !== undefined ) {
            this.core.applyMatrix( currParent.matrixWorld );
            currParent.remove( this.core );
        }

        //this.core.updateMatrix();
        // attach
        this.core.applyMatrix( new GL.Matrix4().getInverse( nextParent.matrixWorld ) );
        nextParent.add( this.core );

        console.log( 'scale', this.lossyScale );
    }
    /*
    SetPositionAndRotation	Sets the world space position and rotation of the Transform component.
    SetSiblingIndex	Sets the sibling index.
    TransformDirection	Transforms direction from local space to world space.
    TransformPoint	Transforms position from local space to world space.
    TransformVector	Transforms vector from local space to world space.
    Translate	Moves the transform in the direction and distance of translation.
    */
}
UnitsEngine[Transform.name] = Transform;
