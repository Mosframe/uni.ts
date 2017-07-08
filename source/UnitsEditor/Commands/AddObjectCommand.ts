/**
 * AddObjectCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import * as GL          from '../../UnitsEngine/Graphic';
import {Command     }   from './Command';

/**
 * AddObjectCommand
 *
 * @export
 * @class AddObjectCommand
 * @extends {Command}
 */
export class AddObjectCommand extends Command {

    // [ Public Functions ]

    /**
     * Execute
     *
     * @memberof AddObjectCommand
     */
    execute () {
        this._editor.addObject( this.object );
    }
    /**
     * Undo
     *
     * @memberof AddObjectCommand
     */
	undo () {
		this._editor.removeObject( this.object );
		this._editor.deselect();
	}
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof AddObjectCommand
     */
    toJSON () : any {
		let output = super.toJSON();
		output.object = this.object.toJSON();
		return output;
    }
    /**
     * from JSON
     *
     * @param {*} json
     * @memberof AddObjectCommand
     */
	fromJSON ( json:any ) {
		super.fromJSON( json );
		this.object = this._editor.objectByUuid( json.object.object.uuid );
		if ( this.object === undefined ) {
			let loader = new GL.ObjectLoader();
			this.object = loader.parse( json.object );
		}
	}

    // [ Constructor ]

    /**
     * Creates an instance of AddObjectCommand.
     * @param {GL.Object3D} object
     * @memberof AddObjectCommand
     */
    constructor( object:GL.Object3D ) {
        super();

        this.type   = 'AddObjectCommand';
        this.object = object;
        if( object !== undefined ) {
            this.name = 'Add Object: ' + object.name;
        }
    }
}
