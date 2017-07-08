/**
 * uni.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { Editor     }   from './Editor/Editor';
import { Menubar    }   from './Editor/Menubar';
import { Toolbar    }   from './Editor/Toolbar';


// [ Editor ]
let editor = new Editor();

// [ Menubar ]
let menubar = new Menubar( editor );

// [ Toolbar ]
let toolbar = new Toolbar( editor );

console.log( "hello world" );