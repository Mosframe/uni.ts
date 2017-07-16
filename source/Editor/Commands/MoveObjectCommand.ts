/**
 * MoveObjectCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import * as GL      from '../../Engine/Graphic';
import { Command }  from './Command';

/**
 * MoveObjectCommand
 *
 * @export
 * @class MoveObjectCommand
 * @extends {Command}
 */
export class MoveObjectCommand extends Command {

    // [ Public Functions ]

    /**
     * Execute
     *
     * @memberof MoveObjectCommand
     */
    execute () {
		this._oldParent.remove( this.object );
        let children = this._newParent.children;
        children.splice( this._newIndex, 0, this.object );
        this.object.parent = this._newParent;
        this._tool.signals.sceneGraphChanged.dispatch();
    }
    /**
     * Undo
     *
     * @memberof MoveObjectCommand
     */
	undo () {
        this._newParent.remove( this.object );
        let children = this._oldParent.children;
        children.splice( this._oldIndex, 0, this.object );
        this.object.parent = this._oldParent;
		this._tool.signals.sceneGraphChanged.dispatch();
	}
    /**
     * to JSON
     *
     * @returns {*}
     * @memberof MoveObjectCommand
     */
    toJSON () : any {
		let output              = super.toJSON();
		output.objectUuid       = this.object.uuid;
		output.newParentUuid    = this._newParent.uuid;
		output.oldParentUuid    = this._oldParent.uuid;
		output.newIndex         = this._newIndex;
		output.oldIndex         = this._oldIndex;
        return output;
    }
    /**
     * from JSON
     *
     * @param {*} json
     * @memberof MoveObjectCommand
     */
	fromJSON ( json:any ) {
		super.fromJSON( json );
		this.object     = this._tool.objectByUuid( json.objectUuid );
		this._oldParent  = this._tool.objectByUuid( json.oldParentUuid );
		if ( this._oldParent === undefined ) {
			this._oldParent = this._tool.scene.core;
		}
		this._newParent = this._tool.objectByUuid( json.newParentUuid );
		if ( this._newParent === undefined ) {
			this._newParent = this._tool.scene.core;
		}
		this._newIndex = json.newIndex;
		this._oldIndex = json.oldIndex;
	}

    // [ Constructor ]

    /**
     * Creates an instance of MoveObjectCommand.
     * @param {GL.Object3D} object
     * @param {GL.Object3D} [newParent]
     * @param {GL.Object3D} [newBefore]
     * @memberof MoveObjectCommand
     */
    constructor( object:GL.Object3D, newParent:GL.Object3D, newBefore:GL.Object3D ) {
        super();

        this.type       = 'MoveObjectCommand';
        this.name       = 'Move Object';
        this.object     = object;
	    this._oldParent = object.parent;
        this._oldIndex  = ( this._oldParent !== undefined ) ? this._oldParent.children.indexOf( this.object ) : 0;
        this._newParent = newParent;

        if ( newBefore !== undefined ) {
            this._newIndex = ( newParent !== undefined ) ? newParent.children.indexOf( newBefore ) : 0;
        } else {
            this._newIndex = ( newParent !== undefined ) ? newParent.children.length : 0;
        }

        if ( this._oldParent === this._newParent && this._newIndex > this._oldIndex ) {
            this._newIndex --;
        }

        if( newBefore ) this._newBefore = newBefore;
    }

    // [ Private Variables ]

     private _oldParent  : GL.Object3D;
     private _newParent  : GL.Object3D;
     private _newBefore  : GL.Object3D;
     private _oldIndex   : number;
     private _newIndex   : number;
}
