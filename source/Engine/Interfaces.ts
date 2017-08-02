/**
 * Engine interfaces
 *
 * @author mosframe / https://github.com/mosframe
 */

import * as GL                          from './Graphic';
import { Matrix4x4                  }   from './Matrix4x4';
import { Quaternion                 }   from './Quaternion';
import { Vector3                    }   from './Vector3';

export * from './Using';


/**
 * Behaviours are Components that can be enabled or disabled.
 *
 * @export
 * @class Behaviour
 * @extends {Component}
 */
export interface Behaviour extends Component {

    /*
    enabled	Enabled Behaviours are Updated, disabled Behaviours are not.
    isActiveAndEnabled	Has the Behaviour had enabled called.
    */
    /**
     * The Transform attached to this GameObject.
     *
     * @type {Transform}
     * @memberof Component
     */
    transform() : Transform;
}
/**
 * A Camera is a device through which the player views the world.
 *
 * A screen space point is defined in pixels. The bottom-left of the screen is (0,0); the right-top is (pixelWidth,pixelHeight). The z position is in world units from the Camera.
 *
 * A viewport space point is normalized and relative to the Camera. The bottom-left of the Camera is (0,0); the top-right is (1,1). The z position is in world units from the Camera.
 *
 * A world space point is defined in global coordinates (for example, Transform.position).
 *
 * @author mosframe / https://github.com/mosframe
 * @export
 * @class Camera
 * @extends {Behaviour}
 */
export interface Camera extends Behaviour {

    // [ Public Delegates ]

    /*
    CameraCallback	Delegate type for camera callbacks.
    */

    // [ Public Static Variables ]

    /*
    static allCameras	Returns all enabled cameras in the scene.
    static allCamerasCount	The number of cameras in the current scene.
    static current	The camera we are currently rendering with, for low-level render control only (Read Only).
    static main	The first enabled camera tagged "MainCamera" (Read Only).
    static onPostRender	Event that is fired after any camera finishes rendering.
    static onPreCull	Event that is fired before any camera starts culling.
    static onPreRender	Event that is fired before any camera starts rendering.
    */

    // [ Public Variables ]

    /*
    activeTexture	Gets or sets the temporary RenderTexture target for this Camera.
    actualRenderingPath	The rendering path that is currently being used (Read Only).
    allowHDR	High dynamic range rendering.
    allowMSAA	MSAA rendering.
    areVRStereoViewMatricesWithinSingleCullTolerance	Determines whether the stereo view matrices are suitable to allow for a single pass cull.
    aspect	The aspect ratio (width divided by height).
    backgroundColor	The color with which the screen will be cleared.
    cameraToWorldMatrix	Matrix that transforms from camera space to world space (Read Only).
    cameraType	Identifies what kind of camera this is.
    clearFlags	How the camera clears the background.
    clearStencilAfterLightingPass	Should the camera clear the stencil buffer after the deferred light pass?
    commandBufferCount	Number of command buffers set up on this camera (Read Only).
    */
    /**
     * get GL.Camera
     *
     * @readonly
     * @type {GL.Camera}
     * @memberof Camera
     */
    core : GL.Camera;
    /*
    cullingMask	This is used to render parts of the scene selectively.
    cullingMatrix	Sets a custom matrix for the camera to use for all culling queries.
    depth	Camera's depth in the camera rendering order.
    depthTextureMode	How and if camera generates a depth texture.
    eventMask	Mask to select which layers can trigger events on the camera.
    farClipPlane	The far clipping plane distance.
    fieldOfView	The field of view of the camera in degrees.
    forceIntoRenderTexture	Should camera rendering be forced into a RenderTexture.
    layerCullDistances	Per-layer culling distances.
    layerCullSpherical	How to perform per-layer culling for a Camera.
    nearClipPlane	The near clipping plane distance.
    nonJitteredProjectionMatrix	Get or set the raw projection matrix with no camera offset (no jittering).
    opaqueSortMode	Opaque object sorting mode.
    orthographic	Is the camera orthographic (true) or perspective (false)?
    orthographicSize	Camera's half-size when in orthographic mode.
    pixelHeight	How tall is the camera in pixels (Read Only).
    pixelRect	Where on the screen is the camera rendered in pixel coordinates.
    pixelWidth	How wide is the camera in pixels (Read Only).
    projectionMatrix	Set a custom projection matrix.
    rect	Where on the screen is the camera rendered in normalized coordinates.
    renderingPath	The rendering path that should be used, if possible.
    scene	If not null, the camera will only render the contents of the specified scene.
    stereoActiveEye	Returns the eye that is currently rendering. If called when stereo is not enabled it will return Camera.MonoOrStereoscopicEye.Mono. If called during a camera rendering callback such as OnRenderImage it will return the currently rendering eye. If called outside of a rendering callback and stereo is enabled, it will return the default eye which is Camera.MonoOrStereoscopicEye.Left.
    stereoConvergence	Distance to a point where virtual eyes converge.
    stereoEnabled	Stereoscopic rendering.
    stereoMirrorMode	Render only once and use resulting image for both eyes.
    stereoSeparation	The distance between the virtual eyes. Use this to query or set the current eye separation. Note that most VR devices provide this value, in which case setting the value will have no effect.
    stereoTargetEye	Defines which eye of a VR display the Camera renders into.
    targetDisplay	Set the target display for this Camera.
    targetTexture	Destination render texture.
    transparencySortAxis	An axis that describes the direction along which the distances of objects are measured for the purpose of sorting.
    transparencySortMode	Transparent object sorting mode.
    useJitteredProjectionMatrixForTransparentRendering	Should the jittered matrix be used for transparency rendering?
    useOcclusionCulling	Whether or not the Camera will use occlusion culling during rendering.
    velocity	Get the world-space speed of the camera (Read Only).
    worldToCameraMatrix	Matrix that transforms from world to camera space.
    */

