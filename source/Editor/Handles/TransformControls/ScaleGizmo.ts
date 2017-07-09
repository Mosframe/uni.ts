/**
 * ScaleGizmo.ts
 *
 * @author arodic ( https://github.com/arodic )
 * @author mosframe / https://github.com/mosframe
 */

import * as GL                  from '../../../Engine/Graphic';
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

	setActivePlane ( axis:string, eye:GL.Vector3 ) {

		let tempMatrix = new GL.Matrix4();
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

		let arrowGeometry = new GL.Geometry();
		let mesh = new GL.Mesh( new GL.BoxGeometry( 0.125, 0.125, 0.125 ) );
		mesh.position.y = 0.5;
		mesh.updateMatrix();

		arrowGeometry.merge( <GL.Geometry>mesh.geometry, mesh.matrix );

		let lineXGeometry = new GL.BufferGeometry();
		lineXGeometry.addAttribute( 'position', new GL.Float32BufferAttribute( [ 0, 0, 0,  1, 0, 0 ], 3 ) );

		let lineYGeometry = new GL.BufferGeometry();
		lineYGeometry.addAttribute( 'position', new GL.Float32BufferAttribute( [ 0, 0, 0,  0, 1, 0 ], 3 ) );

		let lineZGeometry = new GL.BufferGeometry();
		lineZGeometry.addAttribute( 'position', new GL.Float32BufferAttribute( [ 0, 0, 0,  0, 0, 1 ], 3 ) );

		this._handleGizmos = {

			X: [
				[ new GL.Mesh( arrowGeometry, new GizmoMaterial( { color: 0xff0000 } ) ), [ 0.5, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ],
				[ new GL.Line( lineXGeometry, new GizmoLineMaterial( { color: 0xff0000 } ) ) ]
			],

			Y: [
				[ new GL.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x00ff00 } ) ), [ 0, 0.5, 0 ] ],
				[ new GL.Line( lineYGeometry, new GizmoLineMaterial( { color: 0x00ff00 } ) ) ]
			],

			Z: [
				[ new GL.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x0000ff } ) ), [ 0, 0, 0.5 ], [ Math.PI / 2, 0, 0 ] ],
				[ new GL.Line( lineZGeometry, new GizmoLineMaterial( { color: 0x0000ff } ) ) ]
			],

			XYZ: [
				[ new GL.Mesh( new GL.BoxBufferGeometry( 0.125, 0.125, 0.125 ), new GizmoMaterial( { color: 0xffffff, opacity: 0.25 } ) ) ]
			]
		};

		this._pickerGizmos = {

			X: [
				[ new GL.Mesh( new GL.CylinderBufferGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0.6, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ]
			],

			Y: [
				[ new GL.Mesh( new GL.CylinderBufferGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0, 0.6, 0 ] ]
			],

			Z: [
				[ new GL.Mesh( new GL.CylinderBufferGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0, 0, 0.6 ], [ Math.PI / 2, 0, 0 ] ]
			],

			XYZ: [
				[ new GL.Mesh( new GL.BoxBufferGeometry( 0.4, 0.4, 0.4 ), pickerMaterial ) ]
			]
		};

		this._init();
    }
}

