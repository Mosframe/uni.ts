/**
 * MeshLambertMaterial.ts
 *
 * @author mosframe / https://github.com/mosframe
 *
 */

import { UnitsEngine    }   from './UnitsEngine';
import { THREE          }   from './Core';
import { Material       }   from './Material';
import { Color          }   from './Color';
import { ShaderType     }   from './ShaderType';
import { Ubject         }   from './Ubject';

/**
 * The MeshLambertMaterial class.
 *
 * @export
 * @class MeshLambertMaterial
 * @extends {Material}
 */
export class MeshLambertMaterial extends Material {

    // [ Public Variables ]

    /**
     * get GL.Material
     *
     * @readonly
     *
     * @memberof Material
     */
    get core() : THREE.MeshLambertMaterial { return <THREE.MeshLambertMaterial>this._core; }

    /**
     * The main material's color.
     *
     * @readonly
     * @type {Color}
     * @memberof MeshLambertMaterial
     */
    get color() : Color         { return <Color>this.core.color; }
    set color( value:Color )    { this.core.color = value; }
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

    // [ Protected Functions ]
    protected create() {
        this._core = new THREE.MeshLambertMaterial({color:0xffffff});
    }

    // [ Protected Static Functions ]
}
UnitsEngine[MeshLambertMaterial.name] = MeshLambertMaterial;
