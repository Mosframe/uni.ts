/**
 * SetGeometryValueCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { Command } from './Command';

/**
 * SetGeometryValueCommand
 *
 * @export
 * @class SetGeometryValueCommand
 * @extends {Command}
 */
export class SetGeometryValueCommand extends Command {

    // [ Public Variables ]

    object : any;

    // [ Public Functions ]

    execute () {
		this.object.geometry[ this.attributeName ] = this._newValue;
		this._tool.signals.objectChanged.dispatch( this.object );
		this._tool.signals.geometryChanged.dispatch();
		this._tool.signals.sceneGraphChanged.dispatch();
    }

    undo () {
		this.object.geometry[ this.attributeName ] = this._oldValue;
		this._tool.signals.objectChanged.dispatch( this.object );
		this._tool.signals.geometryChanged.dispatch();
		this._tool.signals.sceneGraphChanged.dispatch();
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
		this.object          = this._tool.objectByUuid( json.objectUuid );
		this.attributeName   = json.attributeName;
		this._oldValue       = json.oldValue;
		this._newValue       = json.newValue;
	}

    // [ Constructor ]

    constructor( object:any, attributeName:string, newValue:any ) {
        super();

        this.type           = 'SetGeometryValueCommand';
        this.name           = 'Set Geometry.' + attributeName;
        this.object         = object;
        this.attributeName  = attributeName;
        this._oldValue      = ( object !== undefined ) ? object.geometry[ attributeName ] : undefined;
        this._newValue      = newValue;
    }

    // [ Private Variables ]

    private _oldValue   : any;
    private _newValue   : any;
}
