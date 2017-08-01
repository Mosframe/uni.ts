/**
 * uni.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

window['UNITS']={};

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
import { GameView               }   from './Editor/GameView';

import { RemoveObjectCommand    }   from './Editor/Commands/RemoveObjectCommand';

import { GameObject             }   from './Engine/GameObject';
import { Util                   }   from './Engine/Util';

console.log(window);

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

                let loader = new GL.FileLoader();
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





class Test1 {
  t1: string = 't1';

  get t3(): string        { return this._t3; }
  set t3( value:string )  { this._t3=value; }
  set t4( value:string )  { this._t4=value; }
  get t5(): string        { return this._t5; }
  get t7(): string[]      { return this._t7; }
  set t7(value: string[]) { this._t7 = value; }

  t8: { [name: string]: Test21 } = {}

  _t1: string = '_t1';
  _t3: string = '_t3';
  _t4: string = '_t4';
  _t5: string = '_t5';
  _t7: string[] = [];

  _name: string = 'sss';

  get name() { return this._name; }
  set name(value: string) { this._name = value;}
}
window['UNITS'][Test1.name]=Test1;

class Test21 {
  t21: string = 't21';
}
window['UNITS'][Test21.name] = Test21;

class Test2 extends Test1 {
  t2: string = 't2';
  _t2: string = '_t2';
  _t6: string = '_t6';

  t21: Test21 = new Test21();

  get t6(): string        { return this._t6; }
  set t6( value:string )  { this._t6=value; }
}
window['UNITS'][Test2.name]=Test2;

let t2 = new Test2();
t2.t3 = "----t3";
t2.t6 = "----t6";
t2.t21.t21 = "-----t21";
t2.t7.push("t7-0");
t2.t7.push("t7-1");
t2.t8['n1'] = new Test21();
t2.t8['n1'].t21 = 'n1-t21';
t2.t8['n2'] = new Test21();
t2.t8['n2'].t21 = 'n2-t21';


let oo: { [name: string]: Test1 } = {};
oo['t2'] = t2;

let meta = Util.serialize(oo['t2'],window['UNITS']);

let t3 = new window['UNITS'][meta.class]();
t3 = Object.assign(t3, meta);
let t4 = new window['UNITS'][meta.class]();
t4 = Util.deserialize( undefined, meta, window['UNITS'] );

console.log(t2);
console.log(meta);
console.log(t3);
console.log(t4);
