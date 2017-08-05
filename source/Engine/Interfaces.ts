/**
 * Engine interfaces
 *
 * @author mosframe / https://github.com/mosframe
 */

import * as GL                      from './Graphic';
import { Color                  }   from './Color';
import { LightType              }   from './LightType';
import { Matrix4x4              }   from './Matrix4x4';
import { Quaternion             }   from './Quaternion';
import { ShadowCastingMode      }   from './Rendering/ShadowCastingMode';
import { Vector3                }   from './Vector3';


export * from './Using';

export interface ComponentType<T> {
    new():T;
}

/*
export interface Behaviour extends Component {
    //transform : Transform;
}

export interface Camera extends Behaviour {
    //core : GL.Camera;
}
export interface Component extends Ubject {
    //core : GL.Object3D;
    gameObject : GameObject;
    //getComponent<T extends Component>( type:ComponentType<T> ) : T|undefined;
}
export interface GameObject extends Ubject {
    core : GL.Object3D;
    //name : string;
    //scene : Scene;
    transform : Transform;
    //addComponent<T extends Component>( type:ComponentType<T> ) : T;
    //addComponentByName( componentName:string ) : Component;
    getComponent<T extends Component>( type:ComponentType<T> ) : T|undefined;
    //getComponentByName( componentName:string ) : Component|undefined;
    //removeComponent ( component:Component );
    //removeComponentByName ( componentName:string );
    //toJSON ( meta?:any ) : any;
    //fromJSON ( meta:any );
    //serialize (meta:any) : any;
}
export interface Geometry extends Ubject {
    //core : GL.Geometry|GL.BufferGeometry;
}
export interface Light extends Behaviour {
    //core : GL.Light;
    //type : LightType;
}
export interface Material extends Ubject {
    //core : GL.Material;
    //color : Color;
}
export interface Mesh extends Ubject {
    //core        : GL.Mesh;
    //geometry    : Geometry;
}
export interface MeshFilter extends Component {
    //core        : GL.Mesh;
    //mesh        : Mesh;
    //sharedMesh  : Mesh;
}
export interface MeshRenderer extends Renderer  {
    //core        : GL.Mesh;
}
export interface Renderer extends Component {
    //core : GL.Mesh;
    //material : Material;
    //materials : Material[];
    //receiveShadows : boolean;
    //shadowCastingMode : ShadowCastingMode;
    //sharedMaterial : Material;
    //sharedMaterials : Material[];
}
export interface Scene {
    //name : string;
    //rootCount : number;
    //core : GL.Scene;
    //add( object:GL.Object3D );
    //remove ( object:GL.Object3D );
    //toJSON ( meta:any ) : any;
    //fromJSON ( meta:any );
    //getRootObjects () : GL.Object3D[];
}
export interface Transform extends Component {
    core : GL.Object3D;
    //eulerAngles : Vector3;
    //localEulerAngles : Vector3;
    //localPosition : Vector3;
    //localRotation : Quaternion;
    //localScale : Vector3;
    //localToWorldMatrix : Matrix4x4;
    //lossyScale : Vector3;
    //position : Vector3;
    //rotation : Quaternion;
    //worldToLocalMatrix : Matrix4x4;
    //lookAt( traget:Transform, worldUp:Vector3 );
    //lookAt2( traget:Vector3 );
}
export interface Ubject {
    name : string;
    //uuid : string;
    //getInstanceID () : number;
    //toString () : string;
}
*/