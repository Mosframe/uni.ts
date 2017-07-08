/**
 * uni.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { Editor     }   from './UnitsEditor/Editor';
import { Menubar    }   from './UnitsEditor/Menubar';


// [ editor ]
let editor = new Editor();

let menubar = new Menubar( editor );

console.log( "hello world" );