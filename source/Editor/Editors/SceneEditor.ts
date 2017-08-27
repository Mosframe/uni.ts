/**
 * SceneEditor.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { THREE          }   from '../../Engine/Core';
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
import { UIOutliner     }   from '../UI/UIOutliner';
import { ITool          }   from '../Interfaces';
import { ISignals       }   from '../Interfaces';

/**
 * SceneEditor
 *
 * @export
 * @class SceneEditor
 * @extends {UIPanel}
 */
export class SceneEditor extends UIPanel {

    // [ Constructor ]

    constructor ( tool:ITool ) {
        super( 'scene' );

        this._tool      = tool;
        this._signals   = tool.signals;
        this.setBorderTop( '0' );
        this.setPaddingTop( '20px' );

        this._ignoreObjectSelectedSignal = false;

        // [ background ]

        let backgroundRow = new UIRow();

        backgroundRow.add( new UIText( 'Background' ).setWidth( '90px' ) );
        this._backgroundColor = new UIColor();
        this._backgroundColor.setValue( '#aaaaaa' ).onChange( () => {
            this._signals.sceneBackgroundChanged.dispatch( this._backgroundColor.getHexValue() );
        });
        backgroundRow.add( this._backgroundColor );
        this.add( backgroundRow );

        // [ fog ]

        this._fogTypeRow  = new UIRow();
        this._fogType     = new UISelect().setOptions( {
            'None'      : 'None',
            'Fog'       : 'Linear',
            'FogExp2'   : 'Exponential'
        }).setWidth( '150px' );
        this._fogType.onChange( () => {
            this._onFogChanged();
            this._refreshFogUI();
        });
        this._fogTypeRow.add( new UIText( 'Fog' ).setWidth( '90px' ) );
        this._fogTypeRow.add( this._fogType );
        this.add( this._fogTypeRow );

        // [ fog.color ]

        this._fogPropertiesRow = new UIRow();
        this._fogPropertiesRow.setDisplay( 'none' );
        this._fogPropertiesRow.setMarginLeft( '90px' );
        this.add( this._fogPropertiesRow );

        this._fogColor = new UIColor().setValue( '#aaaaaa' );
        this._fogColor.onChange( this._onFogChanged );
        this._fogPropertiesRow.add( this._fogColor );

        // [ fog.near ]

        this._fogNear = new UINumber( 0.1 ).setWidth( '40px' ).setRange( 0, Infinity ).onChange( this._onFogChanged );
        this._fogPropertiesRow.add( this._fogNear );

        // [ fog.far ]

        this._fogFar = new UINumber( 50 ).setWidth( '40px' ).setRange( 0, Infinity ).onChange( this._onFogChanged );
        this._fogPropertiesRow.add( this._fogFar );

        // [ fog.density ]

        this._fogDensity = new UINumber( 0.05 ).setWidth( '40px' ).setRange( 0, 0.1 ).setPrecision( 3 ).onChange( this._onFogChanged );
        this._fogPropertiesRow.add( this._fogDensity );

        // events
        this._signals.editorCleared.add( this._refreshUI );
        this._signals.sceneGraphChanged.add( this._refreshUI );

        //
        this._refreshUI();
    }


    // [ Private Variables ]

    private _tool                       : ITool;
    private _signals                    : ISignals;
    private _ignoreObjectSelectedSignal : boolean;
    private _backgroundColor            : UIColor;
    private _fogTypeRow                 : UIRow;
    private _fogType                    : UISelect;
    private _fogPropertiesRow           : UIRow;
    private _fogColor                   : UIColor;
    private _fogNear                    : UINumber;
    private _fogFar                     : UINumber;
    private _fogDensity                 : UINumber;

    // [ Private Functions ]

    private _getMaterialName = ( material ) => {

        if ( Array.isArray( material ) ) {
            let array:any = [];
            for ( let i = 0; i < material.length; i ++ ) {
                array.push( material[ i ].name );
            }
            return array.join( ',' );
        }
        return material.name;
    }

    private _getScript = ( uuid ) => {

        if ( this._tool.scripts[ uuid ] !== undefined ) {
            return ' <span class="type Script"></span>';
        }
        return '';
    }


    private _onFogChanged = () => {

        this._signals.sceneFogChanged.dispatch(
            this._fogType.getValue(),
            this._fogColor.getHexValue(),
            this._fogNear.getValue(),
            this._fogFar.getValue(),
            this._fogDensity.getValue()
        );
    }

    private _refreshUI = () => {

        let scene = this._tool.scene;

        if ( scene.core.background ) {
            this._backgroundColor.setHexValue( scene.core.background.getHex() );
        }

        if ( scene.core.fog ) {

            this._fogColor.setHexValue( scene.core.fog.color.getHex() );

            if ( scene.core.fog instanceof THREE.Fog ) {

                this._fogType.setValue( "Fog" );
                this._fogNear.setValue( scene.core.fog.near );
                this._fogFar.setValue( scene.core.fog.far );

            } else if ( scene.core.fog instanceof THREE.FogExp2 ) {

                this._fogType.setValue( "FogExp2" );
                this._fogDensity.setValue( scene.core.fog.density );

            }

        } else {
            this._fogType.setValue( "None" );
        }

        this._refreshFogUI();
    }

    private _refreshFogUI = () => {

        let type = this._fogType.getValue();
        this._fogPropertiesRow.setDisplay( type === 'None' ? 'none' : '' );
        this._fogNear.setDisplay( type === 'Fog' ? '' : 'none' );
        this._fogFar.setDisplay( type === 'Fog' ? '' : 'none' );
        this._fogDensity.setDisplay( type === 'FogExp2' ? '' : 'none' );
    }
}
