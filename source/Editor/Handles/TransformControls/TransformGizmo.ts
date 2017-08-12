/**
 * TransformGizmo.ts
 *
 * @author arodic ( https://github.com/arodic )
 * @author mosframe / https://github.com/mosframe
 */

import { GL         		}   from '../../../Engine/Graphic';
import { GizmoMaterial      }   from './GizmoMaterial';
import { GizmoLineMaterial  }   from './GizmoLineMaterial';

/**
 * TransformGizmo
 *
 * @export
 * @class TransformGizmo
 * @extends {GL.Object3D}
 */
export class TransformGizmo extends GL.Object3D {

    // [ Public Variables ]

    get pickers       ()  : GL.Object3D { return this._pickers; }
    get activePlane   ()  : GL.Mesh     { return this._activePlane; }

    // [ Public Functions ]

    setupGizmos ( gizmoMap:any, parent:GL.Object3D ) {

        for ( let name in gizmoMap ) {

            for( let i = gizmoMap[ name ].length; i--; ) {

                let object = gizmoMap[ name ][ i ][ 0 ];
                let position = gizmoMap[ name ][ i ][ 1 ];
                let rotation = gizmoMap[ name ][ i ][ 2 ];

                object.name = name;

                if ( position ) object.position.set( position[ 0 ], position[ 1 ], position[ 2 ] );
                if ( rotation ) object.rotation.set( rotation[ 0 ], rotation[ 1 ], rotation[ 2 ] );

                parent.add( object );
            }
        }
    }

    highlight ( axis:string ) {

        this.traverse( ( child:GL.Object3D ) => {
            if( child instanceof GL.Mesh || child instanceof GL.Line ) {
                if ( child.material ) {
                    if( child.material instanceof GizmoMaterial || child.material instanceof GizmoLineMaterial ) {
                        if( child.material.highlight ) {
                            if ( child.name === axis ) {
                                child.material.highlight( true );
                            } else {
                                child.material.highlight( false );
                            }
                        }
                    }
                }
            }
        });
    }

	update ( rotation:GL.Euler, eye:GL.Vector3 ) {

		let vec1 = new GL.Vector3( 0, 0, 0 );
		let vec2 = new GL.Vector3( 0, 1, 0 );
		let lookAtMatrix = new GL.Matrix4();

		this.traverse( ( child:GL.Object3D ) => {

			if( child.name.search( "E" ) !== - 1 ) {

                child.quaternion.setFromRotationMatrix( lookAtMatrix.lookAt( eye, vec1, vec2 ) );

			} else if ( child.name.search( "X" ) !== - 1 || child.name.search( "Y" ) !== - 1 || child.name.search( "Z" ) !== - 1 ) {

                child.quaternion.setFromEuler( rotation );

			}
		});
	};

    // [ Protected Veriables ]

    protected _handles          : GL.Object3D;
    protected _pickers          : GL.Object3D;
    protected _planes           : GL.Object3D;
    protected _activePlane      : GL.Mesh;
    protected _handleGizmos     : any;
    protected _pickerGizmos     : any;

    // [ Protected Functions ]

    protected _init () {

        this._handles    = new GL.Object3D();
        this._pickers    = new GL.Object3D();
        this._planes     = new GL.Object3D();

        this.add( this._handles );
        this.add( this._pickers );
        this.add( this._planes );

        // [ planes ]

        let planeGeometry = new GL.PlaneBufferGeometry( 50, 50, 2, 2 );
        let planeMaterial = new GL.MeshBasicMaterial( { visible:false, side:GL.DoubleSide } );

        let planes = {
            "XY":   new GL.Mesh( planeGeometry, planeMaterial ),
            "YZ":   new GL.Mesh( planeGeometry, planeMaterial ),
            "XZ":   new GL.Mesh( planeGeometry, planeMaterial ),
            "XYZE": new GL.Mesh( planeGeometry, planeMaterial )
        };
        this._activePlane = planes[ "XYZE" ];

        planes[ "YZ" ].rotation.set( 0, Math.PI / 2, 0 );
        planes[ "XZ" ].rotation.set( - Math.PI / 2, 0, 0 );

        for ( let i in planes ) {
            planes[ i ].name = i;
            this._planes.add( planes[ i ] );
            this._planes[ i ] = planes[ i ];
        }

        // [ HANDLES AND PICKERS ]

        this.setupGizmos( this._handleGizmos, this._handles );
        this.setupGizmos( this._pickerGizmos, this._pickers );

        // [ reset Transformations ]

        this.traverse( ( child:GL.Object3D ) => {

            if ( child instanceof GL.Mesh ) {

                child.updateMatrix();

                let tempGeometry = child.geometry.clone();
                tempGeometry.applyMatrix( child.matrix );
                child.geometry = tempGeometry;

                child.position.set( 0, 0, 0 );
                child.rotation.set( 0, 0, 0 );
                child.scale.set( 1, 1, 1 );
            }
        });
    }
}

