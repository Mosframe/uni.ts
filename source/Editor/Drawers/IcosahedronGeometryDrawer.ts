/**
 * IcosahedronGeometryDrawer
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { THREE                  }   from '../../Engine/Core';
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
 * IcosahedronGeometryDrawer
 *
 * @export
 * @class IcosahedronGeometryDrawer
 * @extends {UIRow}
 */
export class IcosahedronGeometryDrawer extends UIRow {

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

        // detail

        let detailRow = new UIRow();
        let detail = new UIInteger( parameters.detail ).setRange( 0, Infinity ).onChange( update );

        detailRow.add( new UIText( 'Detail' ).setWidth( '90px' ) );
        detailRow.add( detail );

        this.add( detailRow );


        //

        function update() {

            tool.execute( new SetGeometryCommand( object, new THREE[ geometry.type ](
                radius.getValue(),
                detail.getValue()
            ) ) );

            signals.objectChanged.dispatch( object );

        }

    }
}
