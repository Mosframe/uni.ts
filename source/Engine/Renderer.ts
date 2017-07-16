import * as GL                      from './Graphic';
import { Component              }   from './Component';
import { GameObject             }   from './GameObject';
import { Material               }   from './Material';
import { MeshLambertMaterial    }   from './MeshLambertMaterial';
import { MeshFilter             }   from './MeshFilter';
import { ShadowCastingMode      }   from './Rendering/ShadowCastingMode';
import { ShaderType             }   from './ShaderType';


/**
 * General functionality for all renderers.
 * A renderer is what makes an object appear on the screen.
 * Use this class to access the renderer of any object, mesh or particle system.
 * Renderers can be disabled to make objects invisible (see enabled), and the materials can be accessed and modified through them (see material).
 *
 * @author mosframe / https://github.com/mosframe
 *
 * @export
 * @class Renderer
 * @extends {Component}
 */
export class Renderer extends Component {

    // [ Public Variables ]

    get core() : GL.Mesh { return <GL.Mesh>this.gameObject.core; }

    /*
    bounds	The bounding volume of the renderer (Read Only).
    enabled	Makes the rendered 3D object visible if enabled.
    isPartOfStaticBatch	Has this renderer been statically batched with any other renderers?
    isVisible	Is this renderer visible in any camera? (Read Only)
    lightmapIndex	The index of the baked lightmap applied to this renderer.
    lightmapScaleOffset	The UV scale & offset used for a lightmap.
    lightProbeProxyVolumeOverride	If set, the Renderer will use the Light Probe Proxy Volume component attached to the source GameObject.
    lightProbeUsage	The light probe interpolation type.
    localToWorldMatrix	Matrix that transforms a point from local space into world space (Read Only).
    */
    /**
     * Returns the first instantiated Material assigned to the renderer.
     * Modifying material will change the material for this object only.
     * If the material is used by any other renderers, this will clone the shared material and start using it from now on.
     *
     * @type {Material}
     * @memberof Renderer
     */
    get material () : Material      { return <Material>Component.instantiate( this.sharedMaterial ); }
    set material ( value:Material ) { this.sharedMaterial = <Material>Component.instantiate(value); }
    /**
     * Returns all the instantiated materials of this object.
     *
     * @type {Material[]}
     * @memberof Renderer
     */
    get materials () : Material[] {
        let materials = new Material[this.sharedMaterials.length];
        for( let c=0; c<materials.length; ++c ) {
            materials[c] = <Material>Component.instantiate( this.sharedMaterial[c] );
        }
        return materials;
    }
    set materials ( value:Material[] ) {
        if( value && value.length>0 && value[0] ) {
            let materials = new Material[value.length];
            for( let c=0; c<materials.length; ++c ) {
                materials[c] = <Material>Component.instantiate( this.sharedMaterial[c] );
            }
            this.sharedMaterials = materials;
        }
    }
    /*
    motionVectorGenerationMode	Specifies the mode for motion vector rendering.
    probeAnchor	If set, Renderer will use this Transform's position to find the light or reflection probe.
    realtimeLightmapIndex	The index of the realtime lightmap applied to this renderer.
    realtimeLightmapScaleOffset	The UV scale & offset used for a realtime lightmap.
    */
    /**
     * Does this object receive shadows?
     *
     * @readonly
     * @type {boolean}
     * @memberof Renderer
     */
    get receiveShadows() : boolean      { return this.core.receiveShadow; }
    set receiveShadows( value:boolean ) { this.core.receiveShadow = value; }
    /*
    reflectionProbeUsage	Should reflection probes be used for this Renderer?
    */
    /**
     * Does this object cast shadows?
     *
     * @readonly
     * @type {ShadowCastingMode}
     * @memberof Renderer
     */
    get shadowCastingMode() : ShadowCastingMode      { return this._shadowCastingMode; }
    set shadowCastingMode( value:ShadowCastingMode ) {
        this._shadowCastingMode = value;
        this.core.castShadow = (value !== ShadowCastingMode.off);
        // TODO : Light 타입에 따라서 그림자 모드를 설정해야 한다.
    }


    /**
     * The shared material of this object.
     *
     * @type {Material}
     * @memberof Renderer
     */
    get sharedMaterial () : Material        { return this.sharedMaterials[0]; }
    set sharedMaterial ( value:Material )   { this.sharedMaterials[0] = value; }
    /**
     * All the shared materials of this object.
     *
     * @type {Material[]}
     * @memberof Renderer
     */
    get sharedMaterials () : Material[] {
        this._sharedMaterials
        return this._sharedMaterials;
    }
    set sharedMaterials ( value:Material[] ) {
        if( value && value.length>0 && value[0] ) {
            this._sharedMaterials = value;
            this._onChanged();
        }
    }
    /*
    sortingLayerID	Unique ID of the Renderer's sorting layer.
    sortingLayerName	Name of the Renderer's sorting layer.
    sortingOrder	Renderer's order within a sorting layer.
    worldToLocalMatrix	Matrix that transforms a point from world space into local space (Read Only).
    */

    // [ Constructors ]

    /**
     * Creates an instance of Renderer.
     * @param {GameObject} gameObject
     *
     * @memberof Renderer
     */
    constructor( gameObject:GameObject ) {
        super(gameObject);

        //let meshFilter = this.gameObject.getComponent( MeshFilter );

        this._sharedMaterials = [];
        this._sharedMaterials.push( new MeshLambertMaterial() );
        this._onChanged();
    }

    // [ Public Functions ]

    /*
    GetClosestReflectionProbes	Returns an array of closest reflection probes with weights, weight shows how much influence the probe has on the renderer, this value is also used when blending between reflection probes occur.
    GetPropertyBlock	Get per-renderer material property block.
    SetPropertyBlock	Lets you add per-renderer material parameters without duplicating a material.
    */

    // [ Public Static Variables ]

    // [ Public Static Functions ]

    // [ Public Operators ]

    // [ Public Events ]

    // [ Public Messages ]

    /*
    OnBecameInvisible	OnBecameInvisible is called when the object is no longer visible by any camera.
    OnBecameVisible	OnBecameVisible is called when the object became visible by any camera.
    */

    // [ Private Variables ]

    private _shadowCastingMode  : ShadowCastingMode;
    private _sharedMaterials    : Material[] = [];


    // [ Protected Functions ]

    protected _onChanged () {

        let meshFilter = this.gameObject.getComponent( MeshFilter );
        if( meshFilter ) {
            meshFilter.core.material = this.sharedMaterial.core;
        }
    }
}
window['units'][Renderer.name]=Renderer;
