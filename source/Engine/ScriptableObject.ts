import * as GL          from '../Engine/Graphic';
import {Ubject}         from '../Engine/Ubject';
/**
 * A class you can derive from if you want to create objects that don't need to be attached to game objects.
 *
 * @author mosframe / https://github.com/mosframe
 *
 * @export
 * @class ScriptableObject
 * @extends {UObject}
 */
export class ScriptableObject extends Ubject {


}
window['UNITS'][ScriptableObject.name]=ScriptableObject;
