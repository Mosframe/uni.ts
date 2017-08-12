/**
 * SetValueCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { GL         }   from '../../Engine/Graphic';
import { Command    }   from './Command';

/**
 * SetValueCommand
 *
 * @export
 * @class SetValueCommand
 * @extends {Command}
 */
export class SetValueCommand extends Command {

    // [ Public Functions ]

    execute () {
		this.object[ this.attributeName ] = this._newValue;
		this._tool.signals.objectChanged.dispatch( this.object );
		//this._tool.signals.sceneGraphChanged.dispatch();
    }

    undo () {
		this.object[ this.attributeName ] = this._oldValue;
		this._tool.signals.objectChanged.dispatch( this.object );
		// this._tool.signals.sceneGraphChanged.dispatch();
    }

	update ( cmd:SetValueCommand ) {
		this._newValue = cmd._newValue;
	}

    toJSON () : any {
        let output              = super.toJSON();
		output.objectUuid       = this.object.uuid;
		output.attributeName    = this.attributeName;
		output.oldValue         = this._oldValue;
		output.newValue         = this._newValue;
        return output;
    }

	fromJSON ( json:any ) {
        super.fromJSON( json );
		this.attributeName  = json.attributeName;
		this._oldValue      = json.oldValue;
		this._newValue      = json.newValue;
		this.object         = this._tool.objectByUuid( json.objectUuid );
	}

    // [ Constructor ]

    constructor( object:GL.Object3D, attributeName:string, newValue:any ) {
        super();
        this.type           = 'SetValueCommand';
        this.name           = 'Set ' + attributeName;
        this.updatable      = true;
        this.object         = object;
        this.attributeName  = attributeName;
        this._oldValue      = ( object !== undefined ) ? object[ attributeName ] : undefined;
        this._newValue      = newValue;
    }

    // [ Private Variables ]

    private _oldValue   : any;
    private _newValue   : any;
}
