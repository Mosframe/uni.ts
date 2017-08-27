/**
 * Time.ts
 *
 * @author mosframe / https://github.com/mosframe
 *
 * @export
 * @interface Type
 * @template T
 */

import { UnitsEngine } from './UnitsEngine';

/**
 * The interface to get time information from Units.
 *
 * @export
 * @interface Time
 * @template T
 */
export class Time {

    // [ Static Variables ]

    /*
    static captureFramerate	Slows game playback time to allow screenshots to be saved between frames.
    */

    /**
     * The time in seconds it took to complete the last frame (Read Only).
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Time
     */
    static get deltaTime() : number { return this._deltaTime; }

    /*
    static fixedDeltaTime	The interval in seconds at which physics and other fixed frame rate updates (like MonoBehaviour's FixedUpdate) are performed.
    static fixedTime	The time the latest FixedUpdate has started (Read Only). This is the time in seconds since the start of the game.
    static fixedUnscaledDeltaTime	The timeScale-independent interval in seconds from the last fixed frame to the current one (Read Only).
    static fixedUnscaledTime	The TimeScale-independant time the latest FixedUpdate has started (Read Only). This is the time in seconds since the start of the game.
    static frameCount	The total number of frames that have passed (Read Only).
    static inFixedTimeStep	Returns true if called inside a fixed time step callback (like MonoBehaviour's FixedUpdate), otherwise returns false.
    static maximumDeltaTime	The maximum time a frame can take. Physics and other fixed frame rate updates (like MonoBehaviour's FixedUpdate).
    static maximumParticleDeltaTime	The maximum time a frame can spend on particle updates. If the frame takes longer than this, then updates are split into multiple smaller updates.
    static realtimeSinceStartup	The real time in seconds since the game started (Read Only).
    static smoothDeltaTime	A smoothed out Time.deltaTime (Read Only).
    */

    /**
     * The time at the beginning of this frame (Read Only).
     * This is the time in seconds since the start of the game.
     *
     * @readonly
     * @static
     * @type {number}
     * @memberof Time
     */
    static get time() : number { return this._time; }

    /*
    The scale at which the time is passing. This can be used for slow motion effects.
    */

    static timeScale : number = 1;
    /*
    static timeSinceLevelLoad	The time this frame has started (Read Only). This is the time in seconds since the last level has been loaded.
    static unscaledDeltaTime	The timeScale-independent interval in seconds from the last frame to the current one (Read Only).
    static unscaledTime	The timeScale-independant time for this frame (Read Only). This is the time in seconds since the start of the game.
    */

    static reset() {
        this._time      = 0;
        this._startTime = performance.now()*0.001;
        this._prevTime  = 0;
        this._deltaTime = 0;
    }

    // [ Private Static Variables ]

    private static _time        : number = 0;
    private static _startTime   : number = 0;
    private static _prevTime    : number = 0;
    private static _deltaTime   : number = 0;

    private static _update() {
        this._prevTime = this._time;
        this._time = (performance.now()*0.001)-this._startTime;
        this._deltaTime = (this._time - this._prevTime)*this.timeScale;
    }
}
UnitsEngine[Time.name] = Time;

