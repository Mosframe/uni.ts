/**
 * uni.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

// [ Engine Sources ]

import './Engine';
import './Editor';

// [ Project Sources ]
import './Projects/Test01/source/';

import { UnitsEngine            }   from './Engine';
import { UnitsEditor            }   from './Editor';

console.log( 'UnitsEngine', UnitsEngine );
console.log( 'UnitsEditor', UnitsEditor );

// [ Editor Sources ]

import { THREE                  }   from './Engine';

import { UIModal                }   from './Engine/UI/UIModal';
import { UIText                 }   from './Engine/UI/UIText';

import { HTMLGroup              }   from './Engine/HTML/HTMLGroup';
import { HTMLMesh               }   from './Engine/HTML/HTMLMesh';

import { Tool                   }   from './Editor/Tool';
import { Viewport               }   from './Editor/Viewport';
import { Menubar                }   from './Editor/Menubar';
import { Toolbar                }   from './Editor/Toolbar';
import { RightSidebar1          }   from './Editor/RightSidebar1';
import { GameView               }   from './Editor/GameView';

import { RemoveObjectCommand    }   from './Editor/Commands/RemoveObjectCommand';

import { GameObject             }   from './Engine/GameObject';
import { Util                   }   from './Engine/Util';



/**
 * Units Editor
 *
 * @export
 * @class Units
 */
export class Units {

    // [ Constructor ]

    constructor () {

        this._tool           = new Tool();
        this._viewport       = new Viewport( this._tool );
        this._menubar        = new Menubar( this._tool );
        this._toolbar        = new Toolbar( this._tool );
        this._gameView       = new GameView( this._tool );
        this._rightSidebar1  = new RightSidebar1( this._tool );

        // [ Notice ]
        this._modal = new UIModal();
        this._modal.setTextAlign('center');

        // [ Theme ]
        this._tool.setTheme( this._tool.config.getKey( 'theme' ) );

        // [ Save State ]
        let saveState = ( scene ) => {

            if ( this._tool.config.getKey( 'autosave' ) === false ) {
                return;
            }

            let timeout;
            clearTimeout( timeout );
            timeout = setTimeout( () => {
                this._tool.signals.savingStarted.dispatch();
                timeout = setTimeout( () => {
                    this._tool.storage.set( this._tool.toJSON(), ()=>{} );
                    this._tool.signals.savingFinished.dispatch();
                }, 100 );
            }, 1000 );
        };

        // [ Initialize Storage ]
        this._tool.storage.init( () => {

            this._tool.storage.get( ( state ) => {

                if ( isLoadingFromHash ) return;

                if ( state !== undefined ) {
                    this._tool.fromJSON( state );
                }

                // [ selected object ]
                let selected = this._tool.config.getKey( 'selected' );
                if ( selected !== undefined ) {
                    this._tool.selectByUuid( selected );
                }
            });

            // [ Signals ]
            let signals = this._tool.signals;

            signals.geometryChanged         .add( saveState );
            signals.objectAdded             .add( saveState );
            signals.objectChanged           .add( saveState );
            signals.objectRemoved           .add( saveState );
            signals.materialChanged         .add( saveState );
            signals.sceneBackgroundChanged  .add( saveState );
            signals.sceneFogChanged         .add( saveState );
            signals.sceneGraphChanged       .add( saveState );
            signals.scriptChanged           .add( saveState );
            signals.historyChanged          .add( saveState );

            signals.showModal.add( ( content ) => {
                this._modal.show( content );
            });

            // [ Notice test ]
            this._tool.signals.showModal.dispatch( (new UIText()).setTextContent( "Wealcome Uni.ts" ) );
        });

        // [ drag over event ]
        document.addEventListener( 'dragover', ( event ) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        }, false );

        document.addEventListener( 'drop', ( event ) => {

            event.preventDefault();

            if ( event.dataTransfer.files.length > 0 ) {

                this._tool.loader.loadFile( event.dataTransfer.files[ 0 ] );
            }

        }, false );

        // [ key down event ]
        document.addEventListener( 'keydown', ( event ) => {

            switch ( event.keyCode ) {

                case 8: // backspace

                    event.preventDefault(); // prevent browser back

                case 46: // delete

                    let object = this._tool.selected;
                    if( object ) {
                        if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;
                        if ( object.parent ) this._tool.execute( new RemoveObjectCommand( object ) );
                    }
                    break;

                case 90: // Register Ctrl-Z for Undo, Ctrl-Shift-Z for Redo

                    if ( event.ctrlKey && event.shiftKey ) {
                        this._tool.redo();
                    } else if ( event.ctrlKey ) {
                        this._tool.undo();
                    }
                    break;

                case 87: // Register W for translation transform mode

                    this._tool.signals.transformModeChanged.dispatch( 'translate' );
                    break;

                case 69: // Register E for rotation transform mode

                    this._tool.signals.transformModeChanged.dispatch( 'rotate' );
                    break;

                case 82: // Register R for scaling transform mode

                    this._tool.signals.transformModeChanged.dispatch( 'scale' );
                    break;
            }

        }, false );

        // [ window resize ]
        window.addEventListener( 'resize', this._onWindowResize, false );
        this._onWindowResize( null );

        //
        let isLoadingFromHash = false;
        let hash = window.location.hash;

        if ( hash.substr( 1, 5 ) === 'file=' ) {

            let file = hash.substr( 6 );

            if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

                let loader = new THREE.FileLoader();
                if( 'crossOrigin' in loader ) loader['crossOrigin'] = '';
                loader.load( file, ( text ) => {
                    this._tool.clear();
                    this._tool.fromJSON( JSON.parse( text ) );
                });
                isLoadingFromHash = true;
            }
        }

        // VR
        let groupVR;
        this._tool.signals.enterVR.add( () => {

            if ( groupVR === undefined ) {

                groupVR = new HTMLGroup( this._viewport.core );
                this._tool.sceneHelpers.add( groupVR );

                let mesh = new HTMLMesh( this._rightSidebar1.core );
                mesh.position.set( 15, 0, 15 );
                mesh.rotation.y = - 0.5;
                groupVR.add( mesh );

                let signals = this._tool.signals;

                function updateTexture() {
                    mesh.material.update();
                }

                signals.objectSelected      .add( updateTexture );
                signals.objectAdded         .add( updateTexture );
                signals.objectChanged       .add( updateTexture );
                signals.objectRemoved       .add( updateTexture );
                signals.sceneGraphChanged   .add( updateTexture );
                signals.historyChanged      .add( updateTexture );
            }

            groupVR.visible = true;
        });

        // exit VR
        this._tool.signals.exitedVR.add( () => {
            if ( groupVR !== undefined ) groupVR.visible = false;
        });

        console.log( "Tool initialized" );
    }

    // [ Private Variables ]

    private _tool               : Tool;
    private _viewport           : Viewport;
    private _menubar            : Menubar;
    private _toolbar            : Toolbar;
    private _rightSidebar1      : RightSidebar1;
    private _gameView           : GameView;
    private _modal              : UIModal;

    // [ Private Functions ]

    private _onWindowResize = ( event ) => {
        this._tool.signals.windowResize.dispatch();
    }
}

let units = new Units();
window['units'] = units;


