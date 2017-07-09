/**
 * uni.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { Tool           }   from './Editor/Tool';
import { Viewport       }   from './Editor/Viewport';
import { Menubar        }   from './Editor/Menubar';
import { Toolbar        }   from './Editor/Toolbar';
import { RightSidebar1  }   from './Editor/RightSidebar1';


// [ Editor ]
let editor = new Tool();

// [ Viewport ]
let viewport = new Viewport( editor );

// [ Menubar ]
let menubar = new Menubar( editor );

// [ Toolbar ]
let toolbar = new Toolbar( editor );

// [ RightSidebar1 ]
let rightSidebar1 = new RightSidebar1( editor );

console.log( "load finished" );