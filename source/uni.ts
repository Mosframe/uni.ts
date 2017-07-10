/**
 * uni.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import * as GL from './Engine/Graphic';

import { UIModal                }   from './Engine/UI/UIModal';
import { UIText                 }   from './Engine/UI/UIText';

import { HTMLGroup              }   from './Engine/HTML/HTMLGroup';
import { HTMLMesh               }   from './Engine/HTML/HTMLMesh';

import { Tool                   }   from './Editor/Tool';
import { Viewport               }   from './Editor/Viewport';
import { Menubar                }   from './Editor/Menubar';
import { Toolbar                }   from './Editor/Toolbar';
import { RightSidebar1          }   from './Editor/RightSidebar1';
import { RemoveObjectCommand    }   from './Editor/Commands/RemoveObjectCommand';


/**
 * Units Editor
 *
 * @export
 * @class Units
 */
export class Units {

    // [ Constructor ]

    constructor () {

        this.tool           = new Tool();
        this.viewport       = new Viewport( this.tool );
        this.menubar        = new Menubar( this.tool );
        this.toolbar        = new Toolbar( this.tool );
        this.rightSidebar1  = new RightSidebar1( this.tool );

        this.modal          = new UIModal();
        this.modal.show ( (new UIText()).setTextContent( "Wealcome Uni.ts" ) );
        this.modal.setTextAlign('center');

        // [ Theme ]
        this.tool.setTheme( this.tool.config.getKey( 'theme' ) );

        // [ Save State ]
        let saveState = ( scene ) => {

            if ( this.tool.config.getKey( 'autosave' ) === false ) {
                return;
            }

            let timeout;
            clearTimeout( timeout );
            timeout = setTimeout( () => {
                this.tool.signals.savingStarted.dispatch();
                timeout = setTimeout( () => {
                    this.tool.storage.set( this.tool.toJSON(), ()=>{} );
                    this.tool.signals.savingFinished.dispatch();
                }, 100 );
            }, 1000 );
        };

        // [ Initialize Storage ]
        this.tool.storage.init( () => {

            this.tool.storage.get( ( state ) => {

                if ( isLoadingFromHash ) return;

                if ( state !== undefined ) {
                    this.tool.fromJSON( state );
                }

                // [ selected object ]
                let selected = this.tool.config.getKey( 'selected' );
                if ( selected !== undefined ) {
                    this.tool.selectByUuid( selected );
                }
            });

            //
            let signals = this.tool.signals;

            signals.geometryChanged.add( saveState );
            signals.objectAdded.add( saveState );
            signals.objectChanged.add( saveState );
            signals.objectRemoved.add( saveState );
            signals.materialChanged.add( saveState );
            signals.sceneBackgroundChanged.add( saveState );
            signals.sceneFogChanged.add( saveState );
            signals.sceneGraphChanged.add( saveState );
            signals.scriptChanged.add( saveState );
            signals.historyChanged.add( saveState );

            signals.showModal.add( ( content ) => {
                this.modal.show( content );
            });
        });

        document.addEventListener( 'dragover', ( event ) => {

            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';

        }, false );

        document.addEventListener( 'drop', ( event ) => {

            event.preventDefault();

            if ( event.dataTransfer.files.length > 0 ) {

                this.tool.loader.loadFile( event.dataTransfer.files[ 0 ] );
            }

        }, false );

        document.addEventListener( 'keydown', ( event ) => {

            switch ( event.keyCode ) {

                case 8: // backspace

                    event.preventDefault(); // prevent browser back

                case 46: // delete

                    let object = this.tool.selected;
                    if( object ) {
                        if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;
                        if ( object.parent ) this.tool.execute( new RemoveObjectCommand( object ) );
                    }

                    break;

                case 90: // Register Ctrl-Z for Undo, Ctrl-Shift-Z for Redo

                    if ( event.ctrlKey && event.shiftKey ) {
                        this.tool.redo();
                    } else if ( event.ctrlKey ) {
                        this.tool.undo();
                    }

                    break;

                case 87: // Register W for translation transform mode

                    this.tool.signals.transformModeChanged.dispatch( 'translate' );

                    break;

                case 69: // Register E for rotation transform mode

                    this.tool.signals.transformModeChanged.dispatch( 'rotate' );

                    break;

                case 82: // Register R for scaling transform mode

                    this.tool.signals.transformModeChanged.dispatch( 'scale' );

                    break;

            }

        }, false );

        window.addEventListener( 'resize', this.onWindowResize, false );
        this.onWindowResize( null );

        //
        let isLoadingFromHash = false;
        let hash = window.location.hash;

        if ( hash.substr( 1, 5 ) === 'file=' ) {

            let file = hash.substr( 6 );

            if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

                let loader = new GL.FileLoader();
                if( 'crossOrigin' in loader ) loader['crossOrigin'] = '';
                loader.load( file, ( text ) => {
                    this.tool.clear();
                    this.tool.fromJSON( JSON.parse( text ) );
                });
                isLoadingFromHash = true;
            }

        }


        let groupVR;
        this.tool.signals.enterVR.add( () => {

            if ( groupVR === undefined ) {

                groupVR = new HTMLGroup( this.viewport.core );
                this.tool.sceneHelpers.add( groupVR );

                let mesh = new HTMLMesh( this.rightSidebar1.core );
                mesh.position.set( 15, 0, 15 );
                mesh.rotation.y = - 0.5;
                groupVR.add( mesh );

                let signals = this.tool.signals;

                function updateTexture() {
                    mesh.material.update();
                }

                signals.objectSelected.add( updateTexture );
                signals.objectAdded.add( updateTexture );
                signals.objectChanged.add( updateTexture );
                signals.objectRemoved.add( updateTexture );
                signals.sceneGraphChanged.add( updateTexture );
                signals.historyChanged.add( updateTexture );
            }

            groupVR.visible = true;
        });

        this.tool.signals.exitedVR.add( () => {
            if ( groupVR !== undefined ) groupVR.visible = false;
        });

        console.log( "load finished" );
    }

    // [ Private Variables ]

    tool            : Tool;
    viewport        : Viewport;
    menubar         : Menubar;
    toolbar         : Toolbar;
    rightSidebar1   : RightSidebar1;
    modal           : UIModal;


    onWindowResize = ( event ) => {
        this.tool.signals.windowResize.dispatch();
    }

}

let units = new Units();



