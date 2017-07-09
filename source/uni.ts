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


// [ Tool ]
let tool = new Tool();

// [ Viewport ]
let viewport = new Viewport( tool );

// [ Menubar ]
let menubar = new Menubar( tool );

// [ Toolbar ]
let toolbar = new Toolbar( tool );

// [ RightSidebar1 ]
let rightSidebar1 = new RightSidebar1( tool );

console.log( "load finished" );