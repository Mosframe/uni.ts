/**
 * SetGeometryCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { THREE      }   from '../../Engine/Core';
import { Command    }   from './Command';

/**
 * SetGeometryCommand
 *
 * @export
 * @class SetGeometryCommand
 * @extends {Command}
 */
export class SetGeometryCommand extends Command {

    // [ Public Variables ]

    /**
     * target object
     *
     * @type {*}
     * @memberof SetGeometryCommand
     */
    object : any;

    // [ Public Functions ]

    /**
     * Execute
     *
     * @memberof SetGeometryCommand
     */
    execute () {
		this.object.geometry.dispose();
		this.object.geometry = this._newGeometry;
		this.object.geometry.computeBoundingSphere();
		this._tool.signals.geometryChanged.dispatch( this.object );
		this._tool.signals.sceneGraphChanged.dispatch();
    }
    /**
     * Undo
     *
     * @memberof SetGeometryCommand
     */
    undo () {
		this.object.geometry.dispose();
		this.object.geometry = this._oldGeometry;
		this.object.geometry.computeBoundingSphere();
		this._tool.signals.geometryChanged.dispatch( this.object );
		this._tool.signals.sceneGraphChanged.dispatch();
    }
    /**
     * Update
     *
     * @param {SetGeometryCommand} cmd
     * @memberof SetGeometryCommand
     */
    update ( cmd:SetGeometryCommand ) {
		this._newGeometry = cmd._newGeometry;
    }
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof SetGeometryCommand
     */
    toJSON () : any {
        let output          = super.toJSON();
		output.objectUuid   = this.object.uuid;
		output.oldGeometry  = this.object.geometry.toJSON();
		output.newGeometry  = this._newGeometry.toJSON();
        return output;
    }
    /**
     * from JSON
     *
     * @param {*} json
     * @memberof SetGeometryCommand
     */
	fromJSON ( json:any ) {
        super.fromJSON( json );
		this.object         = this._tool.objectByUuid( json.objectUuid );
		this._oldGeometry   = this._parseGeometry( json.oldGeometry );
		this._newGeometry   = this._parseGeometry( json.newGeometry );
	}

    // [ Constructor ]

    /**
     * Creates an instance of SetGeometryCommand.
     * @param {*} object
     * @param {(THREE.Geometry|THREE.BufferGeometry)} newGeometry
     * @memberof SetGeometryCommand
     */
    constructor( object:any, newGeometry:THREE.Geometry|THREE.BufferGeometry ) {
        super();
        this.type           = 'SetGeometryCommand';
        this.name           = 'Set Geometry';
        this.updatable      = true;
        this.object         = object;
        this._oldGeometry   = ( object !== undefined ) ? object.geometry : undefined;
        this._newGeometry   = newGeometry;
    }

    // [ Private Variables ]

    private _oldGeometry : THREE.Geometry | THREE.BufferGeometry;
    private _newGeometry : THREE.Geometry | THREE.BufferGeometry;

    // [ Private Functions ]

    private _parseGeometry ( data:THREE.Geometry ) : any {
        let loader = new THREE.ObjectLoader();
        return loader.parseGeometries( [ data ] )[ data.uuid ];
    }
}
