/**
 * MeshFilter.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';
import { THREE          }   from './Core';
import { Ubject         }   from './Ubject';
import { Component      }   from './Component';
import { GameObject     }   from './GameObject';
import { Material       }   from './Material';
import { Mesh           }   from './Mesh';
import { Geometry       }   from './Geometry';
import { PrimitiveType  }   from './PrimitiveType';
import { Serializable   }   from './Serializable';

/**
 * A class to access the Mesh of the mesh filter.
 *
 * @export
 * @class MeshFilter
 * @extends {Component}
 */
export class MeshFilter extends Component {

    // [ Public Variables ]

    /**
     * get GL.Mesh
     *
     * @readonly
     * @type {THREE.Mesh}
     * @memberof MeshFilter
     */
    get core () : THREE.Mesh { return <THREE.Mesh>this.gameObject.core; }

    /**
     * Returns the instantiated Mesh assigned to the mesh filter.
     *
     * @type {Mesh}
     * @memberof MeshFilter
     */
    get mesh () : Mesh      { return <Mesh>Component.instantiate( this.sharedMesh ); }
    set mesh ( value:Mesh ) { this.sharedMesh = <Mesh>Component.instantiate( value ); }
    /**
     * Returns the shared mesh of the mesh filter.
     *
     *
     * @memberof MeshFilter
     */
    get sharedMesh () : Mesh        { return this._sharedMesh; }
    set sharedMesh ( value:Mesh )   { this._sharedMesh=value; this._onChanged(); }

    // [ Constructors ]

    /**
     * Creates an instance of MeshFilter.
     * @memberof MeshFilter
     */
    constructor () {
        super();
    }

    // [ Private Variables ]

    //@Serializable
    private _sharedMesh : Mesh;

    // [ Protected Functions ]

    protected _onChanged () {

        if( this._gameObject !== undefined ) {
            if( this._sharedMesh !== undefined ) {
                this._gameObject.core = this._sharedMesh.core;
            }
        }
    }
}
UnitsEngine[MeshFilter.name] = MeshFilter;
