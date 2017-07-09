/**
 * SetMaterialValueCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { Command } from './Command';

/**
 * SetMaterialValueCommand
 *
 * @export
 * @class SetMaterialValueCommand
 * @extends {Command}
 */
export class SetMaterialValueCommand extends Command {

    // [ Public Variables ]

    object : any;

    // [ Public Functions ]

    execute () {
		this.object.material[ this.attributeName ] = this._newValue;
		this.object.material.needsUpdate = true;
		this._tool.signals.objectChanged.dispatch( this.object );
		this._tool.signals.materialChanged.dispatch( this.object.material );
    }

    undo () {
		this.object.material[ this.attributeName ] = this._oldValue;
		this.object.material.needsUpdate = true;
		this._tool.signals.objectChanged.dispatch( this.object );
		this._tool.signals.materialChanged.dispatch( this.object.material );
    }

	update ( cmd:SetMaterialValueCommand ) {
		this._newValue = cmd._newValue;
	}

    toJSON () : any {
        let output          = super.toJSON();
		output.objectUuid   = this.object.uuid;
		output.attributeName= this.attributeName;
		output.oldValue     = this._oldValue;
		output.newValue     = this._newValue;
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

    constructor( object:any, attributeName:string, newValue:any ) {
        super();

        this.type           = 'SetMaterialValueCommand';
        this.name           = 'Set Material.' + attributeName;
        this.updatable      = true;
        this.object         = object;
        this._oldValue      = ( object !== undefined ) ? object.material[ attributeName ] : undefined;
        this._newValue      = newValue;
        this.attributeName  = attributeName;
    }

    // [ Private Variables ]

    private _oldValue    : any;
    private _newValue    : any;
}
