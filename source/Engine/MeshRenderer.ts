/**
 * MeshRenderer.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import * as GL              from '../Engine/Graphic';
import { GameObject     }   from './GameObject';
import { Geometry       }   from './Geometry';
import { Material       }   from './Material';
import { Mesh           }   from './Mesh';
import { MeshFilter     }   from './MeshFilter';
import { Renderer       }   from './Renderer';
import { ShaderType     }   from './ShaderType';

/**
 * Renders meshes inserted by the MeshFilter or TextMesh.
 *
 * @export
 * @class MeshRenderer
 * @extends {Renderer}
 */
export class MeshRenderer extends Renderer {

    // [ Public Variables ]

    get core() : GL.Mesh { return <GL.Mesh>this.gameObject.core; }

    /*
    additionalVertexStreams	Vertex attributes in this mesh will override or add attributes of the primary mesh in the MeshRenderer.
    */
}
window['units'][MeshRenderer.name]=MeshRenderer;
