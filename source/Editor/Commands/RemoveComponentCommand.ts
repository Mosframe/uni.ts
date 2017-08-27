/**
 * RemoveComponentCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { THREE   	    }   from '../../Engine/Core';
import { Ubject         }   from '../../Engine/Ubject';
import { GameObject     }   from '../../Engine/GameObject';
import { SceneManager   }   from '../../Engine/SceneManager';
import { Component      }   from '../../Engine/Component';
import { Command        }   from './Command';

/**
 * RemoveComponentCommand
 *
 * @export
 * @class RemoveComponentCommand
 * @extends {Command}
 */
export class RemoveComponentCommand extends Command {

    // [ Public Functions ]

    /**
     * Execute
     *
     * @memberof RemoveComponentCommand
     */
    execute () {
        this._gameObject.removeComponent( this._component );
        this._tool.signals.objectSelected.dispatch( this._gameObject.core );
    }
    /**
     * Undo
     *
     * @memberof RemoveComponentCommand
     */
	undo () {
        this._gameObject['_components'].push( this._component );
        this._tool.signals.objectSelected.dispatch( this._gameObject.core );
	}
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof RemoveComponentCommand
     */
    toJSON () : any {
        let output = super.toJSON();
        output.gameObjectUuid = this._gameObject.uuid;
        output.componentUuid = this._component.uuid;
		return output;
    }
    /**
     * from JSON
     *
     * @param {*} json
     * @memberof RemoveComponentCommand
     */
	fromJSON ( json:any ) {
        super.fromJSON( json );
        this._gameObject    = <GameObject>this._tool.scene.findUbjectByUUID(json.gameObjectUuid);
        this._component     = <Component>this._tool.scene.findUbjectByUUID(json.componentUuid);
	}

    // [ Constructor ]

    /**
     * Creates an instance of RemoveComponentCommand.
     * @param {GameObject} gameObject
     * @param {string} componentName
     * @memberof RemoveComponentCommand
     */
    constructor( gameObject:GameObject, component:Component ) {
        super();

        this.type           = 'RemoveComponentCommand';
        this._gameObject    = gameObject;
        this._component     = component;
        this.name           = 'Remove Component: ' + component.name;
    }

    protected _gameObject   : GameObject;
    protected _component    : Component;
}
