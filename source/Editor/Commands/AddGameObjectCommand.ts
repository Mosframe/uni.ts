/**
 * AddGameObjectCommand.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import * as GL          from '../../Engine/Graphic';
import { GameObject }   from '../../Engine/GameObject';
import { Command    }   from './Command';

/**
 * AddGameObjectCommand
 *
 * @export
 * @class AddGameObjectCommand
 * @extends {Command}
 */
export class AddGameObjectCommand extends Command {

    // [ Public Functions ]

    /**
     * Execute
     *
     * @memberof AddGameObjectCommand
     */
    execute () {
        this._tool.addObject( this.object );
		this._tool.gameObjects[ this.object.uuid ] = this._gameObject;
    }
    /**
     * Undo
     *
     * @memberof AddGameObjectCommand
     */
	undo () {
		this._tool.removeObject( this.object );
        this._tool.gameObjects[ this.object.uuid ] = this._tool.gameObjects[this.object.uuid];
		this._tool.deselect();
	}
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof AddGameObjectCommand
     */
    toJSON () : any {
		let output = super.toJSON();
		output.object = this._gameObject.core.toJSON();
        output.GameObject = this._gameObject.toJSON();
		return output;
    }
    /**
     * from JSON
     *
     * @param {*} json
     * @memberof AddGameObjectCommand
     */
	fromJSON ( json:any ) {
		super.fromJSON( json );
		this.object = this._tool.objectByUuid( json.object.object.uuid );
		if ( this.object === undefined ) {
			let loader = new GL.ObjectLoader();
			this.object = loader.parse( json.object );
		}
        this._gameObject = Object.assign( new GameObject(), JSON.parse(json.gameObject) );
	}

    // [ Constructor ]

    /**
     * Creates an instance of AddGameObjectCommand.
     * @param {GameObject} gameObject
     * @memberof AddGameObjectCommand
     */
    constructor( gameObject:GameObject ) {
        super();

        this.type = 'AddGameObjectCommand';
        this._gameObject = gameObject;
        this.object = gameObject.core;
        if( gameObject !== undefined && gameObject.core !== undefined ) {
            this.name = 'Add GameObject: ' + gameObject.name;
        }
    }

    // [ Protected Variables ]
    protected _gameObject : GameObject;
}
