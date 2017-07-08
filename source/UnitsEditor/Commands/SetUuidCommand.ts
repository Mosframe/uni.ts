/**
 * SetUuidCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import * as GL          from '../../UnitsEngine/Graphic';
import { Command    }   from './Command';

/**
 * SetUuidCommand
 *
 * @export
 * @class SetUuidCommand
 * @extends {Command}
 */
export class SetUuidCommand extends Command {

    // [ Public Functions ]

    execute () {
		this.object.uuid = this._newUuid;
		this._editor.signals.objectChanged.dispatch( this.object );
		this._editor.signals.sceneGraphChanged.dispatch();
    }

    undo () {
		this.object.uuid = this._oldUuid;
		this._editor.signals.objectChanged.dispatch( this.object );
		this._editor.signals.sceneGraphChanged.dispatch();
    }

	update ( cmd:SetUuidCommand ) {
        super.update(cmd);
	}

    toJSON () : any {
        let output = super.toJSON();
		output.oldUuid = this._oldUuid;
		output.newUuid = this._newUuid;
        return output;
    }

	fromJSON ( json:any ) {
        super.fromJSON( json );
		this._oldUuid = json.oldUuid;
		this._newUuid = json.newUuid;
		this.object = this._editor.objectByUuid( json.oldUuid );
		if ( this.object === undefined ) {
			this.object = this._editor.objectByUuid( json.newUuid );
		}
	}

    // [ Constructor ]

    constructor( object:GL.Object3D, newUuid:string ) {
        super();
        this.type       = 'SetUuidCommand';
        this.name       = 'Update UUID'
        this.object     = object;
        this._oldUuid   = object.uuid;
        this._newUuid   = newUuid;
    }

    // [ Private Variables ]

    private _oldUuid : string;
    private _newUuid : string;
}
