/**
 * TranslateGizmo.ts
 *
 * @author arodic ( https://github.com/arodic )
 * @author mosframe / https://github.com/mosframe
 */

import { THREE         		}   from '../../../Engine/Core';
import { GizmoMaterial      }   from './GizmoMaterial';
import { pickerMaterial    	} 	from './GizmoMaterial';
import { GizmoLineMaterial  }   from './GizmoLineMaterial';
import { TransformGizmo    	} 	from './TransformGizmo';

/**
 * TranslateGizmo
 *
 * @export
 * @class TranslateGizmo
 * @extends {TransformGizmo}
 */
export class TranslateGizmo extends TransformGizmo {

    // [ Public Functions ]

    setActivePlane ( axis:string, eye:THREE.Vector3 ) {

        let tempMatrix = new THREE.Matrix4();
        eye.applyMatrix4( tempMatrix.getInverse( tempMatrix.extractRotation( this._planes[ "XY" ].matrixWorld ) ) );

        if ( axis === "X" ) {

            this._activePlane = this._planes[ "XY" ];
            if ( Math.abs( eye.y ) > Math.abs( eye.z ) ) this._activePlane = this._planes[ "XZ" ];
        }

        if ( axis === "Y" ) {

            this._activePlane = this._planes[ "XY" ];
            if ( Math.abs( eye.x ) > Math.abs( eye.z ) ) this._activePlane = this._planes[ "YZ" ];
        }

        if ( axis === "Z" ) {

            this._activePlane = this._planes[ "XZ" ];
            if ( Math.abs( eye.x ) > Math.abs( eye.y ) ) this._activePlane = this._planes[ "YZ" ];
        }

        if ( axis === "XYZ" ) this._activePlane = this._planes[ "XYZE"];
        if ( axis === "XY" 	) this._activePlane = this._planes[ "XY" 	];
        if ( axis === "YZ" 	) this._activePlane = this._planes[ "YZ" 	];
        if ( axis === "XZ" 	) this._activePlane = this._planes[ "XZ" 	];
    }


    // [ Constructors ]

    constructor() {
        super();

		let arrowGeometry = new THREE.Geometry();
		let mesh = new THREE.Mesh( new THREE.CylinderGeometry( 0, 0.05, 0.2, 12, 1, false ) );
		mesh.position.y = 0.5;
		mesh.updateMatrix();

        arrowGeometry.merge( <THREE.Geometry>mesh.geometry, mesh.matrix );

		let lineXGeometry = new THREE.BufferGeometry();
		lineXGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0,  1, 0, 0 ], 3 ) );

		let lineYGeometry = new THREE.BufferGeometry();
		lineYGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0,  0, 1, 0 ], 3 ) );

		let lineZGeometry = new THREE.BufferGeometry();
		lineZGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0,  0, 0, 1 ], 3 ) );

		this._handleGizmos = {

			X: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0xff0000 } ) ), [ 0.5, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ],
				[ new THREE.Line( lineXGeometry, new GizmoLineMaterial( { color: 0xff0000 } ) ) ]
			],

			Y: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x00ff00 } ) ), [ 0, 0.5, 0 ] ],
				[ new THREE.Line( lineYGeometry, new GizmoLineMaterial( { color: 0x00ff00 } ) ) ]
			],

			Z: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x0000ff } ) ), [ 0, 0, 0.5 ], [ Math.PI / 2, 0, 0 ] ],
				[ new THREE.Line( lineZGeometry, new GizmoLineMaterial( { color: 0x0000ff } ) ) ]
			],

			XYZ: [
				[ new THREE.Mesh( new THREE.OctahedronGeometry( 0.1, 0 ), new GizmoMaterial( { color: 0xffffff, opacity: 0.25 } ) ), [ 0, 0, 0 ], [ 0, 0, 0 ] ]
			],

			XY: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.29, 0.29 ), new GizmoMaterial( { color: 0xffff00, opacity: 0.25 } ) ), [ 0.15, 0.15, 0 ] ]
			],

			YZ: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.29, 0.29 ), new GizmoMaterial( { color: 0x00ffff, opacity: 0.25 } ) ), [ 0, 0.15, 0.15 ], [ 0, Math.PI / 2, 0 ] ]
			],

			XZ: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.29, 0.29 ), new GizmoMaterial( { color: 0xff00ff, opacity: 0.25 } ) ), [ 0.15, 0, 0.15 ], [ - Math.PI / 2, 0, 0 ] ]
			]
		};

		this._pickerGizmos = {

			X: [
				[ new THREE.Mesh( new THREE.CylinderBufferGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0.6, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ]
			],

			Y: [
				[ new THREE.Mesh( new THREE.CylinderBufferGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0, 0.6, 0 ] ]
			],

			Z: [
				[ new THREE.Mesh( new THREE.CylinderBufferGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0, 0, 0.6 ], [ Math.PI / 2, 0, 0 ] ]
			],

			XYZ: [
				[ new THREE.Mesh( new THREE.OctahedronGeometry( 0.2, 0 ), pickerMaterial ) ]
			],

			XY: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.4, 0.4 ), pickerMaterial ), [ 0.2, 0.2, 0 ] ]
			],

			YZ: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.4, 0.4 ), pickerMaterial ), [ 0, 0.2, 0.2 ], [ 0, Math.PI / 2, 0 ] ]
			],

			XZ: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.4, 0.4 ), pickerMaterial ), [ 0.2, 0, 0.2 ], [ - Math.PI / 2, 0, 0 ] ]
			]
		};

		this._init();
    }
}

