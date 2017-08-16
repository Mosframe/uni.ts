/**
 * Light.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';
import { GL             }   from './Graphic';
import { Behaviour      }   from './Behaviour';
import { GameObject     }   from './GameObject';
import { LightType      }   from './LightType';
import { Serializable   }   from './Serializable';
import { Ubject         }   from '../Engine/Ubject';

/**
 * Script interface for light components.
 *
 * Use this to control all aspects of Uni.ts's lights. The properties are an exact match for the values shown in the Inspector.
 *
 * @export
 * @class Light
 * @extends {Behaviour}
 */
export class Light extends Behaviour {

    // [ Public Variables ]

    /*
    areaSize	The size of the area light.
    bounceIntensity	The multiplier that defines the strength of the bounce lighting.
    color	The color of the light.
    colorTemperature	The color temperature of the light. Correlated Color Temperature (abbreviated as CCT) is multiplied with the color filter when calculating the final color of a light source. The color temperature of the electromagnetic radiation emitted from an ideal black body is defined as its surface temperature in Kelvin. White is 6500K according to the D65 standard. Candle light is 1800K. If you want to use lightsUseCCT, lightsUseLinearIntensity has to be enabled to ensure physically correct output. See Also: GraphicsSettings.lightsUseLinearIntensity, GraphicsSettings.lightsUseCCT.
    commandBufferCount	Number of command buffers set up on this light (Read Only).
    cookie	The cookie texture projected by the light.
    cookieSize	The size of a directional light's cookie.
    */
    /**
     * get GL.Light
     *
     * @readonly
     * @type {GL.Light}
     * @memberof Light
     */
    get core() : GL.Light { return <GL.Light>this.gameObject.core; }
    /*
    cullingMask	This is used to light certain objects in the scene selectively.
    flare	The flare asset to use for this light.
    intensity	The Intensity of a light is multiplied with the Light color.
    isBaked	Is the light contribution already stored in lightmaps and/or lightprobes (Read Only).
    lightmapBakeType	This property describes what part of a light's contribution can be baked.
    range	The range of the light.
    renderMode	How to render the light.
    shadowBias	Shadow mapping constant bias.
    shadowCustomResolution	The custom resolution of the shadow map.
    shadowNearPlane	Near plane value to use for shadow frustums.
    shadowNormalBias	Shadow mapping normal-based bias.
    shadowResolution	The resolution of the shadow map.
    shadows	How this light casts shadows
    shadowStrength	Strength of light's shadows.
    spotAngle	The angle of the light's spotlight cone in degrees.
    */
    /**
     * The type of the light.
     *
     * @type {LightType}
     * @memberof Light
     */
    get type () : LightType         { return this._type; }
    set type ( value : LightType )  { this._type = value; this._onChanged(); }

    // [ Public Functions ]

    /*
    AddCommandBuffer	Add a command buffer to be executed at a specified place.
    GetCommandBuffers	Get command buffers to be executed at a specified place.
    RemoveAllCommandBuffers	Remove all command buffers set on this light.
    RemoveCommandBuffer	Remove command buffer from execution at a specified place.
    RemoveCommandBuffers	Remove command buffers from execution at a specified place.
    */


    // [ Constructors ]

    /**
     * Creates an instance of Light.
     * @memberof Light
     */
    constructor() {
        super();
        this.type = LightType.Point;
    }

    // [ Protected Virtual ]

    //@Serializable
    protected _type : LightType;

    // [ Protected Functions ]

    protected _onChanged () {
        if ( this.gameObject !== undefined ) {

            switch(this.type) {

            case LightType.Spot: {
                    let color       = 0xffffff;
                    let intensity   = 1.0;
                    let distance    = 0.0;
                    let angle       = Math.PI * 0.1;
                    let exponent    = 10.0;
                    let light = new GL.SpotLight ( color, intensity, distance, angle, exponent );
                    light.target.name = light.name + ' Target';
                    light.position.set(5, 10, 7.5);
                    light.castShadow = true;
                    this._gameObject.core = light;
                }
                break;
            case LightType.Directional: {
                    let color       = 0xffffff;
                    let intensity   = 1.0;
                    let light = new GL.DirectionalLight ( color, intensity );
                    light.target.name = light.name + ' Target';
                    light.position.set(5, 10, 7.5);
                    light.castShadow = true;
                    this._gameObject.core = light;
                }
                break;
            case LightType.Area:
                console.warn("not suport Area Light");
            case LightType.Point: {
                    let color       = 0xffffff;
                    let intensity   = 1.0;
                    let distance    = 0.0;
                    let light = new GL.PointLight ( color, intensity, distance );
                    light.castShadow = true;
                    this._gameObject.core = light;
                }
                break;
            case LightType.Hemisphere: {
                    let skyColor    = 0x00aaff;
                    let groundColor = 0xffaa00;
                    let intensity   = 1.0;
                    let light = new GL.HemisphereLight ( skyColor, groundColor, intensity );
                    light.position.set( 0, 10, 0 );
                    this._gameObject.core = light;
                }
                break;
            case LightType.Ambient: {
                    let color = 0x222222;
                    let light = new GL.AmbientLight ( color );
                    light.position.set( 0, 20, 0 );
                    this._gameObject.core = light;
                }
                break;
            }
        }
    }
}
UnitsEngine[Light.name] = Light;
