/**
 * RemoveObjectCommand
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import * as GL          from '../../UnitsEngine/Graphic';
import { Command    }   from '../Command';

/**
 * RemoveObjectCommand
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
		this.object.traverse( ( child:GL.Object3D ) => {
			this._editor.removeHelper( child );
		});

		this._parent.remove( this.object );
		this._editor.select( this._parent );

		this._editor.signals.objectRemoved.dispatch( this.object );
		this._editor.signals.sceneGraphChanged.dispatch();
    }
    /**
     * Undo
     *
     * @memberof RemoveObjectCommand
     */
	undo () {
		this.object.traverse( ( child:GL.Object3D ) => {
            if( 'geometry' in child ) this._editor.addGeometry( child['geometry'] );
            if( 'material' in child ) this._editor.addMaterial( child['material'] );
			this._editor.addHelper( child );
		});

		this._parent.children.splice( this._index, 0, this.object );
		this.object.parent = this._parent;
		this._editor.select( this.object );

		this._editor.signals.objectAdded.dispatch( this.object );
		this._editor.signals.sceneGraphChanged.dispatch();
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
		this._parent = this._editor.objectByUuid( json.parentUuid );
		if ( this._parent === undefined ) {
			this._parent = this._editor.scene;
		}
		this._index = json.index;
		this.object = this._editor.objectByUuid( json.object.object.uuid );
		if ( this.object === undefined ) {
			let loader = new GL.ObjectLoader();
			this.object = loader.parse( json.object );
		}
	}

    // [ Constructor ]

    /**
     * Creates an instance of RemoveObjectCommand.
     * @param {GL.Object3D} object
     * @memberof RemoveObjectCommand
     */
    constructor( object:GL.Object3D ) {
        super();

        this.type   = 'RemoveObjectCommand';
        this.name   = 'Remove Object';
        this.object = object;
        this._parent = object.parent;
        if ( this._parent !== undefined ) {
            this._index = this._parent.children.indexOf( this.object );
        }
    }

	// [ Private Variables ]

    private _parent	: GL.Object3D;
    private _index 	: number;
}
