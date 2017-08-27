/**
 * edit menu
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { THREE                      }   from '../../Engine/Core';
import { UIPanel                    }   from '../../Engine/UI/UIPanel'             ;
import { UIRow                      }   from '../../Engine/UI/UIRow'               ;
import { UIButton                   }   from '../../Engine/UI/UIButton'            ;
import { UINumber                   }   from '../../Engine/UI/UINumber'            ;
import { UIText                     }   from '../../Engine/UI/UIText'              ;
import { UIBoolean                  }   from '../../Engine/UI/UIBoolean'           ;
import { UIHorizontalRule           }   from '../../Engine/UI/UIHorizontalRule'    ;
import { ITool                      }   from '../Interfaces'                            ;
import { AddObjectCommand           }   from '../Commands/AddObjectCommand'             ;
import { RemoveObjectCommand        }   from '../Commands/RemoveObjectCommand'          ;
import { SetMaterialValueCommand    }   from '../Commands/SetMaterialValueCommand'      ;
import { MultiCmdsCommand           }   from '../Commands/MultiCmdsCommand'             ;
import { Menu                       }   from './Menu'                                   ;
import { GameObject                 }   from '../../Engine/GameObject';


let glslprep = window['glslprep'];//require('../../libs/glslprep/glslprep.min');


/**
 * edit menu
 *
 * @export
 * @class EditMenu
 * @extends {Menu}
 */
export class EditMenu extends Menu {

    // [ Constructor ]

    constructor( tool:ITool ) {
        super('edit');

        let title = new UIPanel();
        title.setClass( 'title' );
        title.setTextContent( 'Edit' );
        this.add( title );

        let options = new UIPanel();
        options.setClass( 'options' );
        this.add( options );

        // [ Undo ]

        let undo = new UIRow();
        undo.setClass( 'option' );
        undo.setTextContent( 'Undo (Ctrl+Z)' );
        undo.onClick( () => { tool.undo(); });
        options.add( undo );

        // [ Redo ]

        let redo = new UIRow();
        redo.setClass( 'option' );
        redo.setTextContent( 'Redo (Ctrl+Shift+Z)' );
        redo.onClick( () => { tool.redo(); });
        options.add( redo );

        // [ Clear History ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Clear History' );
            option.onClick( () => {
                if ( confirm( 'The Undo/Redo History will be cleared. Are you sure?' ) ) {
                    tool.history.clear();
                }
            });
            options.add( option );

            tool.signals.historyChanged.add( () => {

                let history = tool.history;

                undo.setClass( 'option' );
                redo.setClass( 'option' );

                if ( history.undos.length == 0 ) {
                    undo.setClass( 'inactive' );
                }

                if ( history.redos.length == 0 ) {
                    redo.setClass( 'inactive' );
                }
            });

            options.add( new UIHorizontalRule() );
        }

        // [ Clone ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Clone' );
            option.onClick( () => {
                let object = tool.selected;
                if( object ) {
                    if ( object.parent === null ) return; // avoid cloning the camera or scene
                    object = object.clone();
                    tool.execute( new AddObjectCommand( object ) );
                }
            });
            options.add( option );
        }

        // [ Delete ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Delete (Del)' );
            option.onClick( () => {
                let object = tool.selected;
                if( object ) {
                    if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;
                    let parent = object.parent;
                    if ( parent === undefined ) return; // avoid deleting the camera or scene
                    tool.execute( new RemoveObjectCommand( object ) );
                }
            });
            options.add( option );
        }

        // [ Minify shaders ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Minify Shaders' );
            option.onClick( () => {

                let root                = tool.selected || tool.scene.core;
                let errors  : any       = [];
                let path    : any       = [];
                let cmds    : any       = [];
                let nMaterialsChanged   = 0;

                function getPath ( object ) {

                    path.length = 0;

                    let parent = object.parent;
                    if ( parent !== undefined ) getPath( parent );

                    path.push( object.name || object.uuid );

                    return path;
                }

                root.traverse( ( object:any ) => {

                    let material = object.material;

                    if ( material instanceof THREE.ShaderMaterial ) {

                        try {
                            let shader = glslprep.minifyGlsl( [ material.vertexShader, material.fragmentShader ] );

                            cmds.push( new SetMaterialValueCommand( object, 'vertexShader', shader[ 0 ] ) );
                            cmds.push( new SetMaterialValueCommand( object, 'fragmentShader', shader[ 1 ] ) );

                            ++nMaterialsChanged;

                        } catch ( e ) {

                            let path = getPath( object ).join( "/" );

                            if ( e instanceof glslprep.SyntaxError )
                                errors.push( path + ":" + e.line + ":" + e.column + ": " + e.message );
                            else {
                                errors.push( path + ": Unexpected error (see console for details)." );
                                console.error( e.stack || e );
                            }
                        }
                    }
                });

                if ( nMaterialsChanged > 0 ) {
                    tool.execute( new MultiCmdsCommand( cmds ), 'Minify Shaders' );
                }

                window.alert( nMaterialsChanged + " material(s) were changed.\n" + errors.join( "\n" ) );
            });
            options.add( option );
        }
    }
}
