/**
 * Materials.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';
import { THREE          }   from './Core';
import { Color          }   from './Color';
import { ShaderType     }   from './ShaderType';
import { Serializable   }   from './Serializable';
import { Ubject         }   from './Ubject';

/**
 * The material class.
 * This class exposes all properties from a material, allowing you to animate them.
 * You can also use it to set custom shader properties that can't be accessed through the inspector (e.g. matrices).
 *
 * In order to get the material used by an object, use the Renderer.material property.
 *
 * @author mosframe / https://github.com/mosframe
 *
 * @export
 * @class Material
 * @extends {Ubject}
 * @implements {IMaterial}
 */
export class Material extends Ubject {

    // [ Public Variables ]

    /**
     * get GL.Material
     *
     * @readonly
     *
     * @memberof Material
     */
    get core() : THREE.Material { return this._core; }

    /**
     * The main material's color.
     *
     * @readonly
     * @type {Color}
     * @memberof Material
     */
    get color() : Color         { return Color.black; }
    set color( value:Color )    {}
    /*
    enableInstancing	Gets and sets whether GPU instancing is enabled for this material.
    globalIlluminationFlags	Defines how the material should interact with lightmaps and lightprobes.
    mainTexture	The material's texture.
    mainTextureOffset	The texture offset of the main texture.
    mainTextureScale	The texture scale of the main texture.
    passCount	How many passes are in this material (Read Only).
    renderQueue	Render queue of this material.
    shader	The shader used by the material.
    shaderKeywords	Additional shader keywords set by this material.
    */

    // [ Constructors ]

    /**
     * Creates an instance of Material.
     *
     * @memberof Material
     */
    constructor() {
        super();
        this.create();
    }

    // [ Protected Variables ]

    //@Serializable
    protected _core : THREE.Material;

    // [ Protected Functions ]

    protected create() {
        this._core = new THREE.Material();
    }
}
UnitsEngine[Material.name] = Material;
