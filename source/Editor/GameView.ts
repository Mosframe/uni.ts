/**
 * GameView.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { THREE      }   from '../Engine/Core';
import { UIPanel    }   from '../Engine/UI/UIPanel';
import { GamePlayer }   from '../Engine/GamePlayer';
import { ITool      }   from './Interfaces';
/**
 * GameView
 *
 * @export
 * @class GameView
 * @extends {UIPanel}
 */
export class GameView extends UIPanel {

    constructor( tool:ITool ) {
        super();

        this.setId( 'game-view' );
        this.setPosition( 'absolute' );
        this.setDisplay( 'none' );

        let signals = tool.signals;

        //
        let player = new GamePlayer( this.core );

        window.addEventListener( 'resize', () => {
            player.setSize( this.core.clientWidth, this.core.clientHeight );
        });

        signals.startPlayer.add( () => {
            this.setDisplay( '' );
            player.load( tool.toJSON() );
            player.setSize( this.core.clientWidth, this.core.clientHeight );
            console.log("GameView.Size ", this.core.clientWidth, ' x ', this.core.clientHeight );
            player.play();
        });

        signals.stopPlayer.add( () => {
            this.setDisplay( 'none' );
            player.stop();
            player.dispose();
        });

        document.body.appendChild( this.core );
    }
}
