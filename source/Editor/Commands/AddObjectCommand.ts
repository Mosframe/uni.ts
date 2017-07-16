/**
 * AddObjectCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import * as GL          from '../../Engine/Graphic';
import { GameObject }   from '../../Engine/GameObject';
import { Command    }   from './Command';

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
        this._tool.addObject( this._gameObject );
    }
    /**
     * Undo
     *
     * @memberof AddObjectCommand
     */
	undo () {
		this._tool.removeObject( this._gameObject );
		this._tool.deselect();
	}
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof AddObjectCommand
     */
    toJSON () : any {
		let output = super.toJSON();
		output.object = this._gameObject.core.toJSON();
        output.gameObject = this._gameObject.toJSON();
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

        this._gameObject = Object.assign( new GameObject(), JSON.parse(json.gameObject) );
        if( this._gameObject !== undefined ) {
            this._gameObject.core = this._tool.objectByUuid( json.object.object.uuid );
            if ( this._gameObject.core === undefined ) {
                let loader = new GL.ObjectLoader();
                this._gameObject.core = loader.parse( json.object );
            }
        }
	}

    // [ Constructor ]

    /**
     * Creates an instance of AddObjectCommand.
     * @param {GameObject} gameObject
     * @memberof AddObjectCommand
     */
    constructor( gameObject:GameObject ) {
        super();

        this.type   = 'AddGameObjectCommand';
        this._gameObject = gameObject;
        if( gameObject !== undefined ) {
            this.name = 'Add GameObject: ' + gameObject.name;
        }
    }

    // [ Protected Variables ]
    protected _gameObject : GameObject;
}
