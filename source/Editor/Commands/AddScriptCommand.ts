/**
 * AddScriptCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 * @export
 * @class AddScriptCommand
 * @extends {Command}
 */

import { GL         }   from '../../Engine/Graphic';
import { Command	}   from './Command';

/**
 * AddScriptCommand
 *
 * @export
 * @class AddScriptCommand
 * @extends {Command}
 */
export class AddScriptCommand extends Command {

    // [ Public Functions ]

	/**
	 * Execute
	 *
	 * @memberof AddScriptCommand
	 */
    execute () {
		if ( this._tool.scripts[ this.object.uuid ] === undefined ) {
			this._tool.scripts[ this.object.uuid ] = [];
		}

		this._tool.scripts[ this.object.uuid ].push( this.script );
		this._tool.signals.scriptAdded.dispatch( this.script );
    }
	/**
	 * Undo
	 *
	 * @returns
	 * @memberof AddScriptCommand
	 */
	undo () {
		if ( this._tool.scripts[ this.object.uuid ] === undefined ) return;
		let index = this._tool.scripts[ this.object.uuid ].indexOf( this.script );
		if ( index !== - 1 ) {
			this._tool.scripts[ this.object.uuid ].splice( index, 1 );
		}
		this._tool.signals.scriptRemoved.dispatch( this.script );
	}
	/**
	 * to JSON
	 *
	 * @returns {*}
	 * @memberof AddScriptCommand
	 */
    toJSON () : any {
		let output = super.toJSON();
		output.objectUuid   = this.object.uuid;
		output.script       = this.script;
		return output;
    }
	/**
	 * from JSON
	 *
	 * @param {*} json
	 * @memberof AddScriptCommand
	 */
	fromJSON ( json:any ) {
		super.fromJSON( json );
		this.script = json.script;
		this.object = this._tool.objectByUuid( json.objectUuid );
	}

    // [ Constructor ]

	/**
	 * Creates an instance of AddScriptCommand.
	 * @param {GL.Object3D} object
	 * @param {object} script
	 * @memberof AddScriptCommand
	 */
    constructor( object:GL.Object3D, script:object ) {
        super();

        this.type   = 'AddScriptCommand';
        this.name   = 'Add Script';
        this.object = object;
        this.script = script;
    }
}
