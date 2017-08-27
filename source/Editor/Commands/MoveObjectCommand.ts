/**
 * MoveObjectCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { THREE      }   from '../../Engine/Core';
import { GameObject }   from '../../Engine/GameObject';
import { Command    }   from './Command';

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
		//this._oldParent.remove( this.object );
        //let children = this._newParent.children;
        //children.splice( this._newIndex, 0, this.object );
        //this.object.parent = this._newParent;

        console.log( 'scale', this.object.getWorldScale() );

        THREE.SceneUtils.detach( this.object, this._oldParent, this._tool.scene.core );
        THREE.SceneUtils.attach( this.object, this._tool.scene.core, this._newParent );

        console.log( 'scale', this.object.getWorldScale() );

        /*
        let gameObject = <GameObject>this._tool.scene.findUbjectByUUID(this.object.uuid);
        if( gameObject !== undefined ) {
            let newParent = <GameObject>this._tool.scene.findUbjectByUUID(this._newParent.uuid);
            if( newParent !== undefined ) {
                gameObject.transform.setParent( newParent.transform );
            } else {
                gameObject.transform.setParent( undefined );
            }
        }
        */

        this._tool.signals.sceneGraphChanged.dispatch();
    }
    /**
     * Undo
     *
     * @memberof MoveObjectCommand
     */
	undo () {
        //this._newParent.remove( this.object );
        //let children = this._oldParent.children;
        //children.splice( this._oldIndex, 0, this.object );
        //this.object.parent = this._oldParent;

        console.log( 'scale', this.object.getWorldScale() );

        THREE.SceneUtils.detach( this.object, this._newParent, this._tool.scene.core );
        THREE.SceneUtils.attach( this.object, this._tool.scene.core, this._oldParent );

        console.log( 'scale', this.object.getWorldScale() );
        /*
        let gameObject = <GameObject>this._tool.scene.findUbjectByUUID(this.object.uuid);
        if( gameObject !== undefined ) {
            let oldParent = <GameObject>this._tool.scene.findUbjectByUUID(this._oldParent.uuid);
            if( oldParent !== undefined ) {
                gameObject.transform.setParent( oldParent.transform );
            } else {
                gameObject.transform.setParent( undefined );
            }
        }
        */

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
     * @param {THREE.Object3D} object
     * @param {THREE.Object3D} [newParent]
     * @param {THREE.Object3D} [newBefore]
     * @memberof MoveObjectCommand
     */
    constructor( object:THREE.Object3D, newParent:THREE.Object3D, newBefore:THREE.Object3D ) {
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
            --this._newIndex;
        }
    }

    // [ Private Variables ]

     private _oldParent  : THREE.Object3D;
     private _newParent  : THREE.Object3D;
     private _oldIndex   : number;
     private _newIndex   : number;
}
