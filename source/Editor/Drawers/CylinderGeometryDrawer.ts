/**
 * CylinderGeometryDrawer
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { GL                     }   from '../../Engine/Graphic';
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
 * CylinderGeometryDrawer
 *
 * @export
 * @class CylinderGeometryDrawer
 * @extends {UIRow}
 */
export class CylinderGeometryDrawer extends UIRow {

    // [ Constructor ]

    constructor ( tool:ITool, object:any ) {
        super();

        let signals = tool.signals;

        let geometry = object.geometry;
        let parameters = geometry.parameters;

        // radiusTop

        let radiusTopRow = new UIRow();
        let radiusTop = new UINumber( parameters.radiusTop ).onChange( update );

        radiusTopRow.add( new UIText( 'Radius top' ).setWidth( '90px' ) );
        radiusTopRow.add( radiusTop );

        this.add( radiusTopRow );

        // radiusBottom

        let radiusBottomRow = new UIRow();
        let radiusBottom = new UINumber( parameters.radiusBottom ).onChange( update );

        radiusBottomRow.add( new UIText( 'Radius bottom' ).setWidth( '90px' ) );
        radiusBottomRow.add( radiusBottom );

        this.add( radiusBottomRow );

        // height

        let heightRow = new UIRow();
        let height = new UINumber( parameters.height ).onChange( update );

        heightRow.add( new UIText( 'Height' ).setWidth( '90px' ) );
        heightRow.add( height );

        this.add( heightRow );

        // radialSegments

        let radialSegmentsRow = new UIRow();
        let radialSegments = new UIInteger( parameters.radialSegments ).setRange( 1, Infinity ).onChange( update );

        radialSegmentsRow.add( new UIText( 'Radial segments' ).setWidth( '90px' ) );
        radialSegmentsRow.add( radialSegments );

        this.add( radialSegmentsRow );

        // heightSegments

        let heightSegmentsRow = new UIRow();
        let heightSegments = new UIInteger( parameters.heightSegments ).setRange( 1, Infinity ).onChange( update );

        heightSegmentsRow.add( new UIText( 'Height segments' ).setWidth( '90px' ) );
        heightSegmentsRow.add( heightSegments );

        this.add( heightSegmentsRow );

        // openEnded

        let openEndedRow = new UIRow();
        let openEnded = new UICheckbox( parameters.openEnded ).onChange( update );

        openEndedRow.add( new UIText( 'Open ended' ).setWidth( '90px' ) );
        openEndedRow.add( openEnded );

        this.add( openEndedRow );

        //

        function update() {

            tool.execute( new SetGeometryCommand( object, new GL[ geometry.type ](
                radiusTop.getValue(),
                radiusBottom.getValue(),
                height.getValue(),
                radialSegments.getValue(),
                heightSegments.getValue(),
                openEnded.getValue()
            ) ) );

        }

    }
}
