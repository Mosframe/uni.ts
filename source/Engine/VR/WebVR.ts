/**
 * WebVR.ts
 *
 * Based on @tojiro's vr-samples-utils.js
 *
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 * @author Mosframe / https://github.com/Mosframe
 */

import { THREE }   from '../Core';

/**
 * Web VR
 *
 * @export
 * @class WebVR
 */
export class WebVR {

	static isAvailable () {

		console.warn( 'WEBVR: isAvailable() is being deprecated. Use .checkAvailability() instead.' );
		return navigator.getVRDisplays !== undefined;
	}

	static checkAvailability () {

		return new Promise( ( resolve, reject ) => {

			if ( navigator.getVRDisplays !== undefined ) {

				navigator.getVRDisplays().then( function ( displays ) {

					if ( displays.length === 0 ) {

						reject( 'WebVR supported, but no VRDisplays found.' );

					} else {
						resolve();
					}

				} );

			} else {

				reject( 'Your browser does not support WebVR. See <a href="https://webvr.info">webvr.info</a> for assistance.' );

			}

		} );
	}

	static getVRDisplays ( onDisplays:Function ) {

		if ( navigator.getVRDisplays ) {
			navigator.getVRDisplays().then( ( displays:VRDisplay[] ) => {
				onDisplays( displays );
			}).catch( ()=>{
                console.warn( 'GL.VRControls: Unable to get VR Displays' );
			});
		}
	}

	static getVRDisplay ( onDisplay:Function ) {

		WebVR.getVRDisplays( (displays:VRDisplay[]) => {
			onDisplay( displays[0] );
		});
	}

	static getMessage () {

		console.warn( 'WEBVR: getMessage() is being deprecated. Use .getMessageContainer( message ) instead.' );

		var message;

		if ( navigator.getVRDisplays ) {

			navigator.getVRDisplays().then( function ( displays ) {

				if ( displays.length === 0 ) message = 'WebVR supported, but no VRDisplays found.';

			} );

		} else {

			message = 'Your browser does not support WebVR. See <a href="http://webvr.info">webvr.info</a> for assistance.';

		}

		if ( message !== undefined ) {

			var container = document.createElement( 'div' );
			container.style.position = 'absolute';
			container.style.left = '0';
			container.style.top = '0';
			container.style.right = '0';
			container.style.zIndex = '999';
			container.align = 'center';

			var error = document.createElement( 'div' );
			error.style.fontFamily = 'sans-serif';
			error.style.fontSize = '16px';
			error.style.fontStyle = 'normal';
			error.style.lineHeight = '26px';
			error.style.backgroundColor = '#fff';
			error.style.color = '#000';
			error.style.padding = '10px 20px';
			error.style.margin = '50px';
			error.style.display = 'inline-block';
			error.innerHTML = message;
			container.appendChild( error );

			return container;

		}
	}

	static getMessageContainer ( message ) {

		var container = document.createElement( 'div' );
		container.style.position = 'absolute';
		container.style.left = '0';
		container.style.top = '0';
		container.style.right = '0';
		container.style.zIndex = '999';
		container.align = 'center';

		var error = document.createElement( 'div' );
		error.style.fontFamily = 'sans-serif';
		error.style.fontSize = '16px';
		error.style.fontStyle = 'normal';
		error.style.lineHeight = '26px';
		error.style.backgroundColor = '#fff';
		error.style.color = '#000';
		error.style.padding = '10px 20px';
		error.style.margin = '50px';
		error.style.display = 'inline-block';
		error.innerHTML = message;
		container.appendChild( error );

		return container;
	}

	static getButton ( display, canvas?:any ) {

		if ( 'VREffect' in THREE && display instanceof THREE.VREffect ) {

			console.error( 'WebVR.getButton() now expects a VRDisplay.' );
			return document.createElement( 'button' );
		}

		var button = document.createElement( 'button' );
		button.style.position = 'absolute';
		button.style.left = 'calc(50% - 50px)';
		button.style.bottom = '20px';
		button.style.width = '100px';
		button.style.border = '0';
		button.style.padding = '8px';
		button.style.cursor = 'pointer';
		button.style.backgroundColor = '#000';
		button.style.color = '#fff';
		button.style.fontFamily = 'sans-serif';
		button.style.fontSize = '13px';
		button.style.fontStyle = 'normal';
		button.style.textAlign = 'center';
		button.style.zIndex = '999';

		if ( display ) {

			button.textContent = 'ENTER VR';
			button.onclick = function () {

				display.isPresenting ? display.exitPresent() : display.requestPresent( [ { source: canvas } ] );

			};

			window.addEventListener( 'vrdisplaypresentchange', function () {

				button.textContent = display.isPresenting ? 'EXIT VR' : 'ENTER VR';

			}, false );

		} else {

			button.textContent = 'NO VR DISPLAY';

		}
		return button;
	}
}