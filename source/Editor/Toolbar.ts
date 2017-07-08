/**
 * Toolbar.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { UIPanel    }   from '../Engine/UI/UIPanel';
import { UIButton   }   from '../Engine/UI/UIButton';
import { UINumber   }   from '../Engine/UI/UINumber';
import { UIText     }   from '../Engine/UI/UIText';
import { UIBoolean  }   from '../Engine/UI/UIBoolean';
import { IEditor    }   from './Interfaces';

/**
 * Toolbar
 *
 * @export
 * @class Toolbar
 */
export class Toolbar  extends UIPanel {

    constructor( editor:IEditor ) {

        super();

        let signals = editor.signals;

        this.setId( 'toolbar' );

        let buttons = new UIPanel();
        this.add( buttons );

        // [ Translate ]

        let translate = new UIButton( 'translate' );
        translate.core.title = 'W';
        translate.core.className = 'button selected';
        translate.onClick( () => {

            signals.transformModeChanged.dispatch( 'translate' );

        });
        buttons.add( translate );

        // [ Rotate ]

        let rotate = new UIButton( 'rotate' );
        rotate.core.title = 'E';
        rotate.onClick( () => {

            signals.transformModeChanged.dispatch( 'rotate' );

        });
        buttons.add( rotate );

        // [ Scale ]

        let scale = new UIButton( 'scale' );
        scale.core.title = 'R';
        scale.onClick( () => {

            signals.transformModeChanged.dispatch( 'scale' );

        });
        buttons.add( scale );

        // [ Signals ]

        signals.transformModeChanged.add( ( mode:string ) => {

            translate   .core.classList.remove( 'selected' );
            rotate      .core.classList.remove( 'selected' );
            scale       .core.classList.remove( 'selected' );

            switch ( mode ) {
            case 'translate': translate .core.classList.add( 'selected' ); break;
            case 'rotate'   : rotate    .core.classList.add( 'selected' ); break;
            case 'scale'    : scale     .core.classList.add( 'selected' ); break;
            }
        });

        // [ Grid ]

        let grid = new UINumber( 25 ).setWidth( '40px' ).onChange( update );
        buttons.add( new UIText( 'grid: ' ) );
        buttons.add( grid );

        // [ Grid - Snap ]

        let snap = new UIBoolean( false, 'snap' ).onChange( update );
        buttons.add( snap );

        // [ Grid - Space : Local | World ]

        let local = new UIBoolean( false, 'local' ).onChange( update );
        buttons.add( local );

        // [ Grid - Show : Show | Hide ]

        let showGrid = new UIBoolean( true, 'show' ).onChange( update );
        buttons.add( showGrid );

        function update() {

            signals.snapChanged.dispatch( snap.getValue() === true ? grid.getValue() : null );
            signals.spaceChanged.dispatch( local.getValue() === true ? "local" : "world" );
            signals.showGridChanged.dispatch( showGrid.getValue() );
        }

        document.body.appendChild( this.core );
    }
}
