/**
 * TransformGizmo.ts
 *
 * @author arodic ( https://github.com/arodic )
 * @author mosframe / https://github.com/mosframe
 */

import { THREE         		}   from '../../../Engine/Core';
import { GizmoMaterial      }   from './GizmoMaterial';
import { GizmoLineMaterial  }   from './GizmoLineMaterial';

/**
 * TransformGizmo
 *
 * @export
 * @class TransformGizmo
 * @extends {GL.Object3D}
 */
export class TransformGizmo extends THREE.Object3D {

    // [ Public Variables ]

    get pickers       ()  : THREE.Object3D { return this._pickers; }
    get activePlane   ()  : THREE.Mesh     { return this._activePlane; }

    // [ Public Functions ]

    setupGizmos ( gizmoMap:any, parent:THREE.Object3D ) {

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

        this.traverse( ( child:THREE.Object3D ) => {
            if( child instanceof THREE.Mesh || child instanceof THREE.Line ) {
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

	update ( rotation:THREE.Euler, eye:THREE.Vector3 ) {

		let vec1 = new THREE.Vector3( 0, 0, 0 );
		let vec2 = new THREE.Vector3( 0, 1, 0 );
		let lookAtMatrix = new THREE.Matrix4();

		this.traverse( ( child:THREE.Object3D ) => {

			if( child.name.search( "E" ) !== - 1 ) {

                child.quaternion.setFromRotationMatrix( lookAtMatrix.lookAt( eye, vec1, vec2 ) );

			} else if ( child.name.search( "X" ) !== - 1 || child.name.search( "Y" ) !== - 1 || child.name.search( "Z" ) !== - 1 ) {

                child.quaternion.setFromEuler( rotation );

			}
		});
	};

    // [ Protected Veriables ]

    protected _handles          : THREE.Object3D;
    protected _pickers          : THREE.Object3D;
    protected _planes           : THREE.Object3D;
    protected _activePlane      : THREE.Mesh;
    protected _handleGizmos     : any;
    protected _pickerGizmos     : any;

    // [ Protected Functions ]

    protected _init () {

        this._handles    = new THREE.Object3D();
        this._pickers    = new THREE.Object3D();
        this._planes     = new THREE.Object3D();

        this.add( this._handles );
        this.add( this._pickers );
        this.add( this._planes );

        // [ planes ]

        let planeGeometry = new THREE.PlaneBufferGeometry( 50, 50, 2, 2 );
        let planeMaterial = new THREE.MeshBasicMaterial( { visible:false, side:THREE.DoubleSide } );

        let planes = {
            "XY":   new THREE.Mesh( planeGeometry, planeMaterial ),
            "YZ":   new THREE.Mesh( planeGeometry, planeMaterial ),
            "XZ":   new THREE.Mesh( planeGeometry, planeMaterial ),
            "XYZE": new THREE.Mesh( planeGeometry, planeMaterial )
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

        this.traverse( ( child:THREE.Object3D ) => {

            if ( child instanceof THREE.Mesh ) {

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

