/**
 * ScaleGizmo.ts
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
 * ScaleGizmo
 *
 * @export
 * @class ScaleGizmo
 * @extends {TransformGizmo}
 */
export class ScaleGizmo extends TransformGizmo {

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

		if ( axis === "XYZ" ) this._activePlane = this._planes[ "XYZE" ];
	}

    // [ Constructors ]

    constructor () {
        super();

		let arrowGeometry = new THREE.Geometry();
		let mesh = new THREE.Mesh( new THREE.BoxGeometry( 0.125, 0.125, 0.125 ) );
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
				[ new THREE.Mesh( new THREE.BoxBufferGeometry( 0.125, 0.125, 0.125 ), new GizmoMaterial( { color: 0xffffff, opacity: 0.25 } ) ) ]
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
				[ new THREE.Mesh( new THREE.BoxBufferGeometry( 0.4, 0.4, 0.4 ), pickerMaterial ) ]
			]
		};

		this._init();
    }
}

