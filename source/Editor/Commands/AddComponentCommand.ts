/**
 * AddComponentCommand.ts
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
import { Component      }   from '../../Engine/Component';
import { Command        }   from './Command';

/**
 * AddComponentCommand
 *
 * @export
 * @class AddComponentCommand
 * @extends {Command}
 */
export class AddComponentCommand extends Command {

    // [ Public Functions ]

    /**
     * Execute
     *
     * @memberof AddComponentCommand
     */
    execute () {
        this._component = this._gameObject.addComponent2( this._componentName );
        this._tool.signals.objectSelected.dispatch( this._gameObject.core );
    }
    /**
     * Undo
     *
     * @memberof AddComponentCommand
     */
	undo () {
        this._gameObject.removeComponent( this._component );
        this._tool.signals.objectSelected.dispatch( this._gameObject.core );
	}
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof AddComponentCommand
     */
    toJSON () : any {
		let output = super.toJSON();
        output.gameObjectUuid = this._gameObject.uuid;
        output.componentUuid = this._component.uuid;
        output.componentName = this._componentName;
		return output;
    }
    /**
     * from JSON
     *
     * @param {*} json
     * @memberof AddComponentCommand
     */
	fromJSON ( json:any ) {
		super.fromJSON( json );
        this._gameObject    = <GameObject>this._tool.scene.findUbjectByUUID(json.gameObjectUuid);
        this._component     = <Component>this._tool.scene.findUbjectByUUID(json.componentUuid);
        this._componentName = json.componentName;
	}

    // [ Constructor ]

    /**
     * Creates an instance of AddComponentCommand.
     * @param {GameObject} gameObject
     * @param {string} componentName
     * @memberof AddComponentCommand
     */
    constructor( gameObject:GameObject, componentName:string ) {
        super();

        this.type           = 'AddComponentCommand';
        this._gameObject    = gameObject;
        this._componentName = componentName;
        this.name           = 'Add Component: ' + componentName;
    }

    protected _gameObject       : GameObject;
    protected _componentName    : string;
    protected _component        : Component;
}
