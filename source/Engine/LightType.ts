/**
 * LightType.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

/**
 * The type of a Light.
 *
 * @export
 * @enum {number}
 */
export enum LightType {
    /*The light is a spot light.*/
    Spot        ,
    /*The light is a directional light.*/
    Directional ,
    /*The light is a point light.*/
    Point       ,
    /*The light is a hemispere light.*/
    Hemisphere  ,
    /*The light is a ambient light.*/
    Ambient     ,
    /*The light is an area light. It affects only lightmaps and lightprobes.*/
    Area        ,
}
window['UNITS']['LightType'] = LightType;
