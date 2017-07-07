import * as GL        from '../UnitsEngine/Graphic';
import {GameObject  } from '../UnitsEngine/GameObject';
import {Geometry    } from '../UnitsEngine/Geometry';
import {Material    } from '../UnitsEngine/Material';
import {Mesh        } from '../UnitsEngine/Mesh';
import {MeshFilter  } from '../UnitsEngine/MeshFilter';
import {Renderer    } from '../UnitsEngine/Renderer';
import {ShaderType  } from '../UnitsEngine/ShaderType';
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
