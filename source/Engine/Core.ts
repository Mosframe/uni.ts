/**
 * Core.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import * as uuid    from 'uuid';
import * as GL      from './Graphic';

/**
 * Core
 *
 * @export
 * @class Core
 */
export class Core {

    // [ Public Variables ]

    name  : string;
    uuid  : string;

    // [ Constructor ]

    constructor () {
        this.name = Core.name;
        this.uuid = GL.Mesh.generateUUID();
    }
}
