/**
 * BoxGeometryDrawer
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { THREE                  }   from '../../Engine/Core';
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
 * BoxGeometryDrawer
 *
 * @export
 * @class BoxGeometryDrawer
 * @extends {UIRow}
 */
export class BoxGeometryDrawer extends UIRow {

    // [ Constructor ]

    constructor ( tool:ITool, object:any ) {
        super();

        let geometry    = object.geometry;
        let parameters  = geometry.parameters;

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

        // depth

        let depthRow = new UIRow();
        let depth = new UINumber( parameters.depth ).onChange( update );
        depthRow.add( new UIText( 'Depth' ).setWidth( '90px' ) );
        depthRow.add( depth );
        this.add( depthRow );

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

        // depthSegments

        let depthSegmentsRow = new UIRow();
        let depthSegments = new UIInteger( parameters.depthSegments ).setRange( 1, Infinity ).onChange( update );
        depthSegmentsRow.add( new UIText( 'Depth segments' ).setWidth( '90px' ) );
        depthSegmentsRow.add( depthSegments );
        this.add( depthSegmentsRow );

        function update () {

            tool.execute( new SetGeometryCommand( object, new THREE[ geometry.type ](
                width.getValue(),
                height.getValue(),
                depth.getValue(),
                widthSegments.getValue(),
                heightSegments.getValue(),
                depthSegments.getValue()
            )));
        }
    }
}
