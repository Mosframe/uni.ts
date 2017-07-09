/**
 * TorusGeometryDrawer
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
 * TorusGeometryDrawer
 *
 * @export
 * @class TorusGeometryDrawer
 * @extends {UIRow}
 */
export class TorusGeometryDrawer extends UIRow {

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

        // tube

        let tubeRow = new UIRow();
        let tube = new UINumber( parameters.tube ).onChange( update );

        tubeRow.add( new UIText( 'Tube' ).setWidth( '90px' ) );
        tubeRow.add( tube );

        this.add( tubeRow );

        // radialSegments

        let radialSegmentsRow = new UIRow();
        let radialSegments = new UIInteger( parameters.radialSegments ).setRange( 1, Infinity ).onChange( update );

        radialSegmentsRow.add( new UIText( 'Radial segments' ).setWidth( '90px' ) );
        radialSegmentsRow.add( radialSegments );

        this.add( radialSegmentsRow );

        // tubularSegments

        let tubularSegmentsRow = new UIRow();
        let tubularSegments = new UIInteger( parameters.tubularSegments ).setRange( 1, Infinity ).onChange( update );

        tubularSegmentsRow.add( new UIText( 'Tubular segments' ).setWidth( '90px' ) );
        tubularSegmentsRow.add( tubularSegments );

        this.add( tubularSegmentsRow );

        // arc

        let arcRow = new UIRow();
        let arc = new UINumber( parameters.arc ).onChange( update );

        arcRow.add( new UIText( 'Arc' ).setWidth( '90px' ) );
        arcRow.add( arc );

        this.add( arcRow );


        //

        function update() {

            tool.execute( new SetGeometryCommand( object, new GL[ geometry.type ](
                radius.getValue(),
                tube.getValue(),
                radialSegments.getValue(),
                tubularSegments.getValue(),
                arc.getValue()
            ) ) );

        }

    }
}
