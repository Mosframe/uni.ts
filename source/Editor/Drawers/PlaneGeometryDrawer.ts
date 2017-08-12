/**
 * PlaneGeometryDrawer
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
 * PlaneGeometryDrawer
 *
 * @export
 * @class PlaneGeometryDrawer
 * @extends {UIRow}
 */
export class PlaneGeometryDrawer extends UIRow {

    // [ Constructor ]

    constructor ( tool:ITool, object:any ) {
        super();

        let signals = tool.signals;
        let geometry = object.geometry;
        let parameters = geometry.parameters;

        // width

        let widthRow = new UIRow();
        let width = new UINumber( parameters.width ).onChange( update );

        widthRow.add( new UIText( 'Width' ).setWidth( '90px' ) );
        widthRow.add( width );

        this.add( widthRow );

        // height

        let heightRow = new UIRow();
        let height = new UINumber( parameters.height ).onChange( update );

        heightRow.add( new UIText( 'Height' ).setWidth( '90px' ) );
        heightRow.add( height );

        this.add( heightRow );

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


        //

        function update() {

            tool.execute( new SetGeometryCommand( object, new GL[ geometry.type ](
                width.getValue(),
                height.getValue(),
                widthSegments.getValue(),
                heightSegments.getValue()
            ) ) );
        }
    }
}
