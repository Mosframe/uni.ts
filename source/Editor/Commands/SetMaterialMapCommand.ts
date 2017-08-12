/**
 * SetMaterialMapCommand.ts
 *
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 *
 * @author dforrer / https://github.com/dforrer
 * @author mosframe / https://github.com/mosframe
 */

import { GL         }   from '../../Engine/Graphic';
import { Command    }   from './Command';

/**
 * SetMaterialMapCommand
 *
 * @export
 * @class SetMaterialMapCommand
 * @extends {Command}
 */
export class SetMaterialMapCommand extends Command {

    // [ Public Variables ]

    object : any;

    // [ Public Functions ]

    execute () {
		this.object.material[ this._mapName ] = this._newMap;
		this.object.material.needsUpdate = true;
		this._tool.signals.materialChanged.dispatch( this.object.material );
    }

    undo () {
		this.object.material[ this._mapName ] = this._oldMap;
		this.object.material.needsUpdate = true;
		this._tool.signals.materialChanged.dispatch( this.object.material );
    }

    toJSON () : any {
        let output          = super.toJSON();
		output.objectUuid   = this.object.uuid;
		output.mapName      = this._mapName;
		output.newMap       = this._serializeMap( this._newMap );
		output.oldMap       = this._serializeMap( this._oldMap );
        return output;
    }

	fromJSON ( json:any ) {
        super.fromJSON( json );
		this.object     = this._tool.objectByUuid( json.objectUuid );
		this._mapName   = json.mapName;
		this._oldMap    = this._parseTexture( json.oldMap );
		this._newMap    = this._parseTexture( json.newMap );
	}

    // [ Constructor ]

    constructor( object:any, mapName:string, newMap:GL.Texture ) {
        super();

        this.type       = 'SetMaterialMapCommand';
        this.name       = 'Set Material.' + mapName;
        this.object     = object;
        this._mapName   = mapName;
        this._oldMap    = ( object !== undefined ) ? object.material[ mapName ] : undefined;
        this._newMap    = newMap;
    }

    // [ Private Variables ]

    private _mapName    : string;
    private _oldMap     : GL.Texture;
    private _newMap     : GL.Texture;

    // [ Private Functions ]

    private _serializeMap ( map:any ) {

        if ( map === null || map === undefined ) return null;

        let meta = {
            geometries  : {},
            materials   : {},
            textures    : {},
            images      : {}
        };

        let json = map.toJSON( meta );
        let images = this._extractFromCache( meta.images );
        if ( images.length > 0 ) json.images = images;
        json.sourceFile = map.sourceFile;

        return json;
    }

    private _extractFromCache = ( cache:any ) => {

        let values : any = [];
        for ( let key in cache ) {

            let data = cache[ key ];
            delete data.metadata;
            values.push( data );
        }
        return values;
    }

    private _parseTexture = ( json:any ) => {

        let map : any = null;
        if ( json !== null ) {
            let loader      = new GL.ObjectLoader();
            let images      = loader.parseImages( json.images, ()=>{} );
            let textures    = loader.parseTextures( [ json ], images );
            map = textures[ json.uuid ];
            map.sourceFile = json.sourceFile;
        }
        return map;
    }
}
