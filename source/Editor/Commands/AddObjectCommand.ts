/**
 * AddObjectCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { GL   	        }   from '../../Engine/Graphic';
import { Ubject         }   from '../../Engine/Ubject';
import { GameObject     }   from '../../Engine/GameObject';
import { SceneManager   }   from '../../Engine/SceneManager';
import { Command        }   from './Command';

/**
 * AddObjectCommand
 *
 * @export
 * @class AddObjectCommand
 * @extends {Command}
 */
export class AddObjectCommand extends Command {

    // [ Public Functions ]

    /**
     * Execute
     *
     * @memberof AddObjectCommand
     */
    execute () {
        this._tool.addObject( this.object );
    }
    /**
     * Undo
     *
     * @memberof AddObjectCommand
     */
	undo () {
		this._tool.removeObject( this.object );
		this._tool.deselect();
	}
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof AddObjectCommand
     */
    toJSON () : any {
		let output = super.toJSON();
        output.object = this.object.toJSON();
        output.gameObject = Ubject.toJSON(this.object);
		return output;
    }
    /**
     * from JSON
     *
     * @param {*} json
     * @memberof AddObjectCommand
     */
	fromJSON ( json:any ) {
		super.fromJSON( json );
        this.object = this._tool.objectByUuid( json.object.object.uuid );
        if ( this.object === undefined ) {
            let loader = new GL.ObjectLoader();
            this.object = loader.parse( json.object );
            Ubject.fromJSON( json.gameObject, SceneManager.getActiveScene().getObjects() );
        }
	}

    // [ Constructor ]

    /**
     * Creates an instance of AddObjectCommand.
     * @param {GameObject} gameObject
     * @memberof AddObjectCommand
     */
    constructor( object:GL.Object3D ) {
        super();

        this.type   = 'AddObjectCommand';
        this.object = object;
        if( object !== undefined ) {
            this.name = 'Add Object: ' + object.name;
        }
    }
}
