/**
 * Command.ts
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { GL   	    }   from '../../Engine/Graphic';
import { GameObject }   from '../../Engine/GameObject';
import { ITool      }   from '../Interfaces';
import { ICommand   }   from '../Interfaces';
import { Config     }   from '../Config';

/**
 * Command
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @export
 * @class Command
 * @implements {ICommand}
 */
export class Command implements ICommand {

    // [ Public Static Variables ]

    static editor   : ITool;

    // [ Public Variables ]

	id              : number;
	type            : string;
	name            : string;
	inMemory        : boolean;
	updatable       : boolean;
    object          : GL.Object3D;
    script          : any;
    attributeName   : string;
    json            : any;

    // [ Public Functions ]

    execute () {

    }

    undo    () {

    }

    toJSON  () : any {
        return {
            type : this.type,
            id   : this.id,
            name : this.name,
        }
    }

    fromJSON ( json:any ) {
        this.inMemory = true;
        this.type     = json.type;
        this.id       = json.id;
        this.name     = json.name;
    }

    update ( cmd:ICommand ) {

    }

    // [ Constructors ]

    constructor( editor?:ITool ) {
        this.id         = - 1;
        this.inMemory   = false;
        this.updatable  = false;
        this.type       = '';
        this.name       = '';

        if( editor !== undefined ) {
            Command.editor = editor;
        }
        this._tool = Command.editor;
    }

    // [ Protected Variables ]

	protected _tool : ITool;
}
