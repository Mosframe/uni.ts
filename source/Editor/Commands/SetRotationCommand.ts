/**
 * SetRotationCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { THREE      }   from '../../Engine/Core';
import { Command    }   from './Command';

/**
 * SetRotationCommand
 *
 * @export
 * @class SetRotationCommand
 * @extends {Command}
 */
export class SetRotationCommand extends Command {

    // [ Public Functions ]

    execute () {
		this.object.rotation.copy( this._newRotation );
		this.object.updateMatrixWorld( true );
		this._tool.signals.objectChanged.dispatch( this.object );
    }

    undo () {
		this.object.rotation.copy( this._oldRotation );
		this.object.updateMatrixWorld( true );
		this._tool.signals.objectChanged.dispatch( this.object );
    }

	update ( command:SetRotationCommand ) {
		this._newRotation.copy( command._newRotation );
	}

    toJSON () : any {
        let output          = super.toJSON();
		output.objectUuid   = this.object.uuid;
		output.oldRotation  = this._oldRotation.toArray();
		output.newRotation  = this._newRotation.toArray();
        return output;
    }

	fromJSON ( json:any ) {
        super.fromJSON( json );
		this.object         = this._tool.objectByUuid( json.objectUuid );
		this._oldRotation   = new THREE.Euler().fromArray( json.oldRotation );
		this._newRotation   = new THREE.Euler().fromArray( json.newRotation );
	}

    // [ Constructor ]

    constructor( object:THREE.Object3D, newRotation:THREE.Euler, optionalOldRotation?:THREE.Euler ) {
        super();

        this.type       = 'SetRotationCommand';
        this.name       = 'Set Rotation';
        this.updatable  = true;
        this.object     = object;

        if ( object !== undefined && newRotation !== undefined ) {
            this._oldRotation = object.rotation.clone();
            this._newRotation = newRotation.clone();
        }

        if ( optionalOldRotation !== undefined ) {
            this._oldRotation = optionalOldRotation.clone();
        }
    }

    // [ Private Variables ]

    private _oldRotation    : THREE.Euler;
    private _newRotation    : THREE.Euler;
}
