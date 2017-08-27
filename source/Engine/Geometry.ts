/**
 * Geometry.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';
import { THREE          }   from './Core';
import { PrimitiveType  }   from './PrimitiveType';
import { Serializable   }   from './Serializable';
import { Ubject         }   from './Ubject';

/**
 * Geometry
 *
 * @export
 * @class Geometry
 * @extends {Ubject}
 */
export class Geometry extends Ubject {

    // [ Public Variables ]

    /**
     * get core geometry
     *
     * @readonly
     * @type {(THREE.Geometry|THREE.BufferGeometry)}
     * @memberof Geometry
     */
    get core () : THREE.Geometry|THREE.BufferGeometry       {return this._core; }
    set core (value:THREE.Geometry|THREE.BufferGeometry )   {this._core=value;}

    // [ Constructors ]

    /**
     * Creates an instance of Geometry.
     * @param {PrimitiveType} [type]
     *
     * @memberof Geometry
     */
    constructor( type?:PrimitiveType ) {
        super();

        switch( type ) {
            case PrimitiveType.Quad: {
                    this._core = new THREE.PlaneGeometry( 1, 1, 1, 1 );
                }
                break;
            case PrimitiveType.Plane: {
                    this._core = new THREE.PlaneGeometry( 10, 10, 10, 10 );
                }
                break;
            case PrimitiveType.Cube: {
                    this._core = new THREE.CubeGeometry( 1, 1, 1, 1, 1, 1 );
                }
                break;
            case PrimitiveType.Sphere: {
                    let radius          = 1;
                    let widthSegments   = 32;
                    let heightSegments  = 16;
                    let phiStart        = 0;
                    let phiLength       = Math.PI * 2;
                    let thetaStart      = 0;
                    let thetaLength     = Math.PI;
                    this._core = new THREE.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
                }
                break;
            case PrimitiveType.Cylinder: {
                    let radiusTop       = 1;
                    let radiusBottom    = 1;
                    let height          = 2;
                    let radiusSegments  = 32;
                    let heightSegments  = 1;
                    let openEnded       = false;
                    this._core = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
                }
                break;
            case PrimitiveType.Circle: {
                    this._core = new THREE.CircleGeometry( 1, 32 );
                }
                break;
            case PrimitiveType.Icosahedron: {
                    this._core = new THREE.IcosahedronGeometry( 1, 2 );
                }
                break;
            case PrimitiveType.Torus: {
                    let radius          = 2;
                    let tube            = 1;
                    let radialSegments  = 32;
                    let tubularSegments = 12;
                    let arc             = Math.PI * 2;
                    this._core = new THREE.TorusGeometry( radius, tube, radialSegments, tubularSegments, arc );
                }
                break;
            case PrimitiveType.TorusKnot: {
                    let radius          = 2;
                    let tube            = 0.8;
                    let radialSegments  = 64;
                    let tubularSegments = 12;
                    let p               = 2;
                    let q               = 3;
                    this._core = new THREE.TorusKnotGeometry( radius, tube, radialSegments, tubularSegments, p, q );
                }
                break;
            case PrimitiveType.Lathe: {
                    let points = [
                        new THREE.Vector3( 0, 0 ),
                        new THREE.Vector3( 4, 0 ),
                        new THREE.Vector3( 3.5, 0.5 ),
                        new THREE.Vector3( 1, 0.75 ),
                        new THREE.Vector3( 0.8, 1 ),
                        new THREE.Vector3( 0.8, 4 ),
                        new THREE.Vector3( 1, 4.2 ),
                        new THREE.Vector3( 1.4, 4.8 ),
                        new THREE.Vector3( 2, 5 ),
                        new THREE.Vector3( 2.5, 5.4 ),
                        new THREE.Vector3( 3, 12 )
                    ];
                    let segments    = 20;
                    let phiStart    = 0;
                    let phiLength   = 2 * Math.PI;
                    this._core = new THREE.LatheGeometry( points, segments, phiStart, phiLength );
                }
                break;
        }
    }

    // [ Protected Variables ]

    //@Serializable
    protected _core : THREE.Geometry|THREE.BufferGeometry;

    // [ Protected Static Functions ]
}
UnitsEngine[Geometry.name] = Geometry;
