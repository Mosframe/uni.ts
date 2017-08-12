/**
 * HTMLTexture.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { GL             } from '../Graphic';
import { HTML2Canvas    }   from './HTML2Canvas';

/**
 * HTML Texture
 *
 * @export
 * @class HTMLTexture
 * @extends {GL.CanvasTexture}
 */
export class HTMLTexture extends GL.CanvasTexture {

 	update () {

 		console.log( 'HTMLTexture ', this, this._dom );

 		this.image = HTML2Canvas( this._dom );
 		this.needsUpdate = true;
 	}

    constructor ( dom:HTMLElement ) {

        super( HTML2Canvas(dom) );

        this._dom       = dom;
        this.anisotropy = 16;
    }

    private _dom : HTMLElement;
}
