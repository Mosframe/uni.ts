/**
 * AddComponentCommand.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import * as GL          from '../../Engine/Graphic';
import { GameObject }   from '../../Engine/GameObject';
import { Command    }   from './Command';

/**
 * AddComponentCommand
 *
 * @export
 * @class AddComponentCommand
 * @extends {Command}
 */
export class AddComponentCommand extends Command {

    // [ Public Functions ]

    /**
     * Execute
     *
     * @memberof AddComponentCommand
     */
    execute () {
        this._gameObject.addComponentByName( this._componentName );
    }
    /**
     * Undo
     *
     * @memberof AddComponentCommand
     */
	undo () {
        this._gameObject.addComponentByName( this._componentName );
	}
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof AddComponentCommand
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
     * @memberof AddComponentCommand
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
     * Creates an instance of AddComponentCommand.
     * @param {GameObject} gameObject
     * @memberof AddComponentCommand
     */
    constructor( gameObject:GameObject, componentName:string ) {
        super();

        this.type = 'AddComponentCommand';
        this._gameObject = gameObject;
        this._componentName = componentName;
        if( gameObject !== undefined ) {
            this.name = 'Add Component: ' + componentName;
        }
    }

    // [ Protected Variables ]
    protected _gameObject       : GameObject;
    protected _componentName    : string;
}
