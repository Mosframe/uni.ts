/**
 * UNumber.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

export class UNumber {

    /**
     * number to string
     *
     * @export
     * @param {number} number
     * @returns {string}
     */
    static toString( number:number ) : string {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }
}
