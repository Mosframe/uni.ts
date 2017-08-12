/**
 * Type.ts
 *
 * @author mosframe / https://github.com/mosframe
 *
 * @export
 * @interface Type
 * @template T
 */

/**
 * Type
 *
 * @export
 * @interface Type
 * @template T
 */
export interface Type<T> {
    new():T;
}

/**
 * Component Type
 *
 * @export
 * @interface ComponentType
 * @template T
 */
export interface ComponentType<T> {
    new():T;
}
