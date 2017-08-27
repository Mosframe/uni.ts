/**
 * SetMaterialCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { THREE      }   from '../../Engine/Core';
import { Command    }   from './Command';

/**
 * SetMaterialCommand
 *
 * @export
 * @class SetMaterialCommand
 * @extends {Command}
 */
export class SetMaterialCommand extends Command {

    // [ Public Variables ]

    object : any;

    // [ Public Functions ]

    execute () {
		this.object.material = this._newMaterial;
		this._tool.signals.materialChanged.dispatch( this._newMaterial );
    }

    undo () {
		this.object.material = this._oldMaterial;
		this._tool.signals.materialChanged.dispatch( this._oldMaterial );
    }

    toJSON () : any {
        let output          = super.toJSON();
		output.objectUuid   = this.object.uuid;
		output.oldMaterial  = this._oldMaterial.toJSON();
		output.newMaterial  = this._newMaterial.toJSON();
        return output;
    }

	fromJSON ( json:any ) {
        super.fromJSON( json );

		this.object         = this._tool.objectByUuid( json.objectUuid );
		this._oldMaterial   = this._parseMaterial( json.oldMaterial );
		this._newMaterial   = this._parseMaterial( json.newMaterial );
	}

    // [ Constructor ]

    constructor( object:any, newMaterial:THREE.Material ) {
        super();

        this.type           = 'SetMaterialCommand';
        this.name           = 'New Material';
        this.object         = object;
        this._oldMaterial   = ( object !== undefined ) ? object.material : undefined;
        this._newMaterial   = newMaterial;
    }

    // [ Private Variables ]

    private _oldMaterial : THREE.Material;
    private _newMaterial : THREE.Material;

    // [ Private Functions ]

    private _parseMaterial ( json:any ) {

        let loader      = new THREE.ObjectLoader();
        let images      = loader.parseImages( json.images, () => {} );
        let textures    = loader.parseTextures( json.textures, images );
        let materials   = loader.parseMaterials( [ json ], textures );
        return materials[ json.uuid ];
    }
}
