/**
 * ProjectEditor.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { THREE          }   from '../../Engine/Core';
import { System         }   from '../../Engine/System';
import { UIPanel        }   from '../../Engine/UI/UIPanel';
import { UIButton       }   from '../../Engine/UI/UIButton';
import { UINumber       }   from '../../Engine/UI/UINumber';
import { UIDiv          }   from '../../Engine/UI/UIDiv';
import { UISpan         }   from '../../Engine/UI/UISpan';
import { UIRow          }   from '../../Engine/UI/UIRow';
import { UIColor        }   from '../../Engine/UI/UIColor';
import { UIText         }   from '../../Engine/UI/UIText';
import { UIBreak        }   from '../../Engine/UI/UIBreak';
import { UISelect       }   from '../../Engine/UI/UISelect';
import { UIBoolean      }   from '../../Engine/UI/UIBoolean';
import { UICheckbox     }   from '../../Engine/UI/UICheckbox';
import { UIOutliner     }   from '../UI/UIOutliner';
import { ITool          }   from '../Interfaces';
import { ISignals       }   from '../Interfaces';


/**
 * project editor
 *
 * @export
 * @class ProjectEditor
 * @extends {UIPanel}
 */
export class ProjectEditor extends UIPanel {

    // [ Constructor ]

    constructor( tool:ITool ) {

        super( 'project' );

        let config     = tool.config;
        let signals    = tool.signals;

        let rendererTypes = {
            'WebGLRenderer': THREE.WebGLRenderer,
            'CanvasRenderer': THREE.CanvasRenderer,
            //'SVGRenderer': GL.SVGRenderer,
            //'SoftwareRenderer': GL.SoftwareRenderer,
            //'RaytracingRenderer': GL.RaytracingRenderer
        };

        this.setBorderTop( '0' );
        this.setPaddingTop( '20px' );

        // class

        let options : {[title:string]:string} = {};

        for ( let title in rendererTypes ) {
            if ( title.indexOf( 'WebGL' ) >= 0 && System.Support.webgl === false ) continue;
            options[ title ] = title;
        }

        let rendererTypeRow = new UIRow();
        let rendererType = new UISelect().setOptions( options ).setWidth( '150px' ).onChange( ()=> {

            let value = rendererType.getValue();
            config.setKey( 'project/renderer', value );
            updateRenderer();
        });

        rendererTypeRow.add( new UIText( 'Renderer' ).setWidth( '90px' ) );
        rendererTypeRow.add( rendererType );

        this.add( rendererTypeRow );

        if ( config.getKey( 'project/renderer' ) !== undefined ) {

            rendererType.setValue( config.getKey( 'project/renderer' ) );

        }

        // antialiasing

        let rendererPropertiesRow = new UIRow().setMarginLeft( '90px' );
        let rendererAntialias = new UIBoolean( config.getKey( 'project/renderer/antialias' ), 'antialias' ).onChange( ()=> {

            config.setKey( 'project/renderer/antialias', rendererAntialias.getValue() );
            updateRenderer();
        });
        rendererPropertiesRow.add( rendererAntialias );

        // shadow

        let rendererShadows = new UIBoolean( config.getKey( 'project/renderer/shadows' ), 'shadows' ).onChange( () => {

            config.setKey( 'project/renderer/shadows', rendererShadows.getValue() );
            updateRenderer();

        });
        rendererPropertiesRow.add( rendererShadows );
        rendererPropertiesRow.add( new UIBreak() );

        // gamma input

        let rendererGammaInput = new UIBoolean( config.getKey( 'project/renderer/gammaInput' ), 'γ input' ).onChange( () => {

            config.setKey( 'project/renderer/gammaInput', rendererGammaInput.getValue() );
            updateRenderer();
        });
        rendererPropertiesRow.add( rendererGammaInput );

        // gamma output

        let rendererGammaOutput = new UIBoolean( config.getKey( 'project/renderer/gammaOutput' ), 'γ output' ).onChange( () => {

            config.setKey( 'project/renderer/gammaOutput', rendererGammaOutput.getValue() );
            updateRenderer();

        } );
        rendererPropertiesRow.add( rendererGammaOutput );

        this.add( rendererPropertiesRow );

        // VR

        let vrRow = new UIRow();
        let vr = new UICheckbox( config.getKey( 'project/vr' ) ).setLeft( '100px' ).onChange( () => {

            config.setKey( 'project/vr', vr.getValue() );
            // updateRenderer();
        });

        vrRow.add( new UIText( 'VR' ).setWidth( '90px' ) );
        vrRow.add( vr );

        this.add( vrRow );

        //
        createRenderer( config.getKey( 'project/renderer' ), config.getKey( 'project/renderer/antialias' ), config.getKey( 'project/renderer/shadows' ), config.getKey( 'project/renderer/gammaInput' ), config.getKey( 'project/renderer/gammaOutput' ) );

        function updateRenderer () {

            createRenderer( rendererType.getValue(), rendererAntialias.getValue(), rendererShadows.getValue(), rendererGammaInput.getValue(), rendererGammaOutput.getValue() );
        }

        function createRenderer ( type:string, antialias:boolean, shadows:boolean, gammaIn:boolean, gammaOut:boolean ) {

            if ( type === 'WebGLRenderer' && System.Support.webgl === false ) {
                type = 'CanvasRenderer';
            }

            rendererPropertiesRow.setDisplay( type === 'WebGLRenderer' ? '' : 'none' );

            let renderer = new rendererTypes[ type ]( { antialias: antialias} );
            renderer.gammaInput = gammaIn;
            renderer.gammaOutput = gammaOut;
            if ( shadows && renderer.shadowMap ) {

                renderer.shadowMap.enabled = true;
                // renderer.shadowMap.type = GL.PCFSoftShadowMap;
            }

            signals.rendererChanged.dispatch( renderer );
        }
    }
}