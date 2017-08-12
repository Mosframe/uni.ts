/**
 * LatheGeometryDrawer
 *
 * @author rfm1201
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
 * LatheGeometryDrawer
 *
 * @export
 * @class LatheGeometryDrawer
 * @extends {UIRow}
 */
export class LatheGeometryDrawer extends UIRow {

    // [ Constructor ]

    constructor ( tool:ITool, object:any ) {
        super();

        let signals = tool.signals;
        let geometry = object.geometry;
        let parameters = geometry.parameters;

        // segments

        let segmentsRow = new UIRow();
        let segments = new UIInteger( parameters.segments ).onChange( update );

        segmentsRow.add( new UIText( 'Segments' ).setWidth( '90px' ) );
        segmentsRow.add( segments );

        this.add( segmentsRow );

        // phiStart

        let phiStartRow = new UIRow();
        let phiStart = new UINumber( parameters.phiStart * 180 / Math.PI ).onChange( update );

        phiStartRow.add( new UIText( 'Phi start (°)' ).setWidth( '90px' ) );
        phiStartRow.add( phiStart );

        this.add( phiStartRow );

        // phiLength

        let phiLengthRow = new UIRow();
        let phiLength = new UINumber( parameters.phiLength * 180 / Math.PI ).onChange( update );

        phiLengthRow.add( new UIText( 'Phi length (°)' ).setWidth( '90px' ) );
        phiLengthRow.add( phiLength );

        this.add( phiLengthRow );

        // points

        let lastPointIdx = 0;
        let pointsUI : any = [];

        let pointsRow = new UIRow();
        pointsRow.add( new UIText( 'Points' ).setWidth( '90px' ) );

        let points = new UISpan().setDisplay( 'inline-block' );
        pointsRow.add( points );

        let pointsList = new UIDiv();
        points.add( pointsList );

        for ( let i = 0; i < parameters.points.length; i ++ ) {

            let point = parameters.points[ i ];
            pointsList.add( createPointRow( point.x, point.y ) );

        }

        let addPointButton = new UIButton( '+' ).onClick( function() {

            if( pointsUI.length === 0 ){

                pointsList.add( createPointRow( 0, 0 ) );

            } else {

                let point = pointsUI[ pointsUI.length - 1 ];

                pointsList.add( createPointRow( point.x.getValue(), point.y.getValue() ) );

            }

            update();

        });
        points.add( addPointButton );

        this.add( pointsRow );

        //

        function createPointRow( x, y ) {

            let pointRow = new UIDiv();
            let lbl = new UIText( (lastPointIdx + 1).toString() ).setWidth( '20px' );
            let txtX = new UINumber( x ).setRange( 0, Infinity ).setWidth( '40px' ).onChange( update );
            let txtY = new UINumber( y ).setWidth( '40px' ).onChange( update );
            let idx = lastPointIdx;
            let btn = new UIButton( '-' ).onClick( function() {

                deletePointRow( idx );

            } );

            pointsUI.push( { row: pointRow, lbl: lbl, x: txtX, y: txtY } );
            lastPointIdx ++;
            pointRow.add( lbl, txtX, txtY, btn );

            return pointRow;

        }

        function deletePointRow( idx ) {

            if ( ! pointsUI[ idx ] ) return;

            pointsList.remove( pointsUI[ idx ].row );
            pointsUI[ idx ] = null;

            update();

        }

        function update() {

            let points : any = [];
            let count = 0;

            for ( let i = 0; i < pointsUI.length; i ++ ) {

                let pointUI = pointsUI[ i ];

                if ( ! pointUI ) continue;

                points.push( new GL.Vector2( pointUI.x.getValue(), pointUI.y.getValue() ) );
                count ++;
                pointUI.lbl.setValue( count );
            }

            tool.execute( new SetGeometryCommand( object, new GL[ geometry.type ](
                points,
                segments.getValue(),
                phiStart.getValue() / 180 * Math.PI,
                phiLength.getValue() / 180 * Math.PI
            )));
        }
    }
}
