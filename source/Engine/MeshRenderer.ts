/**
 * MeshRenderer.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';
import { THREE          }   from './Core';
import { GameObject     }   from './GameObject';
import { Geometry       }   from './Geometry';
import { Material       }   from './Material';
import { Mesh           }   from './Mesh';
import { MeshFilter     }   from './MeshFilter';
import { Renderer       }   from './Renderer';
import { ShaderType     }   from './ShaderType';
import { Ubject         }   from './Ubject';

/**
 * Renders meshes inserted by the MeshFilter or TextMesh.
 *
 * @export
 * @class MeshRenderer
 * @extends {Renderer}
 */
export class MeshRenderer extends Renderer {

    // [ Public Variables ]

    get core() : THREE.Mesh { return <THREE.Mesh>this.gameObject.core; }

    /*
    additionalVertexStreams	Vertex attributes in this mesh will override or add attributes of the primary mesh in the MeshRenderer.
    */
}
UnitsEngine[MeshRenderer.name] = MeshRenderer;
