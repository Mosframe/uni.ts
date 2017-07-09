/**
 * GeometryModifiersDrawer
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

/**
 * GeometryModifiersDrawer
 *
 * @export
 * @class GeometryModifiersDrawer
 * @extends {UIRow}
 */
export class GeometryModifiersDrawer extends UIRow {

    // [ Constructor ]

    constructor ( tool:ITool, object:any ) {
        super();

        let signals = tool.signals;

        this.setPaddingLeft( '90px' );

        let geometry = object.geometry;

        // Compute Vertex Normals

        let button = new UIButton( 'Compute Vertex Normals' );
        button.onClick( () => {

            geometry.computeVertexNormals();

            if ( geometry instanceof GL.BufferGeometry ) {
                let attributes:any = geometry.attributes;
                attributes.normal.needsUpdate = true;

            } else {

                geometry.normalsNeedUpdate = true;

            }

            signals.geometryChanged.dispatch( object );

        });

        this.add( button );
    }
}