    // [ Public Static Functions ]

    /*
    GetAllCameras	Fills an array of Camera with the current cameras in the scene, without allocating a new array.
    */

    // [ Public Functions ]

    /*
    AddCommandBuffer	Add a command buffer to be executed at a specified place.
    CalculateFrustumCorners	Given viewport coordinates, calculates the view space vectors pointing to the four frustum corners at the specified camera depth.
    CalculateObliqueMatrix	Calculates and returns oblique near-plane projection matrix.
    CopyFrom	Makes this camera's settings match other camera.
    GetCommandBuffers	Get command buffers to be executed at a specified place.
    GetStereoProjectionMatrix	Gets the projection matrix of a specific left or right stereoscopic eye.
    GetStereoViewMatrix	Gets the left or right view matrix of a specific stereoscopic eye.
    RemoveAllCommandBuffers	Remove all command buffers set on this camera.
    RemoveCommandBuffer	Remove command buffer from execution at a specified place.
    RemoveCommandBuffers	Remove command buffers from execution at a specified place.
    Render	Render the camera manually.
    RenderToCubemap	Render into a static cubemap from this camera.
    RenderWithShader	Render the camera with shader replacement.
    ResetAspect	Revert the aspect ratio to the screen's aspect ratio.
    ResetCullingMatrix	Make culling queries reflect the camera's built in parameters.
    ResetProjectionMatrix	Make the projection reflect normal camera's parameters.
    ResetReplacementShader	Remove shader replacement from camera.
    ResetStereoProjectionMatrices	Reset the camera to using the Unity computed projection matrices for all stereoscopic eyes.
    ResetStereoViewMatrices	Reset the camera to using the Unity computed view matrices for all stereoscopic eyes.
    ResetTransparencySortSettings	Resets this Camera's transparency sort settings to the default. Default transparency settings are taken from GraphicsSettings instead of directly from this Camera.
    ResetWorldToCameraMatrix	Make the rendering position reflect the camera's position in the scene.
    ScreenPointToRay	Returns a ray going from camera through a screen point.
    ScreenToViewportPoint	Transforms position from screen space into viewport space.
    ScreenToWorldPoint	Transforms position from screen space into world space.
    SetReplacementShader	Make the camera render with shader replacement.
    SetStereoProjectionMatrix	Sets a custom projection matrix for a specific stereoscopic eye.
    SetStereoViewMatrix	Sets a custom view matrix for a specific stereoscopic eye.
    SetTargetBuffers	Sets the Camera to render to the chosen buffers of one or more RenderTextures.
    ViewportPointToRay	Returns a ray going from camera through a viewport point.
    ViewportToScreenPoint	Transforms position from viewport space into screen space.
    ViewportToWorldPoint	Transforms position from viewport space into world space.
    WorldToScreenPoint	Transforms position from world space into screen space.
    WorldToViewportPoint	Transforms position from world space into viewport space.
    */

