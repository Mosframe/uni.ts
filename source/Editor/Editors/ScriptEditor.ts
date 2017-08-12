/**
 * ScriptEditor
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { GL                     }   from '../../Engine/Graphic';
import { System                 }   from '../../Engine/System';
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
import { UICheckbox             }   from '../../Engine/UI/UICheckbox';
import { UIInput                }   from '../../Engine/UI/UIInput';
import { UIOutliner             }   from '../UI/UIOutliner';
import { ITool                  }   from '../Interfaces';
import { ISignals               }   from '../Interfaces';

import { AddScriptCommand       }   from '../Commands/AddScriptCommand';
import { SetScriptValueCommand  }   from '../Commands/SetScriptValueCommand';
import { RemoveScriptCommand    }   from '../Commands/RemoveScriptCommand';

/**
 * ScriptEditor
 *
 * @export
 * @class ScriptEditor
 * @extends {UIPanel}
 */
export class ScriptEditor extends UIPanel {

    // [ Constructor ]

    constructor ( tool:ITool ) {
        super( 'script' );

        this.setBorderTop( '0' );
        this.setPaddingTop( '20px' );
        this.setPaddingRight( '0px' );

        let signals = tool.signals;

        this.setDisplay( 'none' );

        this.add( new UIText( 'Script' ).setTextTransform( 'uppercase' ) );
        this.add( new UIBreak() );
        this.add( new UIBreak() );

        //

        let scriptsContainer = new UIRow();
        this.add( scriptsContainer );

        let newScript = new UIButton( 'New' );
        newScript.onClick( () => {

            if( tool.selected ) {
                let script = { name: '', source: 'function update( event ) {}' };
                tool.execute( new AddScriptCommand( tool.selected, script ) );
            }

        } );
        this.add( newScript );

        /*
        let loadScript = new UIButton( 'Load' );
        loadScript.setMarginLeft( '4px' );
        this.add( loadScript );
        */

        //

        function update() {

            scriptsContainer.clear();
            scriptsContainer.setDisplay( 'none' );

            let object = tool.selected;

            if ( object === null ) {

                return;

            }

            let scripts = tool.scripts[ object.uuid ];

            if ( scripts !== undefined ) {

                scriptsContainer.setDisplay( 'block' );

                for ( let i = 0; i < scripts.length; i ++ ) {

                    ( function ( object, script ) {

                        let name = new UIInput( script.name ).setWidth( '130px' ).setFontSize( '12px' );
                        name.onChange( function () {

                            if( tool.selected ) {
                                tool.execute( new SetScriptValueCommand( tool.selected, script, 'name', this.getValue() ) );
                            }

                        } );
                        scriptsContainer.add( name );

                        let edit = new UIButton( 'Edit' );
                        edit.setMarginLeft( '4px' );
                        edit.onClick( function () {

                            signals.editScript.dispatch( object, script );

                        } );
                        scriptsContainer.add( edit );

                        let remove = new UIButton( 'Remove' );
                        remove.setMarginLeft( '4px' );
                        remove.onClick( function () {

                            if ( confirm( 'Are you sure?' ) ) {

                                if( tool.selected ) {
                                    tool.execute( new RemoveScriptCommand( tool.selected, script ) );
                                }

                            }

                        } );
                        scriptsContainer.add( remove );

                        scriptsContainer.add( new UIBreak() );

                    } )( object, scripts[ i ] )

                }

            }

        }

        // signals

        signals.objectSelected.add( ( object ) => {

            if ( object !== null && tool.camera !== object ) {

                this.setDisplay( 'block' );

                update();

            } else {

                this.setDisplay( 'none' );

            }

        } );

        signals.scriptAdded.add( update );
        signals.scriptRemoved.add( update );
        signals.scriptChanged.add( update );
    }
}
