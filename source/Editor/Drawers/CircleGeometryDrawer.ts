/**
 * CircleGeometryDrawer
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
 * CircleGeometryDrawer
 *
 * @export
 * @class CircleGeometryDrawer
 * @extends {UIRow}
 */
export class CircleGeometryDrawer extends UIRow {

    // [ Constructor ]

    constructor ( tool:ITool, object:any ) {
        super();

        let signals     = tool.signals;
        let geometry    = object.geometry;
        let parameters  = geometry.parameters;

        // radius

        let radiusRow = new UIRow();
        let radius = new UINumber( parameters.radius ).onChange( update );

        radiusRow.add( new UIText( 'Radius' ).setWidth( '90px' ) );
        radiusRow.add( radius );

        this.add( radiusRow );

        // segments

        let segmentsRow = new UIRow();
        let segments = new UIInteger( parameters.segments ).setRange( 3, Infinity ).onChange( update );

        segmentsRow.add( new UIText( 'Segments' ).setWidth( '90px' ) );
        segmentsRow.add( segments );

        this.add( segmentsRow );

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
                segments.getValue(),
                thetaStart.getValue(),
                thetaLength.getValue()
            ) ) );
        }
    }
}
