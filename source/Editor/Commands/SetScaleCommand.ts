/**
 * SetScaleCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { THREE      }   from '../../Engine/Core';
import { Command    }   from './Command';

/**
 * SetScaleCommand
 *
 * @export
 * @class SetScaleCommand
 * @extends {Command}
 */
export class SetScaleCommand extends Command {

    // [ Public Functions ]

    execute () {
		this.object.scale.copy( this._newScale );
		this.object.updateMatrixWorld( true );
		this._tool.signals.objectChanged.dispatch( this.object );
    }

    undo () {
		this.object.scale.copy( this._oldScale );
		this.object.updateMatrixWorld( true );
		this._tool.signals.objectChanged.dispatch( this.object );
    }

	update ( command:SetScaleCommand ) {
		this._newScale.copy( command._newScale );
	}

    toJSON () : any {
        let output          = super.toJSON();
		output.objectUuid   = this.object.uuid;
		output.oldScale     = this._oldScale.toArray();
		output.newScale     = this._newScale.toArray();
        return output;
    }

	fromJSON ( json:any ) {
        super.fromJSON( json );
		this.object     = this._tool.objectByUuid( json.objectUuid );
		this._oldScale  = new THREE.Vector3().fromArray( json.oldScale );
		this._newScale  = new THREE.Vector3().fromArray( json.newScale );
	}

    // [ Constructor ]

    constructor( object:THREE.Object3D, newScale:THREE.Vector3, optionalOldScale?:THREE.Vector3 ) {
        super();

        this.type       = 'SetScaleCommand';
        this.name       = 'Set Scale';
        this.updatable  = true;
        this.object     = object;

        if ( object !== undefined && newScale !== undefined ) {
            this._oldScale = object.scale.clone();
            this._newScale = newScale.clone();
        }

        if ( optionalOldScale !== undefined ) {
            this._oldScale = optionalOldScale.clone();
        }
    }

    // [ Private Variables ]

    private _oldScale    : THREE.Vector3;
    private _newScale    : THREE.Vector3;
}
