/**
 * GeometryDrawer
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

/**
 * GeometryDrawer.ts
 *
 * @export
 * @class GeometryDrawer
 * @extends {UIRow}
 */
export class GeometryDrawer extends UIRow {

    // [ Constructor ]

    constructor ( tool:ITool ) {
        super();

        let signals = tool.signals;

        // vertices

        let verticesRow = new UIRow();
        let vertices = new UIText();

        verticesRow.add( new UIText( 'Vertices' ).setWidth( '90px' ) );
        verticesRow.add( vertices );

        this.add( verticesRow );

        // faces

        let facesRow = new UIRow();
        let faces = new UIText();

        facesRow.add( new UIText( 'Faces' ).setWidth( '90px' ) );
        facesRow.add( faces );

        this.add( facesRow );

        //

        let update = ( object ) => {

            if ( object === null ) return; // objectSelected.dispatch( null )
            if ( object === undefined ) return;

            let geometry = object.geometry;

            if ( geometry instanceof GL.Geometry ) {

                this.setDisplay( 'block' );

                vertices.setValue( UNumber.toString( geometry.vertices.length ) );
                faces.setValue( UNumber.toString( geometry.faces.length ) );

            } else {

                this.setDisplay( 'none' );

            }

        }

        signals.objectSelected.add( update );
        signals.geometryChanged.add( update );
    }
}