    // [ Public Messages ]

    /*
    OnPostRender	OnPostRender is called after a camera has finished rendering the scene.
    OnPreCull	OnPreCull is called before a camera culls the scene.
    OnPreRender	OnPreRender is called before a camera starts rendering the scene.
    OnRenderImage	OnRenderImage is called after all rendering is complete to render image.
    OnRenderObject	OnRenderObject is called after camera has rendered the scene.
    OnWillRenderObject	OnWillRenderObject is called for each camera if the object is visible.
    */
}

/**
 * GameObject
 *
 * @export
 * @interface GameObject
 */
export interface GameObject {
    /*
    activeInHierarchy	Is the GameObject active in the scene?
    activeSelf	The local active state of this GameObject. (Read Only)
    isStatic	Editor only API that specifies if a game object is static.
    layer	The layer the game object is in. A layer is in the range [0...31].
    */
    /**
     * Scene that the GameObject is part of.
     *
     * @readonly
     * @type {Scene}
     * @memberof GameObject
     */
    scene : Scene;
    /*
    tag	The tag of this game object.
    */
    /**
     * The Transform attached to this GameObject.
     *
     * @type {Transform}
     * @memberof GameObject
     */
    transform : Transform;


    /**
     * The name of the object.
     *
     * @readonly
     * @type {string}
     * @memberof GameObject
     */
    name : string;

    /**
     * get core object
     *
     * @readonly
     * @type {GL.Object3D}
     * @memberof GameObject
     */
    core : GL.Object3D;

    // [ Public Functions ]

    /**
     * Adds a component class of componentType to the game object.
     *
     * @template T
     * @param {ComponentType<T>} type
     * @returns {T}
     * @memberof GameObject
     */
    addComponent<T extends Component>( type:ComponentType<T> ) : T;
    /**
     * Adds a component class of componentName to the game object.
     *
     * @param {string} componentName
     * @returns {Component}
     * @memberof GameObject
     */
    addComponentByName( componentName:string ) : Component;
    /*
    BroadcastMessage	Calls the method named methodName on every MonoBehaviour in this game object or any of its children.
    CompareTag	Is this game object tagged with tag ?
    */
    /**
     * Returns the component of Type type if the game object has one attached, null if it doesn't.
     *
     * @template T
     * @param {ComponentType<T>} type
     * @returns {T}
     * @memberof GameObject
     */
    getComponent<T extends Component>( type:ComponentType<T> ) : T|undefined;
    /**
     * Returns the component of string name if the game object has one attached, null if it doesn't.
     *
     * @param {string} componentName
     * @returns {(Component|undefined)}
     * @memberof GameObject
     */
    getComponentByName( componentName:string ) : Component|undefined;
    /*
    GetComponentInChildren	Returns the component of Type type in the GameObject or any of its children using depth first search.
    GetComponentInParent	Returns the component of Type type in the GameObject or any of its parents.
    GetComponents	Returns all components of Type type in the GameObject.
    GetComponentsInChildren	Returns all components of Type type in the GameObject or any of its children.
    GetComponentsInParent	Returns all components of Type type in the GameObject or any of its parents.
    */
    /**
     * Remove a component.
     *
     * @param {Component} component
     * @memberof GameObject
     */
    removeComponent ( component:Component );
    removeComponentByName ( componentName:string );
    /*
    SendMessage	Calls the method named methodName on every MonoBehaviour in this game object.
    SendMessageUpwards	Calls the method named methodName on every MonoBehaviour in this game object and on every ancestor of the behaviour.
    SetActive	Activates/Deactivates the GameObject.
    */

   /**
     * to JSON
     *
     * @returns {*}
     * @memberof GameObject
     */
    toJSON ( meta?:any ) : any;
    fromJSON ( meta:any );
    /**
     * serialize
     *
     * @param {*} meta
     * @returns {*}
     * @memberof GameObject
     */
    serialize (meta:any) : any;
}


/**
 * Component
 *
 * @export
 * @interface Component
 */
