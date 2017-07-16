import * as GL              from '../Engine/Graphic';
import { PrimitiveType  }   from '../Engine/PrimitiveType';
import { Ubject         }   from '../Engine/Ubject';
/**
 * Geometry
 *
 * @author mosframe / https://github.com/mosframe
 *
 * @export
 * @class Geometry
 * @extends {Ubject}
 */
export class Geometry {

    // [ Public Variables ]

    /**
     * get core geometry
     *
     * @readonly
     * @type {(GL.Geometry|GL.BufferGeometry)}
     * @memberof Geometry
     */
    get core () : GL.Geometry|GL.BufferGeometry       {return this._core; }
    set core (value:GL.Geometry|GL.BufferGeometry )   {this._core=value;}

    // [ Constructors ]

    /**
     * Creates an instance of Geometry.
     * @param {PrimitiveType} [type]
     *
     * @memberof Geometry
     */
    constructor( type?:PrimitiveType ) {
        switch( type ) {
            case PrimitiveType.quad: {
                    this._core = new GL.PlaneGeometry( 1, 1, 1, 1 );
                }
                break;
            case PrimitiveType.plane: {
                    this._core = new GL.PlaneGeometry( 10, 10, 10, 10 );
                }
                break;
            case PrimitiveType.cube: {
                    this._core = new GL.CubeGeometry( 1, 1, 1, 1, 1, 1 );
                }
                break;
            case PrimitiveType.sphere: {
                    let radius          = 1;
                    let widthSegments   = 32;
                    let heightSegments  = 16;
                    let phiStart        = 0;
                    let phiLength       = Math.PI * 2;
                    let thetaStart      = 0;
                    let thetaLength     = Math.PI;
                    this._core = new GL.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
                }
                break;
            case PrimitiveType.cylinder: {
                    let radiusTop       = 1;
                    let radiusBottom    = 1;
                    let height          = 2;
                    let radiusSegments  = 32;
                    let heightSegments  = 1;
                    let openEnded       = false;
                    this._core = new GL.CylinderGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
                }
                break;
            case PrimitiveType.circle: {
                    this._core = new GL.CircleGeometry( 1, 32 );
                }
                break;
            case PrimitiveType.icosahedron: {
                    this._core = new GL.IcosahedronGeometry( 1, 2 );
                }
                break;
            case PrimitiveType.torus: {
                    let radius          = 2;
                    let tube            = 1;
                    let radialSegments  = 32;
                    let tubularSegments = 12;
                    let arc             = Math.PI * 2;
                    this._core = new GL.TorusGeometry( radius, tube, radialSegments, tubularSegments, arc );
                }
                break;
            case PrimitiveType.torusKnot: {
                    let radius          = 2;
                    let tube            = 0.8;
                    let radialSegments  = 64;
                    let tubularSegments = 12;
                    let p               = 2;
                    let q               = 3;
                    this._core = new GL.TorusKnotGeometry( radius, tube, radialSegments, tubularSegments, p, q );
                }
                break;
            case PrimitiveType.lathe: {
                    let points = [
                        new GL.Vector3( 0, 0 ),
                        new GL.Vector3( 4, 0 ),
                        new GL.Vector3( 3.5, 0.5 ),
                        new GL.Vector3( 1, 0.75 ),
                        new GL.Vector3( 0.8, 1 ),
                        new GL.Vector3( 0.8, 4 ),
                        new GL.Vector3( 1, 4.2 ),
                        new GL.Vector3( 1.4, 4.8 ),
                        new GL.Vector3( 2, 5 ),
                        new GL.Vector3( 2.5, 5.4 ),
                        new GL.Vector3( 3, 12 )
                    ];
                    let segments    = 20;
                    let phiStart    = 0;
                    let phiLength   = 2 * Math.PI;
                    this._core = new GL.LatheGeometry( points, segments, phiStart, phiLength );
                }
                break;
        }
    }

    // [ Public Functions ]

    // [ Public Static Variables ]

    // [ Public Static Functions ]

    // [ Public Operators ]

    // [ Public Events ]

    // [ Protected Variables ]

    protected _core : GL.Geometry|GL.BufferGeometry;

    // [ Protected Functions ]

    // [ Protected Static Variables ]

    // [ Protected Static Functions ]
}
window['units'][Geometry.name]=Geometry;
