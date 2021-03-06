/**
 * HTMLGroup.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { THREE }   from '../Core';

/**
 * HTML Group
 *
 * @export
 * @class HTMLGroup
 * @extends {GL.Group}
 */
export class HTMLGroup extends THREE.Group {

    constructor ( dom:HTMLElement ) {
        super();

        this.type = 'HTMLGroup';

        /*
        dom.addEventListener( 'mousemove', function ( event ) {

            console.log( 'mousemove' );

        } );

        dom.addEventListener( 'click', function ( event ) {

            console.log( 'click' );

        } );
        */
    }
}
