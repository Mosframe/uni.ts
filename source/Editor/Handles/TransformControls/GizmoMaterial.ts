/**
 * GizmoMaterial
 *
 * @author arodic ( https://github.com/arodic )
 * @author mosframe / https://github.com/mosframe
 */

import { GL }   from '../../../Engine/Graphic';

/**
 * GizmoMaterial
 *
 * @export
 * @class GizmoMaterial
 * @extends {GL.MeshBasicMaterial}
 */
export class GizmoMaterial extends GL.MeshBasicMaterial {

    // [ Public Functions ]

    highlight ( highlighted:boolean ) {
        if ( highlighted ) {
            this.color.setRGB( 1, 1, 0 );
            this.opacity = 1;
        } else {
            this.color.copy( this._oldColor );
            this.opacity = this._oldOpacity;
        }
    }

    // [ Constructor ]

    constructor ( parameters?:GL.MeshBasicMaterialParameters ) {
        super(parameters);

		this.depthTest      = false;
		this.depthWrite     = false;
		this.side           = GL.FrontSide;
		this.transparent    = true;
        if( parameters ) this.setValues( parameters );
		this._oldColor      = this.color.clone();
		this._oldOpacity    = this.opacity;
    }

    // [ Private Veriables ]

    private _oldColor    : GL.Color;
    private _oldOpacity  : number;
}

export let pickerMaterial = new GizmoMaterial( { visible: false, transparent: false } );
