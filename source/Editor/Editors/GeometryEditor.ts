/**
 * GeometryEditor
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { GL                                 }   from '../../Engine/Graphic';
import { UIPanel                            }   from '../../Engine/UI/UIPanel';
import { UIButton                           }   from '../../Engine/UI/UIButton';
import { UINumber                           }   from '../../Engine/UI/UINumber';
import { UIDiv                              }   from '../../Engine/UI/UIDiv';
import { UISpan                             }   from '../../Engine/UI/UISpan';
import { UIRow                              }   from '../../Engine/UI/UIRow';
import { UIColor                            }   from '../../Engine/UI/UIColor';
import { UIText                             }   from '../../Engine/UI/UIText';
import { UIBreak                            }   from '../../Engine/UI/UIBreak';
import { UISelect                           }   from '../../Engine/UI/UISelect';
import { UIBoolean                          }   from '../../Engine/UI/UIBoolean';
import { UIInput                            }   from '../../Engine/UI/UIInput';
import { UICheckbox                         }   from '../../Engine/UI/UICheckbox';
import { UITextArea                         }   from '../../Engine/UI/UITextArea';
import { UIOutliner                         }   from '../UI/UIOutliner';
import { ITool                              }   from '../Interfaces';
import { ISignals                           }   from '../Interfaces';

import { SetGeometryValueCommand            }   from '../Commands/SetGeometryValueCommand';

import { GeometryDrawer                     }   from '../Drawers/GeometryDrawer';
import { BufferGeometryDrawer               }   from '../Drawers/BufferGeometryDrawer';
import { GeometryModifiersDrawer            }   from '../Drawers/GeometryModifiersDrawer';
import { BoxGeometryDrawer                  }   from '../Drawers/BoxGeometryDrawer';
import { BoxBufferGeometryDrawer            }   from '../Drawers/BoxBufferGeometryDrawer';
import { CircleGeometryDrawer               }   from '../Drawers/CircleGeometryDrawer';
import { CircleBufferGeometryDrawer         }   from '../Drawers/CircleBufferGeometryDrawer';
import { CylinderGeometryDrawer             }   from '../Drawers/CylinderGeometryDrawer';
import { CylinderBufferGeometryDrawer       }   from '../Drawers/CylinderBufferGeometryDrawer';
import { IcosahedronGeometryDrawer          }   from '../Drawers/IcosahedronGeometryDrawer';
import { IcosahedronBufferGeometryDrawer    }   from '../Drawers/IcosahedronBufferGeometryDrawer';
import { LatheGeometryDrawer                }   from '../Drawers/LatheGeometryDrawer';
import { LatheBufferGeometryDrawer          }   from '../Drawers/LatheBufferGeometryDrawer';
import { PlaneGeometryDrawer                }   from '../Drawers/PlaneGeometryDrawer';
import { PlaneBufferGeometryDrawer          }   from '../Drawers/PlaneBufferGeometryDrawer';
import { SphereGeometryDrawer               }   from '../Drawers/SphereGeometryDrawer';
import { SphereBufferGeometryDrawer         }   from '../Drawers/SphereBufferGeometryDrawer';
import { TorusGeometryDrawer                }   from '../Drawers/TorusGeometryDrawer';
import { TorusBufferGeometryDrawer          }   from '../Drawers/TorusBufferGeometryDrawer';
import { TorusKnotGeometryDrawer            }   from '../Drawers/TorusKnotGeometryDrawer';
import { TorusKnotBufferGeometryDrawer      }   from '../Drawers/TorusKnotBufferGeometryDrawer';


/**
 * GeometryEditor
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 * @export
 * @class GeometryEditor
 * @extends {UIPanel}
 */
export class GeometryEditor extends UIPanel {

    // [ Constructor ]

