/**
 * SphereGeometryDrawer
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import * as GL                      from '../../Engine/Graphic';
import { UNumber                }   from '../../Engine/UNumber';
import { UIPanel                }   from '../../Engine/UI/UIPanel';
import { UIButton               }   from '../../Engine/UI/UIButton';
import { UINumber               }   from '../../Engine/UI/UINumber';
import { UIDiv                  }   from '../../Engine/UI/UIDiv';
import { UISpan                 }   from '../../Engine/UI/UISpan';
import { UIRow                  }   from '../../Engine/UI/UIRow';
import { UIColor                }   from '../../Engine/UI/UIColor';
import { UIText                 }   from '../../Engine/UI/UIText';
import { UIBreak                }   from '../../Engine/UI/UIBreak';
import { UISelect               }   from '../../Engine/UI/UISelect';
import { UIBoolean              }   from '../../Engine/UI/UIBoolean';
import { UIInput                }   from '../../Engine/UI/UIInput';
import { UICheckbox             }   from '../../Engine/UI/UICheckbox';
import { UITextArea             }   from '../../Engine/UI/UITextArea';
import { UIInteger              }   from '../../Engine/UI/UIInteger';
import { UIOutliner             }   from '../UI/UIOutliner';
import { ITool                  }   from '../Interfaces';
import { ISignals               }   from '../Interfaces';

import { SetGeometryCommand     }   from '../Commands/SetGeometryCommand';

/**
 * SphereGeometryDrawer
 *
 * @export
 * @class SphereGeometryDrawer
 * @extends {UIRow}
 */
export class SphereGeometryDrawer extends UIRow {

    // [ Constructor ]

    constructor ( tool:ITool, object:any ) {
        super();

        let signals = tool.signals;
        let geometry = object.geometry;
        let parameters = geometry.parameters;

        // radius

        let radiusRow = new UIRow();
        let radius = new UINumber( parameters.radius ).onChange( update );

        radiusRow.add( new UIText( 'Radius' ).setWidth( '90px' ) );
        radiusRow.add( radius );

        this.add( radiusRow );

        // widthSegments

        let widthSegmentsRow = new UIRow();
        let widthSegments = new UIInteger( parameters.widthSegments ).setRange( 1, Infinity ).onChange( update );

        widthSegmentsRow.add( new UIText( 'Width segments' ).setWidth( '90px' ) );
        widthSegmentsRow.add( widthSegments );

        this.add( widthSegmentsRow );

        // heightSegments

        let heightSegmentsRow = new UIRow();
        let heightSegments = new UIInteger( parameters.heightSegments ).setRange( 1, Infinity ).onChange( update );

        heightSegmentsRow.add( new UIText( 'Height segments' ).setWidth( '90px' ) );
        heightSegmentsRow.add( heightSegments );

        this.add( heightSegmentsRow );

        // phiStart

        let phiStartRow = new UIRow();
        let phiStart = new UINumber( parameters.phiStart ).onChange( update );

        phiStartRow.add( new UIText( 'Phi start' ).setWidth( '90px' ) );
        phiStartRow.add( phiStart );

        this.add( phiStartRow );

        // phiLength

        let phiLengthRow = new UIRow();
        let phiLength = new UINumber( parameters.phiLength ).onChange( update );

        phiLengthRow.add( new UIText( 'Phi length' ).setWidth( '90px' ) );
        phiLengthRow.add( phiLength );

        this.add( phiLengthRow );

        // thetaStart

        let thetaStartRow = new UIRow();
        let thetaStart = new UINumber( parameters.thetaStart ).onChange( update );

        thetaStartRow.add( new UIText( 'Theta start' ).setWidth( '90px' ) );
        thetaStartRow.add( thetaStart );

        this.add( thetaStartRow );

        // thetaLength

        let thetaLengthRow = new UIRow();
        let thetaLength = new UINumber( parameters.thetaLength ).onChange( update );

        thetaLengthRow.add( new UIText( 'Theta length' ).setWidth( '90px' ) );
        thetaLengthRow.add( thetaLength );

        this.add( thetaLengthRow );


        //

        function update() {

            tool.execute( new SetGeometryCommand( object, new GL[ geometry.type ](
                radius.getValue(),
                widthSegments.getValue(),
                heightSegments.getValue(),
                phiStart.getValue(),
                phiLength.getValue(),
                thetaStart.getValue(),
                thetaLength.getValue()
            ) ) );
        }
    }
}
