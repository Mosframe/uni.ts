import * as GL        from '../Engine/Graphic';
import {GameObject  } from '../Engine/GameObject';
import {Geometry    } from '../Engine/Geometry';
import {Material    } from '../Engine/Material';
import {Mesh        } from '../Engine/Mesh';
import {MeshFilter  } from '../Engine/MeshFilter';
import {Renderer    } from '../Engine/Renderer';
import {ShaderType  } from '../Engine/ShaderType';
/**
 * Renders meshes inserted by the MeshFilter or TextMesh.
 *
 * @author mosframe / https://github.com/mosframe
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

    // [ Constructors ]

    // [ Public Functions ]

    // [ Public Static Variables ]

    // [ Public Static Functions ]

    // [ Public Operators ]

    // [ Public Events ]

    // [ Public Messages ]

    // [ Protected Variables ]

    // [ Protected Functions ]

    // [ Protected Static Variables ]

    // [ Protected Static Functions ]
}
