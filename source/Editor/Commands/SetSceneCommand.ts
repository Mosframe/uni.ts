/**
 * SetSceneCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import * as GL                  from '../../Engine/Graphic';
import { GameObject         }   from '../../Engine/GameObject';
import { ICommand           }   from '../Interfaces';
import { Command            }   from './Command';
import { AddObjectCommand   }   from './AddObjectCommand';
import { SetValueCommand    }   from './SetValueCommand';
import { SetUuidCommand     }   from './SetUuidCommand';

/**
 * SetSceneCommand
 *
 * @export
 * @class SetSceneCommand
 * @extends {Command}
 */
export class SetSceneCommand extends Command {

    // [ Public Functions ]

    execute () {
		this._tool.signals.sceneGraphChanged.active = false;
		for ( let i = 0; i < this.cmdArray.length; i ++ ) {
			this.cmdArray[ i ].execute();
		}
		this._tool.signals.sceneGraphChanged.active = true;
		this._tool.signals.sceneGraphChanged.dispatch();
    }

    undo () {
		this._tool.signals.sceneGraphChanged.active = false;
		for ( let i = this.cmdArray.length - 1; i >= 0; i -- ) {
			this.cmdArray[ i ].undo();
		}
		this._tool.signals.sceneGraphChanged.active = true;
		this._tool.signals.sceneGraphChanged.dispatch();
    }

	update ( command:SetSceneCommand ) {
        super.update(command);
	}

    toJSON () : any {
        let output = super.toJSON();
		let cmds : any = [];
		for ( let i = 0; i < this.cmdArray.length; i ++ ) {
            cmds.push( this.cmdArray[ i ].toJSON() );
		}
		output.cmds = cmds;
        return output;
    }

	fromJSON ( json:any ) {
        super.fromJSON( json );
		let cmds = json.cmds;
		for ( let i = 0; i < cmds.length; i ++ ) {
			let cmd = new window[ cmds[ i ].type ]();	// creates a new object of type "json.type"
			cmd.fromJSON( cmds[ i ] );
			this.cmdArray.push( cmd );
		}
	}

    // [ Constructor ]

    constructor( object:GL.Object3D, scene?:GL.Scene ) {
        super();

        this.type   = 'SetSceneCommand';
        this.name   = 'Set Scene';

        if ( scene !== undefined ) {
            this.cmdArray.push( new SetUuidCommand( this._tool.scene.core, scene.uuid ) );
            this.cmdArray.push( new SetValueCommand( this._tool.scene.core, 'name', scene.name ) );
            this.cmdArray.push( new SetValueCommand( this._tool.scene.core, 'userData', JSON.parse( JSON.stringify( scene.userData ) ) ) );

            while ( scene.children.length > 0 ) {
                let child = scene.children.pop();
                if( child ) {
                    this.cmdArray.push( new AddObjectCommand( child ) );
                }
            }
        }
    }

    // [ Private Variables ]

    private cmdArray : ICommand[] = [];
}
