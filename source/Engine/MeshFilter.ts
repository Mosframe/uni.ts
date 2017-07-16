/**
 * MeshFilter.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import * as GL              from './Graphic';
import { Component      }   from './Component';
import { GameObject     }   from './GameObject';
import { Material       }   from './Material';
import { Mesh           }   from './Mesh';
import { Geometry       }   from './Geometry';
import { PrimitiveType  }   from './PrimitiveType';

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
     * @type {GL.Mesh}
     * @memberof MeshFilter
     */
    get core() : GL.Mesh { return <GL.Mesh>this.gameObject.core; }

    /**
     * Returns the instantiated Mesh assigned to the mesh filter.
     *
     * @type {Mesh}
     * @memberof MeshFilter
     */
    get mesh() : Mesh       { return <Mesh>Component.instantiate( this.sharedMesh ); }
    set mesh( value:Mesh )  { this.sharedMesh = <Mesh>Component.instantiate( value ); }
    /**
     * Returns the shared mesh of the mesh filter.
     *
     *
     * @memberof MeshFilter
     */
    get sharedMesh() : Mesh         { return this.sharedMesh_; }
    set sharedMesh( value:Mesh )    {
        this.sharedMesh_=value;
        this._onChanged();
    }

    // [ Constructors ]

    /**
     * Creates an instance of MeshFilter.
     * @param {GameObject} gameObject
     * @param {Mesh} [mesh]
     * @memberof MeshFilter
     */
    constructor( gameObject:GameObject, mesh?:Mesh ) {
        super(gameObject);

        if( mesh === undefined ) {
            mesh = new Mesh( );
        }
        this.sharedMesh = mesh;
    }

    // [ Private Variables ]

    private sharedMesh_ : Mesh;

    // [ Protected Functions ]

    protected _onChanged () {
        this.gameObject.core = this.sharedMesh_.core;
    }
}
window['units'][MeshFilter.name]=MeshFilter;
