/**
 * uni.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

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


// [ Tool ]
let tool = new Tool();

// [ Viewport ]
let viewport = new Viewport( tool );

// [ Menubar ]
let menubar = new Menubar( tool );

// [ Toolbar ]
let toolbar = new Toolbar( tool );

// [ RightSidebar1 ]
let rightSidebar1 = new RightSidebar1( tool );

// [ Model Dialog ]
let modal = new UIModal();
document.body.appendChild( modal.core );
modal.show( (new UIText()).setTextContent( "Wealcome Uni.ts" ) );
modal.setTextAlign('center');

// [ Theme ]
tool.setTheme( tool.config.getKey( 'theme' ) );


// [ Save State ]
let saveState = ( scene ) => {

    if ( tool.config.getKey( 'autosave' ) === false ) {
        return;
    }

    let timeout;
    clearTimeout( timeout );
    timeout = setTimeout( () => {
        tool.signals.savingStarted.dispatch();
        timeout = setTimeout( () => {
            tool.storage.set( tool.toJSON(), ()=>{} );
            tool.signals.savingFinished.dispatch();
        }, 100 );
    }, 1000 );
};


// [ Initialize Storage ]
tool.storage.init( () => {

    tool.storage.get( ( state ) => {

        if ( isLoadingFromHash ) return;

        if ( state !== undefined ) {
            tool.fromJSON( state );
        }

        // [ selected object ]
        let selected = tool.config.getKey( 'selected' );
        if ( selected !== undefined ) {
            tool.selectByUuid( selected );
        }
    });

    //
    let signals = tool.signals;

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
        modal.show( content );
    });
});


document.addEventListener( 'dragover', ( event ) => {

    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

}, false );

document.addEventListener( 'drop', ( event ) => {

    event.preventDefault();

    if ( event.dataTransfer.files.length > 0 ) {

        tool.loader.loadFile( event.dataTransfer.files[ 0 ] );
    }

}, false );

document.addEventListener( 'keydown', ( event ) => {

    switch ( event.keyCode ) {

        case 8: // backspace

            event.preventDefault(); // prevent browser back

        case 46: // delete

            let object = tool.selected;
            if( object ) {
                if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;
                if ( object.parent ) tool.execute( new RemoveObjectCommand( object ) );
            }

            break;

        case 90: // Register Ctrl-Z for Undo, Ctrl-Shift-Z for Redo

            if ( event.ctrlKey && event.shiftKey ) {
                tool.redo();
            } else if ( event.ctrlKey ) {
                tool.undo();
            }

            break;

        case 87: // Register W for translation transform mode

            tool.signals.transformModeChanged.dispatch( 'translate' );

            break;

        case 69: // Register E for rotation transform mode

            tool.signals.transformModeChanged.dispatch( 'rotate' );

            break;

        case 82: // Register R for scaling transform mode

            tool.signals.transformModeChanged.dispatch( 'scale' );

            break;

    }

}, false );

function onWindowResize( event ) {
    tool.signals.windowResize.dispatch();
}
window.addEventListener( 'resize', onWindowResize, false );
onWindowResize( null );

//

let isLoadingFromHash = false;
let hash = window.location.hash;

if ( hash.substr( 1, 5 ) === 'file=' ) {

    let file = hash.substr( 6 );

    if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

        let loader = new THREE.FileLoader();
        if( hasProperty(loader,'crossOrigin') ) loader['crossOrigin'] = '';
        loader.load( file, function ( text ) {
            tool.clear();
            tool.fromJSON( JSON.parse( text ) );
        });
        isLoadingFromHash = true;
    }

}


let groupVR;
tool.signals.enterVR.add( () => {

    if ( groupVR === undefined ) {

        groupVR = new HTMLGroup( viewport.core );
        tool.sceneHelpers.add( groupVR );

        let mesh = new HTMLMesh( rightSidebar3.core );
        mesh.position.set( 15, 0, 15 );
        mesh.rotation.y = - 0.5;
        groupVR.add( mesh );

        let signals = tool.signals;

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

tool.signals.exitedVR.add( () => {
    if ( groupVR !== undefined ) groupVR.visible = false;
});


console.log( "load finished" );