    constructor ( tool:ITool ) {
        super( 'geometry' );

        this.setBorderTop( '0' );
        this.setPaddingTop( '20px' );
        this.setPaddingRight( '0px' );

        let geometryTypeRow = new UIRow();
        let geometryType = new UIText();

        geometryTypeRow.add( new UIText( 'Type' ).setWidth( '90px' ) );
        geometryTypeRow.add( geometryType );

        this.add( geometryTypeRow );

        // uuid

        let geometryUUIDRow = new UIRow();
        let geometryUUID = new UIInput().setWidth( '102px' ).setFontSize( '12px' ).setDisabled( true );
        let geometryUUIDRenew = new UIButton( 'New' ).setMarginLeft( '7px' ).onClick( () => {

            geometryUUID.setValue( GL.Math.generateUUID() );
            tool.execute( new SetGeometryValueCommand( tool.selected, 'uuid', geometryUUID.getValue() ) );
        });

        geometryUUIDRow.add( new UIText( 'UUID' ).setWidth( '90px' ) );
        geometryUUIDRow.add( geometryUUID );
        geometryUUIDRow.add( geometryUUIDRenew );

        this.add( geometryUUIDRow );

        // name

        let geometryNameRow = new UIRow();
        let geometryName = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( () => {

            tool.execute( new SetGeometryValueCommand( tool.selected, 'name', geometryName.getValue() ) );
        });

        geometryNameRow.add( new UIText( 'Name' ).setWidth( '90px' ) );
        geometryNameRow.add( geometryName );

        this.add( geometryNameRow );

        // geometry

        this.add( new GeometryDrawer( tool ) );

        // buffergeometry

        this.add( new BufferGeometryDrawer( tool ) );

        // parameters

        let parameters = new UISpan();
        this.add( parameters );


        let build = () => {

            let object = <any>tool.selected;
            if ( object && object.geometry ) {

                let geometry:GL.Geometry = object.geometry;

                this.setDisplay( 'block' );

                geometryType.setValue( geometry.type );
                geometryUUID.setValue( geometry.uuid );
                geometryName.setValue( geometry.name );

                //
                parameters.clear();

                switch( geometry.type ) {

                case 'Geometry'                     : parameters.add( new GeometryModifiersDrawer         ( tool, object ) ); break;
                case 'BoxGeometry'                  : parameters.add( new BoxGeometryDrawer               ( tool, object ) ); break;
                case 'CircleGeometry'               : parameters.add( new CircleGeometryDrawer            ( tool, object ) ); break;
                case 'CylinderGeometry'             : parameters.add( new CylinderGeometryDrawer          ( tool, object ) ); break;
                case 'IcosahedronGeometry'          : parameters.add( new IcosahedronGeometryDrawer       ( tool, object ) ); break;
                case 'LatheGeometry'                : parameters.add( new LatheGeometryDrawer             ( tool, object ) ); break;
                case 'PlaneGeometry'                : parameters.add( new PlaneGeometryDrawer             ( tool, object ) ); break;
                case 'SphereGeometry'               : parameters.add( new SphereGeometryDrawer            ( tool, object ) ); break;
                case 'TorusGeometry'                : parameters.add( new TorusGeometryDrawer             ( tool, object ) ); break;
                case 'TorusKnotGeometry'            : parameters.add( new TorusKnotGeometryDrawer         ( tool, object ) ); break;

                case 'BufferGeometry'               : parameters.add( new GeometryModifiersDrawer         ( tool, object ) ); break;
                case 'BoxBufferGeometry'            : parameters.add( new BoxBufferGeometryDrawer         ( tool, object ) ); break;
                case 'CircleBufferGeometry'         : parameters.add( new CircleBufferGeometryDrawer      ( tool, object ) ); break;
                case 'CylinderBufferGeometry'       : parameters.add( new CylinderBufferGeometryDrawer    ( tool, object ) ); break;
                case 'IcosahedronBufferGeometry'    : parameters.add( new IcosahedronBufferGeometryDrawer ( tool, object ) ); break;
                case 'LatheBufferGeometry'          : parameters.add( new LatheBufferGeometryDrawer       ( tool, object ) ); break;
                case 'PlaneBufferGeometry'          : parameters.add( new PlaneBufferGeometryDrawer       ( tool, object ) ); break;
                case 'SphereBufferGeometry'         : parameters.add( new SphereBufferGeometryDrawer      ( tool, object ) ); break;
                case 'TorusBufferGeometry'          : parameters.add( new TorusBufferGeometryDrawer       ( tool, object ) ); break;
                case 'TorusKnotBufferGeometry'      : parameters.add( new TorusKnotBufferGeometryDrawer   ( tool, object ) ); break;
                }

            } else {
                this.setDisplay( 'none' );
            }
        }

        tool.signals.objectSelected.add( build );
        tool.signals.geometryChanged.add( build );
    }
}
