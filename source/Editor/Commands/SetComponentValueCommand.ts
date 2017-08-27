/**
 * SetComponentValueCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { THREE   	    }   from '../../Engine/Core';
import { Ubject         }   from '../../Engine/Ubject';
import { GameObject     }   from '../../Engine/GameObject';
import { Scene          }   from '../../Engine/Scene';
import { SceneManager   }   from '../../Engine/SceneManager';
import { Component      }   from '../../Engine/Component';

import { Command        }   from './Command';

/**
 * SetComponentValueCommand
 *
 * @export
 * @class SetComponentValueCommand
 * @extends {Command}
 */
export class SetComponentValueCommand extends Command {

    // [ Public Functions ]

    /**
     * Execute
     *
     * @memberof SetComponentValueCommand
     */
    execute () {
        this._component[this.attributeName] = this._newValue;
        this._tool.signals.objectChanged.dispatch( this._component.gameObject.core );
    }
    /**
     * Undo
     *
     * @memberof SetComponentValueCommand
     */
	undo () {
        this._component[this.attributeName] = this._oldValue;
        this._tool.signals.objectChanged.dispatch( this._component.gameObject.core );
	}
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof SetComponentValueCommand
     */
    toJSON () : any {
        let output = super.toJSON();
        output.sceneUuid        = this._component['__scene'].core.uuid;
        output.componentUuid    = this._component.uuid;
		output.attributeName    = this.attributeName;
		output.oldValue         = this._oldValue;
		output.newValue         = this._newValue;
		return output;
    }
    /**
     * from JSON
     *
     * @param {*} json
     * @memberof SetComponentValueCommand
     */
	fromJSON ( json:any ) {
		super.fromJSON( json );
		this.attributeName  = json.attributeName;
		this._oldValue      = json.oldValue;
        this._newValue      = json.newValue;
        this._component     = <Component>this._tool.scene.findUbjectByUUID(json.componentUuid);
	}

    // [ Constructor ]

    /**
     * Creates an instance of SetComponentValueCommand.
     * @param {GameObject} gameObject
     * @param {string} componentName
     * @memberof SetComponentValueCommand
     */
    constructor( component:Component, attributeName:string, value:any ) {
        super();

        this.type           = 'SetComponentValueCommand';
        this.name           = 'Set Component Value: ' + attributeName;
        this.attributeName  = attributeName;
        this._component     = component;
        this._newValue      = value;
        this._oldValue      = component[ attributeName ];
    }

    protected _component    : Component;
    protected _oldValue     : any;
    protected _newValue     : any;
}
