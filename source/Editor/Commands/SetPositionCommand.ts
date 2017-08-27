/**
 * SetPositionCommand
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { THREE      }   from '../../Engine/Core';
import { Command    }   from './Command';

/**
 * SetPositionCommand
 *
 * @export
 * @class SetPositionCommand
 * @extends {Command}
 */
export class SetPositionCommand extends Command {

    // [ Public Functions ]

    execute () {
		this.object.position.copy( this._newPosition );
		this.object.updateMatrixWorld( true );
		this._tool.signals.objectChanged.dispatch( this.object );
    }

    undo () {
		this.object.position.copy( this._oldPosition );
		this.object.updateMatrixWorld( true );
		this._tool.signals.objectChanged.dispatch( this.object );
    }

	update ( command:SetPositionCommand ) {
		this._newPosition.copy( command._newPosition );
	}

    toJSON () : any {
        let output          = super.toJSON();
		output.objectUuid   = this.object.uuid;
		output.oldPosition  = this._oldPosition.toArray();
		output.newPosition  = this._newPosition.toArray();
        return output;
    }

	fromJSON ( json:any ) {
        super.fromJSON( json );
		this.object         = this._tool.objectByUuid( json.objectUuid );
		this._oldPosition   = new THREE.Vector3().fromArray( json.oldPosition );
		this._newPosition   = new THREE.Vector3().fromArray( json.newPosition );
	}

    // [ Constructor ]

    constructor( object:THREE.Object3D, newPosition:THREE.Vector3, optionalOldPosition?:THREE.Vector3 ) {
        super();

        this.type       = 'SetPositionCommand';
        this.name       = 'Set Position';
        this.updatable  = true;
        this.object     = object;

        if ( object !== undefined && newPosition !== undefined ) {
            this._oldPosition = object.position.clone();
            this._newPosition = newPosition.clone();
        }

        if ( optionalOldPosition !== undefined ) {
            this._oldPosition = optionalOldPosition.clone();
        }
    }

    // [ Private Variables ]

    private _oldPosition    : THREE.Vector3;
    private _newPosition    : THREE.Vector3;
}