export interface Component {
    /**
     * get GL.Object3D
     *
     * @readonly
     * @type {GL.Object3D}
     * @memberof Component
     */
    core : GL.Object3D;
    /**
     * The game object this component is attached to. A component is always attached to a game object.
     *
     * @type {GameObject}
     * @memberof Component
     */
    gameObject : GameObject;
    /*
    tag	The tag of this game object.
    */

    // [ Public Functions ]

    /*
    BroadcastMessage	Calls the method named methodName on every MonoBehaviour in this game object or any of its children.
    CompareTag	Is this game object tagged with tag ?
    */
    getComponent<T extends Component>( type:ComponentType<T> ) : T|undefined;
    //	Returns the component of Type type if the game object has one attached, null if it doesn't.
    /*
    GetComponentInChildren	Returns the component of Type type in the GameObject or any of its children using depth first search.
    GetComponentInParent	Returns the component of Type type in the GameObject or any of its parents.
    GetComponents	Returns all components of Type type in the GameObject.
    GetComponentsInChildren	Returns all components of Type type in the GameObject or any of its children.
    GetComponentsInParent	Returns all components of Type type in the GameObject or any of its parents.
    SendMessage	Calls the method named methodName on every MonoBehaviour in this game object.
    SendMessageUpwards	Calls the method named methodName on every MonoBehaviour in this game object and on every ancestor of the behaviour.
    */

}

/**
 * Component type
 *
 * @export
 * @interface ComponentType
 * @template T
 */
export interface ComponentType<T> {
    new(gameObject:GameObject):T;
}

/**
 * Mesh
 *
 * @export
 * @interface Mesh
 */
export interface Mesh {
}

/**
 * MeshFilter
 *
 * @export
 * @interface MeshFilter
 */
export interface MeshFilter {
    core        : GL.Mesh;
    mesh        : Mesh;
    sharedMesh  : Mesh;
}

/**
 * MeshRenderer
 *
 * @export
 * @interface MeshRenderer
 */
export interface MeshRenderer {
    core        : GL.Mesh;
}

/**
 * Scene
 *
 * @export
 * @interface Scene
 */
export interface Scene {
    /*
    buildIndex	Returns the index of the scene in the Build Settings. Always returns -1 if the scene was loaded through an AssetBundle.
    isDirty	Returns true if the scene is modifed.
    isLoaded	Returns true if the scene is loaded.
    */
    /**
     * Returns the name of the scene.
     *
     * @type {string}
     * @memberof Scene
     */
    name () : string;
    /*
    path	Returns the relative path of the scene. Like: "Assets/MyScenes/MyScene.unity".
    */
    /**
     * The number of root transforms of this scene.
     *
     * @readonly
     * @type {number}
     * @memberof Scene
     */
    rootCount () : number;

    /**
     * get GL.Scene
     *
     * @readonly
     * @type {GL.Scene}
     * @memberof Scene
     */
    core() : GL.Scene;

    // [ Public Functions ]

    /**
     * add Object
     *
     * @param {GL.Object3D} object
     * @memberof Scene
     */
    add( object:GL.Object3D );
    /**
     * remove object
     *
     * @param {GL.Object3D} object
     * @memberof Scene
     */
    remove ( object:GL.Object3D );
    /**
     * to JSON
     *
     * @param {*} [meta]
     * @returns {*}
     * @memberof Scene
     */
    toJSON ( meta:any ) : any;
    /**
     * from JSON
     *
     * @param {*} meta
     * @memberof Scene
     */
    fromJSON ( meta:any );

    /**
     * Returns all the root objects in the scene.
     *
     * @returns {GL.Object3D[]}
     * @memberof Scene
     */
    getRootObjects () : GL.Object3D[];
}

/**
 * Transform
 *
 * @export
 * @interface Transform
 * @extends {Component}
 */
export interface Transform extends Component {

