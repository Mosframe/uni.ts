/**
 * SetColorCommand
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import * as GL          from '../../UnitsEngine/Graphic';
import { Command    }   from '../Command';

/**
 * SetColorCommand
 *
 * @export
 * @class SetColorCommand
 * @extends {Command}
 */
export class SetColorCommand extends Command {

    // [ Public Functions ]

    /**
     * Execute
     *
     * @memberof SetColorCommand
     */
    execute () {
        this.object[ this.attributeName ].setHex( this._newValue );
        this._editor.signals.objectChanged.dispatch( this.object );
    }
    /**
     * Undo
     *
     * @memberof SetColorCommand
     */
    undo () {
        this.object[ this.attributeName ].setHex( this._oldValue );
        this._editor.signals.objectChanged.dispatch( this.object );
    }
    /**
     * Update
     *
     * @param {SetColorCommand} cmd
     * @memberof SetColorCommand
     */
    update ( cmd:SetColorCommand ) {
        this._newValue = cmd._newValue;
    }
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof SetColorCommand
     */
    toJSON () : any {
        let output            = super.toJSON();
        output.objectUuid     = this.object.uuid;
        output.attributeName  = this.attributeName;
        output.oldValue       = this._oldValue;
        output.newValue       = this._newValue;
        return output;
    }
    /**
     * from JSON
     *
     * @param {*} json
     * @memberof SetColorCommand
     */
	fromJSON ( json:any ) {
        super.fromJSON( json );
		this.object = this._editor.objectByUuid( json.objectUuid );
		this.attributeName = json.attributeName;
		this._oldValue = json.oldValue;
		this._newValue = json.newValue;
	}

    // [ Constructor ]

    /**
     * Creates an instance of SetColorCommand.
     * @param {GL.Object3D} object
     * @param {string} attributeName
     * @param {number} newValue
     * @memberof SetColorCommand
     */
    constructor( object:GL.Object3D, attributeName:string, newValue:number ) {
        super();

        this.type = 'SetColorCommand';
        this.name = 'Set ' + attributeName;
        this.updatable = true;

        this.object = object;
        this.attributeName = attributeName;
        this._oldValue = ( object !== undefined ) ? this.object[ this.attributeName ].getHex() : undefined;
        this._newValue = newValue;
    }

    // [ Private Variables ]

    private _oldValue : number;
    private _newValue : number;
}
