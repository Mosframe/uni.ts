/**
 * Using.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

/**
 * IDisposable
 *
 * @interface IDisposable
 */
export interface IDisposable {
    dispose();
}

/**
 * using
 *
 * @template T
 * @param {T} resource
 * @param {(resource: T) => void} func
 */
export function using<T extends IDisposable>( resource: T, func : (resource:T) => void) {
    try {
        func( resource );
    } finally {
        resource.dispose();
    }
}

