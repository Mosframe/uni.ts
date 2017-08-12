/**
 * GizmoLineMaterial.ts
 *
 * @author arodic ( https://github.com/arodic )
 * @author mosframe / https://github.com/mosframe
 */

import { GL }   from '../../../Engine/Graphic';

/**
 * GizmoLineMaterial
 *
 * @export
 * @class GizmoLineMaterial
 * @extends {GL.LineBasicMaterial}
 */
export class GizmoLineMaterial extends GL.LineBasicMaterial {

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

    constructor(parameters?: GL.LineBasicMaterialParameters) {
        super(parameters);

		this.depthTest      = false;
		this.depthWrite     = false;
		this.transparent    = true;
		this.linewidth      = 1;
		if( parameters ) this.setValues( parameters );

		this._oldColor      = this.color.clone();
		this._oldOpacity    = this.opacity;
    }

    // [ Private Veriables ]

    private _oldColor    : GL.Color;
    private _oldOpacity  : number;
}

