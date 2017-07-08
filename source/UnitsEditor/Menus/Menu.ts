/**
 * Menu.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { UIPanel }  from '../../UnitsEngine/UI/UIPanel';

/**
 * Menu
 *
 * @export
 * @class Menu
 * @extends {UIPanel}
 */
export class Menu extends UIPanel {

    //[ Constructor ]

    constructor( title:string ) {

        super();
        this.setTitle( title );
        this.setClass( 'menu' );
    }
}