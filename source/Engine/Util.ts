/**
 * Util.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

/**
 * Utility
 *
 * @export
 * @class Util
 */
export class Util {

    /**
     * clone object
     *
     * @static
     * @param {*} original
     * @returns {*}
     *
     * @memberof Util
     */
    static clone( original:any ) : any {
        return Object.assign(Object.create(original), original);
    }


    /*
    object타입이 아닌경우 _가 없으면 저장한다.
        get set이 모두 존재하는 경우 저장한다.

    object타입인경우
        일반 오브젝트인경우
            하위를 모두 저장한다.
        Object3D타입인 경우
            uuid만 저장, 나중에 검색하여 링크
        Component타입인 경우
            등록이 되어있는지 검사 window['units']
            등록되어 있지 않으면
        ScriptableObject 타입인 경우
        그외타입인경우

    */

    /**
     *
     *
     * @static
     * @param {Object} obj
     * @returns {*}
     * @memberof Util
     */
    static serialize (obj:Object) : any {

        if (obj === null) { return obj; }

        if (obj instanceof Array) {
            let output: any[] = [];
            for (let key in obj) {
                if (typeof obj[key] === 'object') {
                    output[key] = this.serialize(obj[key]);
                } else {
                    output[key] = obj[key];
                }
            }
            return output;
        } else {
            let output: any = {};

            if (obj.constructor.name in window['units']) {
                //if (obj.constructor.arguments === null) {
                output.class = obj.constructor.name;
                //}
            }

            for (let key in obj) {
                if (key[0] !== '_') {
                    let val = obj[key];
                    let p:Object|null = obj;
                    while(p) {
                        let descriptor = Object.getOwnPropertyDescriptor(p, key);
                        if (descriptor && ((descriptor.get && descriptor.set) || (!descriptor.get && !descriptor.set))) {
                            if ( typeof val !== 'function') {
                              if (typeof val === 'object') {
                                  output[key] = this.serialize(val);
                              } else {
                                  output[key] = val;
                              }
                            }
                            p=null;
                        } else {
                            p = Object.getPrototypeOf(p);
                        }
                    }
                }
            }
            return output;
        }
    }
    /**
     * deserialize
     *
     * @static
     * @param {any} target
     * @param {any} meta
     * @param {any} environment
     * @returns
     * @memberof Util
     */
    static deserialize( target, meta, environment ) {
      for (let property in meta) {

            if (property === 'class') continue;

            if (!target.hasOwnProperty(property)) {
              target[property] = meta[property];
            }

            if (target.hasOwnProperty(property)) {

                let targetProp  = target[property];
                let metaProp    = meta[property];

                if (metaProp instanceof Array) {
                    for (let key in metaProp) {
                        console.log( "key", metaProp[key] );
                        if (typeof metaProp[key] === 'object') {
                            targetProp[key] = this.deserialize( targetProp[key], metaProp[key], environment );
                        }
                        else {
                            targetProp[key] = metaProp[key];
                        }
                    }
                }
                else
                if (typeof metaProp === 'object') {

                    if( metaProp.class in window ) {
                      targetProp = new window[metaProp.class]();
                    }
                    else
                    if( metaProp.class in window['units'] ) {
                      targetProp = new environment[metaProp.class]();
                    }
                    else {
                      targetProp = {};
                    }

                    target[property] = this.deserialize(targetProp, metaProp, environment);
                }
                else {
                    target[property] = metaProp;
                }
            }
        }
        return target;
    }

}
