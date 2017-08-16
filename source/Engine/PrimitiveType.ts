/**
 * PrimitiveType.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UnitsEngine    }   from './UnitsEngine';

/**
 * The various primitives that can be created using the GameObject.CreatePrimitive function.
 *
 * @enum {number}
 */
export enum PrimitiveType {
    /** A sphere primitive. */
    Sphere	    ,
    /** A cylinder primitive. */
    Cylinder    ,
    /** A cube primitive. */
    Cube        ,
    /** A plane primitive. */
    Plane       ,
    /** A Quad primitive. */
    Quad        ,
    /** A Circle primitive. */
    Circle      ,
    /** A Icosahedron primitive. */
    Icosahedron ,
    /** A Torus primitive. */
    Torus       ,
    /** A TorusKnot primitive. */
    TorusKnot   ,
    /** A Lathe primitive. */
    Lathe       ,
    /* A capsule primitive.
    Capsule     ,
     */
}
UnitsEngine['PrimitiveType'] = PrimitiveType;
