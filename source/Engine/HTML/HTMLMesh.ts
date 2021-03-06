/**
 * HTMLMesh.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { THREE          } from '../Core';
import { HTMLTexture } from './HTMLTexture';

/**
 * HTML Mesh
 *
 * @export
 * @class HTMLMesh
 * @extends {GL.Mesh}
 */
export class HTMLMesh extends THREE.Mesh {

    constructor ( dom:HTMLElement ) {

        let texture = new HTMLTexture( dom );
        let geometry = new THREE.PlaneGeometry( texture.image.width * 0.05, texture.image.height * 0.05 );
        let material = new THREE.MeshBasicMaterial( { map: texture } );

        super( geometry, material );

        this.type = 'HTMLMesh';
    }
}
