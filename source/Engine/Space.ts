/**
 * Space.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';

/**
 * The coordinate space in which to operate.
 *
 * @enum {number}
 */
export enum Space {
    /** Applies transformation relative to the world coordinate system. */
    World,
    /** Applies transformation relative to the local coordinate system. */
    Self,
}
UnitsEngine['Space'] = Space;