    /**
     * get Object3D
     *
     * @readonly
     * @type {GL.Object3D}
     * @memberof Transform
     */
    core : GL.Object3D;
    /*
    childCount	The number of children the Transform has.
    */
    /**
     * The rotation as Euler angles in degrees.
     *
     * @type {Vector3}
     * @memberof Transform
     */
    eulerAngles : Vector3;
    /*
    forward	The blue axis of the transform in world space.
    hasChanged	Has the transform changed since the last time the flag was set to 'false'?
    hierarchyCapacity	The transform capacity of the transform's hierarchy data structure.
    hierarchyCount	The number of transforms in the transform's hierarchy data structure.
    */
    /**
     * The rotation as Euler angles in degrees relative to the parent transform's rotation.
     *
     * @type {Vector3}
     * @memberof Transform
     */
    localEulerAngles : Vector3;
    /**
     * Position of the transform relative to the parent transform.
     *
     * @type {Vector3}
     * @memberof Transform
     */
    localPosition : Vector3;
    /**
     * The rotation of the transform relative to the parent transform's rotation.
     *
     * @type {Quaternion}
     * @memberof Transform
     */
    localRotation : Quaternion;
    /**
     * The scale of the transform relative to the parent.
     *
     * @readonly
     * @type {Vector3}
     * @memberof Transform
     */
    localScale : Vector3;

    /**
     * Matrix that transforms a point from local space into world space (Read Only).
     *
     * @readonly
     * @type {Matrix4x4}
     * @memberof Transform
     */
    localToWorldMatrix : Matrix4x4;
    /**
     * The global scale of the object (Read Only).
     *
     * @type {Vector3}
     * @memberof Transform
     */
    lossyScale : Vector3;
    /*
    parent	The parent of the transform.
    */
    /**
     * The position of the transform in world space.
     *
     * @readonly
     * @type {Vector3}
     * @memberof Transform
     */
    position : Vector3;
    /*
    right	The red axis of the transform in world space.
    root	Returns the topmost transform in the hierarchy.
    */
    /**
     * The rotation of the transform in world space stored as a Quaternion.
     *
     * @readonly
     * @type {Quaternion}
     * @memberof Transform
     */
    rotation : Quaternion;
    /*
    up	The green axis of the transform in world space.
    */
    /**
     * Matrix that transforms a point from world space into local space (Read Only).
     *
     * @readonly
     * @type {Matrix4x4}
     * @memberof Transform
     */
    worldToLocalMatrix : Matrix4x4;

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
    /**
     * Rotates the transform so the forward vector points at /target/'s current position.
     *
     * @param {Transform} traget
     * @param {Vector3} [worldUp=Vector3.up]
     *
     * @memberof Transform
     */
    lookAt( traget:Transform, worldUp:Vector3 );
    lookAt2( traget:Vector3 );

    /*
    Rotate	Applies a rotation of eulerAngles.z degrees around the z axis, eulerAngles.x degrees around the x axis, and eulerAngles.y degrees around the y axis (in that order).
    RotateAround	Rotates the transform about axis passing through point in world coordinates by angle degrees.
    SetAsFirstSibling	Move the transform to the start of the local transform list.
    SetAsLastSibling	Move the transform to the end of the local transform list.
    SetParent	Set the parent of the transform.
    SetPositionAndRotation	Sets the world space position and rotation of the Transform component.
    SetSiblingIndex	Sets the sibling index.
    TransformDirection	Transforms direction from local space to world space.
    TransformPoint	Transforms position from local space to world space.
    TransformVector	Transforms vector from local space to world space.
    Translate	Moves the transform in the direction and distance of translation.
    */
}

export interface Ubject {
    /*
    hideFlags	Should the object be hidden, saved with the scene or modifiable by the user?
    */

    /**
     * The name of the object.
     *
     * @readonly
     * @type {string}
     * @memberof Ubject
     */
    name : string;
    /**
     * uuid
     *
     * @readonly
     * @type {string}
     * @memberof Ubject
     */
    uuid : string;
    /**
     * Returns the instance id of the object.
     *
     * @returns {number}
     * @memberof Ubject
     */
    getInstanceID () : number;

    /**
     * Returns the name of the game object.
     *
     * @returns {string}
     * @memberof Ubject
     */
    toString () : string;

    // [ Public Static Functions ]

    /*
    static Destroy ( object:Ubject, delay:number=0 ) Removes a gameobject, component or asset.
    static DestroyImmediate	Destroys the object obj immediately. You are strongly recommended to use Destroy instead.
    static DontDestroyOnLoad	Makes the object target not be destroyed automatically when loading a new scene.
    static FindObjectOfType	Returns the first active loaded object of Type type.
    static FindObjectsOfType	Returns a list of all active loaded objects of Type type.
    */


    // [ Public Operators ]

    /*
    bool	Does the object exist?
    operator !=	Compares if two objects refer to a different object.
    operator ==	Compares two object references to see if they refer to the same object.
    */

}
