/**
 * HistoryEditor.ts
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
 * HistoryEditor
 *
 * @export
 * @class HistoryEditor
 * @extends {UIPanel}
 */
export class HistoryEditor extends UIPanel {

    constructor( tool:ITool ) {
        super( 'history' );

        let signals = tool.signals;
        let config  = tool.config;
        let history = tool.history;

        this.add( new UIText( 'History' ) );

        //

        let persistent = new UIBoolean( config.getKey( 'settings/history' ), 'persistent' );
        persistent.setPosition( 'absolute' ).setRight( '8px' );
        persistent.onChange( () => {

            let value = persistent.getValue();

            config.setKey( 'settings/history', value );

            if ( value ) {

                alert( 'The history will be preserved across sessions.\nThis can have an impact on performance when working with textures.' );

                let lastUndoCmd = history.undos[ history.undos.length - 1 ];
                let lastUndoId = ( lastUndoCmd !== undefined ) ? lastUndoCmd.id : 0;
                tool.history.enableSerialization( lastUndoId );

            } else {
                signals.historyChanged.dispatch();
            }
        });
        this.add( persistent );

        this.add( new UIBreak(), new UIBreak() );

        let ignoreObjectSelectedSignal = false;

        let outliner = new UIOutliner( tool );
        outliner.onChange( () => {

            ignoreObjectSelectedSignal = true;
            tool.history.goToState( outliner.getValue() );
            ignoreObjectSelectedSignal = false;

        });
        this.add( outliner );

        //
        let refreshUI = () => {

            let options : any = [];
            let enumerator = 1;

            function buildOption( object ) {

                let option = document.createElement( 'div' );
                option['value'] = object.id;
                return option;
            }

            ( function addObjects( objects ) {

                for ( let i = 0, l = objects.length; i < l; i ++ ) {

                    let object = objects[ i ];
                    let option = buildOption( object );
                    option.innerHTML = '&nbsp;' + object.name;
                    options.push( option );
                }

            } )( history.undos );


            ( function addObjects( objects, pad ) {

                for ( let i = objects.length - 1; i >= 0; i -- ) {

                    let object = objects[ i ];
                    let option = buildOption( object );
                    option.innerHTML = '&nbsp;' + object.name;
                    option.style.opacity = '0.3';
                    options.push( option );
                }

            } )( history.redos, '&nbsp;' );

            outliner.setOptions( options );

        };

        refreshUI();

        // events

        signals.editorCleared.add( refreshUI );
        signals.historyChanged.add( refreshUI );
        signals.historyChanged.add( ( cmd ) => {
            outliner.setValue( cmd !== undefined ? cmd.id : null );
        });
    }
}