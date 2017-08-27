/**
 * RemoveScriptCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { THREE      }   from '../../Engine/Core';
import { Command    }   from './Command';

/**
 * RemoveScriptCommand
 *
 * @export
 * @class RemoveScriptCommand
 * @extends {Command}
 */
export class RemoveScriptCommand extends Command {

    // [ Public Functions ]

    /**
     * Execute
     *
     * @returns
     * @memberof RemoveScriptCommand
     */
    execute () {
		if ( this._tool.scripts[ this.object.uuid ] === undefined ) return;
		if ( this._index !== - 1 ) {
			this._tool.scripts[ this.object.uuid ].splice( this._index, 1 );
		}
        this._tool.signals.scriptRemoved.dispatch( this.script );
    }
    /**
     * Undo
     *
     * @memberof RemoveScriptCommand
     */
	undo () {
		if ( this._tool.scripts[ this.object.uuid ] === undefined ) {
			this._tool.scripts[ this.object.uuid ] = [];
		}
		this._tool.scripts[ this.object.uuid ].splice( this._index, 0, this.script );
		this._tool.signals.scriptAdded.dispatch( this.script );
	}
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof RemoveScriptCommand
     */
    toJSON () : any {
		let output          = super.toJSON();
		output.objectUuid   = this.object.uuid;
		output.script       = this.script;
		output.index        = this._index;
		return output;
    }
    /**
     * from JSON
     *
     * @param {*} json
     * @memberof RemoveScriptCommand
     */
	fromJSON ( json:any ) {
		super.fromJSON( json );
		this.script     = json.script;
		this._index     = json.index;
		this.object     = this._tool.objectByUuid( json.objectUuid );
	}

    // [ Constructor ]

    /**
     * Creates an instance of RemoveScriptCommand.
     * @param {THREE.Object3D} object
     * @param {*} script
     * @memberof RemoveScriptCommand
     */
    constructor( object:THREE.Object3D, script:any ) {
        super();

        this.type   = 'RemoveScriptCommand';
        this.name   = 'Remove Script';
        this.object = object;
        this.script = script;
        if ( object && script ) {
    		this._index = this._tool.scripts[ this.object.uuid ].indexOf( this.script );
        }
    }

	// [ Private Variables ]

    private _index  : number;
}
