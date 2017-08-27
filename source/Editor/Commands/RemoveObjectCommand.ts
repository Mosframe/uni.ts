/**
 * RemoveObjectCommand
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { THREE      }   from '../../Engine/Core';
import { GameObject }   from '../../Engine/GameObject';
import { Ubject     }   from '../../Engine/Ubject';
import { Command    }   from './Command';

/**
 * RemoveObjectCommand
 * TODO : 게임오브젝트 삭제 , Ubject.objects, scene.gameObjects
 *
 * @export
 * @class RemoveObjectCommand
 * @extends {Command}
 */
export class RemoveObjectCommand extends Command {

    // [ Public Variables ]

    /**
     * Execute
     *
     * @memberof RemoveObjectCommand
     */
    execute () {
		this.object.traverse( ( child:THREE.Object3D ) => {
			this._tool.removeHelper( child );
		});

        this._tool.scene.remove( this.object );

		this._parent.remove( this.object );
		this._tool.select( this._parent );

		this._tool.signals.objectRemoved.dispatch( this.object );
		this._tool.signals.sceneGraphChanged.dispatch();
    }
    /**
     * Undo
     *
     * @memberof RemoveObjectCommand
     */
	undo () {
		this.object.traverse( ( child:THREE.Object3D ) => {
            if( 'geometry' in child ) this._tool.addGeometry( child['geometry'] );
            if( 'material' in child ) this._tool.addMaterial( child['material'] );
			this._tool.addHelper( child );
		});

		this._parent.children.splice( this._index, 0, this.object );
		this.object.parent = this._parent;
		this._tool.select( this.object );

		this._tool.signals.objectAdded.dispatch( this.object );
		this._tool.signals.sceneGraphChanged.dispatch();
	}
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof RemoveObjectCommand
     */
    toJSON () : any {
		let output          = super.toJSON();
		output.object       = this.object.toJSON();
		output.index        = this._index;
		output.parentUuid   = this._parent.uuid;
		return output;
    }
    /**
     * from JSON
     *
     * @param {*} json
     * @memberof RemoveObjectCommand
     */
	fromJSON ( json:any ) {
		super.fromJSON( json );
		this._parent = this._tool.objectByUuid( json.parentUuid );
		if ( this._parent === undefined ) {
			this._parent = this._tool.scene.core;
		}
		this._index = json.index;
		this.object = this._tool.objectByUuid( json.object.object.uuid );
		if ( this.object === undefined ) {
			let loader = new THREE.ObjectLoader();
			this.object = loader.parse( json.object );
		}
	}

    // [ Constructor ]

    /**
     * Creates an instance of RemoveObjectCommand.
     * @param {GameObject} gameObject
     * @memberof RemoveObjectCommand
     */
    constructor( object:THREE.Object3D ) {
        super();

        this.type           = 'RemoveObjectCommand';
        this.name           = 'Remove Object';
        this.object         = object;
        this._parent        = this.object.parent;
        if ( this._parent !== undefined ) {
            this._index = this._parent.children.indexOf( this.object );
        }
    }

	// [ Private Variables ]

    private _parent	    : THREE.Object3D;
    private _index 	    : number;
}
