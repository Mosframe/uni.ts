/**
 * ViewportInfo.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { GL         }   from '../Engine/Graphic';
import { UNumber	}   from '../Engine/UNumber';
import { UIPanel    }   from '../Engine/UI/UIPanel';
import { UIText     }   from '../Engine/UI/UIText';
import { UIBreak    }   from '../Engine/UI/UIBreak';
import { ITool      }   from './Interfaces';

/**
 * Viewport Info
 *
 * @export
 * @class ViewportInfo
 * @extends {UIPanel}
 */
export class ViewportInfo extends UIPanel {

    // [ Constructor ]

    constructor( tool:ITool ) {
        super();

        this.setId          ( 'info'        );
        this.setPosition    ( 'absolute'    );
        this.setLeft        ( '10px'        );
        this.setBottom      ( '10px'        );
        this.setFontSize    ( '12px'        );
        this.setColor       ( '#fff'        );

        let objectsText     = new UIText( '0' ).setMarginLeft( '6px' );
        let verticesText    = new UIText( '0' ).setMarginLeft( '6px' );
        let trianglesText   = new UIText( '0' ).setMarginLeft( '6px' );

        this.add( new UIText( 'objects'     ), objectsText  , new UIBreak() );
        this.add( new UIText( 'vertices'    ), verticesText , new UIBreak() );
        this.add( new UIText( 'triangles'   ), trianglesText, new UIBreak() );

        tool.signals.objectAdded     .add( update );
        tool.signals.objectRemoved   .add( update );
        tool.signals.geometryChanged .add( update );

        function update () {

            let objects     = 0;
            let vertices    = 0;
            let triangles   = 0;

            for( let i=0, l=tool.scene.core.children.length; i < l; i++ ) {

                let object = tool.scene.core.children[ i ];

                object.traverseVisible( ( object ) => {

                    objects++;

                    if ( object instanceof GL.Mesh ) {

                        let geometry = object.geometry;
                        if ( geometry instanceof GL.Geometry ) {

                            vertices    += geometry.vertices.length;
                            triangles   += geometry.faces.length;
                        }
                        else
                        if ( geometry instanceof GL.BufferGeometry ) {

                            if ( geometry.index !== null ) {
                                vertices    += geometry.index.count * 3;
                                triangles   += geometry.index.count;
                            } else {
                                vertices    += geometry.attributes.length;
                                triangles   += geometry.attributes.length / 3;
                            }
                        }
                    }
                });
            }

            objectsText    .setValue( UNumber.toString(objects) );
            verticesText   .setValue( UNumber.toString(vertices) );
            trianglesText  .setValue( UNumber.toString(triangles) );
        }
    }
}
