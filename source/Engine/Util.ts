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
    클래스 멤버들중에 오브젝트형이면
        Ubject에서 상속받은 객채들은 메타에서 검색해서 없으면 메타의 오브젝트 리스트에 기록한다.
            UUID만 기록한다.
        하위를 검색할때도 루트 메타를 검색하여 모두 오브젝트 리스트에 등록이 되도록 처리한다.
        Ubject에서 상속받은 객체가 아니면 시리얼라이징 오브젝트로 판단하고 객체에 포함시킨다.

    */

    /**
     * serialize
     *
     * @static
     * @param {Object} obj
     * @param {any} module
     * @param {any} [meta]
     * @returns {*}
     * @memberof Util
     */
    static serialize ( target:Object, module:any, meta?:any ) : any {

        if (target === null) { return target; }

        if (target instanceof Array) {
            if( meta === undefined ) {
                meta = [];
            }
            for (let key in target) {
                if (typeof target[key] === 'object') {
                    meta[key] = this.serialize(target[key],module,meta[key]);
                } else {
                    meta[key] = target[key];
                }
            }
            return meta;
        } else {
            if( meta === undefined ) {
                meta = {};
            }
            if (target.constructor.name in module) {
                meta.class = target.constructor.name;
                if (target.constructor.arguments !== null) {
                    meta.arguments = target.constructor.arguments;
                }
            }

            for (let key in target) {
                if (key[0] !== '_') {
                    let val = target[key];
                    let p:Object|null = target;
                    while(p) {
                        let descriptor = Object.getOwnPropertyDescriptor(p, key);
                        if (descriptor && ((descriptor.get && descriptor.set) || (!descriptor.get && !descriptor.set))) {
                            if ( typeof val !== 'function') {
                                if (typeof val === 'object') {
                                    meta[key] = this.serialize(val,module,meta[key]);
                                } else {
                                    meta[key] = val;
                                }
                            }
                            p=null;
                        } else {
                            p = Object.getPrototypeOf(p);
                        }
                    }
                }
            }
            return meta;
        }
    }
    /**
     * deserialize
     *
     * @static
     * @param {any} target
     * @param {any} meta
     * @param {any} module
     * @returns
     * @memberof Util
     */
    static deserialize( target:Object, meta:any, module:any ) {

        console.log( "deserialize", target, meta, module );

        for (let property in meta) {

            if (property === 'class') continue;

            if (!target.hasOwnProperty(property)) {
                target[property] = meta[property];
            }

            if (target.hasOwnProperty(property)) {

                let targetProp  = target[property];
                let metaProp    = meta[property];

                if (metaProp instanceof Array) {
                    targetProp = [];
                    for (let key in metaProp) {
                        if (typeof metaProp[key] === 'object') {
                            targetProp[key] = {}; // 생성,,,
                            // 멤버오브젝트가 포함인지 참조인지 구분이 필요하다. : Serializable
                            targetProp[key] = this.deserialize( targetProp[key], metaProp[key], module );
                        }
                        else {
                            targetProp[key] = metaProp[key];
                        }
                    }
                }
                else
                if (typeof metaProp === 'object') {

                    if( metaProp.class in module ) {
                        if( module[metaProp.class].constructor.arguments ) {
                            targetProp = new module[metaProp.class](metaProp.arguments);
                        } else {
                            targetProp = new module[metaProp.class]();
                        }
                    }
                    else {
                      targetProp = {};
                    }

                    target[property] = this.deserialize(targetProp, metaProp, module);
                }
                else {
                    target[property] = metaProp;
                }
            }
        }
        return target;
    }
}
