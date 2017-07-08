/**
 * MultiCmdsCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { ICommand   }	from '../Interfaces';
import { Command    } 	from './Command';

/**
 * MultiCmdsCommand
 *
 * @export
 * @class MultiCmdsCommand
 * @extends {Command}
 */
export class MultiCmdsCommand extends Command {

    // [ Public Functions ]

	/**
	 * Execute
	 *
	 * @memberof MultiCmdsCommand
	 */
    execute () {
		this._editor.signals.sceneGraphChanged.active = false;

		for ( let i = 0; i < this._cmdArray.length; i ++ ) {
			this._cmdArray[ i ].execute();
		}

		this._editor.signals.sceneGraphChanged.active = true;
		this._editor.signals.sceneGraphChanged.dispatch();
    }
	/**
	 * Undo
	 *
	 * @memberof MultiCmdsCommand
	 */
	undo () {
		this._editor.signals.sceneGraphChanged.active = false;

		for ( let i = this._cmdArray.length - 1; i >= 0; i -- ) {
			this._cmdArray[ i ].undo();
		}

		this._editor.signals.sceneGraphChanged.active = true;
		this._editor.signals.sceneGraphChanged.dispatch();
	}
	/**
	 * to JSON
	 *
	 * @returns {*}
	 * @memberof MultiCmdsCommand
	 */
    toJSON () : any {
		let output = super.toJSON();
		let cmds : any = [];
		for ( let i = 0; i < this._cmdArray.length; i ++ ) {
			cmds.push( this._cmdArray[ i ].toJSON() );
		}
		output.cmds = cmds;
        return output;
    }
	/**
	 * from JSON
	 *
	 * @param {*} json
	 * @memberof MultiCmdsCommand
	 */
	fromJSON ( json:any ) {
		super.fromJSON( json );
		let cmds = json.cmds;
		for ( let i = 0; i < cmds.length; i ++ ) {
			let cmd = new window[ cmds[ i ].type ]();	// creates a new object of type "json.type"
			cmd.fromJSON( cmds[ i ] );
			this._cmdArray.push( cmd );
		}
	}

    // [ Constructor ]

	/**
	 * Creates an instance of MultiCmdsCommand.
	 * @param {ICommand[]} [cmdArray]
	 * @memberof MultiCmdsCommand
	 */
    constructor( cmdArray?:ICommand[] ) {
        super();

        this.type       = 'MultiCmdsCommand';
        this.name       = 'Multiple Changes';
        this._cmdArray  = ( cmdArray !== undefined ) ? cmdArray : [];
    }

	// [ Private Variables ]

    private _cmdArray : ICommand[];
}
