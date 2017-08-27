/**
 * BufferGeometryDrawer.ts
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

/**
 * BufferGeometryDrawer
 *
 * @export
 * @class BufferGeometryDrawer
 * @extends {EditorRow}
 */
export class BufferGeometryDrawer extends UIRow {

    // [ Constructor ]

    constructor ( tool:ITool ) {
        super();

        let update = ( object ) => {

            if ( object === null ) return; // objectSelected.dispatch( null )
            if ( object === undefined ) return;

            let geometry = object.geometry;
            if ( geometry instanceof THREE.BufferGeometry ) {

                this.clear();
                this.setDisplay( 'block' );

                let index = geometry.index;
                if ( index !== null ) {

                    let panel = new UIRow();
                    panel.add( new UIText( 'index' ).setWidth( '90px' ) );
                    panel.add( new UIText( UNumber.toString( index.count ) ).setFontSize( '12px' ) );
                    this.add( panel );
                }

                let attributes = geometry.attributes;

                for ( let name in attributes ) {

                    let attribute = attributes[ name ];

                    let panel = new UIRow();
                    panel.add( new UIText( name ).setWidth( '90px' ) );
                    panel.add( new UIText( UNumber.toString( attribute.count ) + ' (' + attribute.itemSize + ')' ).setFontSize( '12px' ) );
                    this.add( panel );
                }
            } else {
                this.setDisplay( 'none' );
            }
        }

        tool.signals.objectSelected.add( update );
        tool.signals.geometryChanged.add( update );
    }
}
