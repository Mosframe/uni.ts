/**
 * GizmoLineMaterial.ts
 *
 * @author arodic ( https://github.com/arodic )
 * @author mosframe / https://github.com/mosframe
 */

import { THREE }   from '../../../Engine/Core';

/**
 * GizmoLineMaterial
 *
 * @export
 * @class GizmoLineMaterial
 * @extends {GL.LineBasicMaterial}
 */
export class GizmoLineMaterial extends THREE.LineBasicMaterial {

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

    constructor(parameters?: THREE.LineBasicMaterialParameters) {
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

    private _oldColor    : THREE.Color;
    private _oldOpacity  : number;
}

