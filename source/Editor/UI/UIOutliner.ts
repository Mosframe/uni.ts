/**
 * UIOutliner.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import { UIElement          }   from '../../Engine/UI/UIElement';
import { UISpan             }   from '../../Engine/UI/UISpan';
import { UICheckbox         }   from '../../Engine/UI/UICheckbox';
import { UIText             }   from '../../Engine/UI/UIText';
import { IEditor            }   from '../Interfaces';
import { MoveObjectCommand  }   from '../Commands/MoveObjectCommand'


/**
 * UIOutliner
 *
 * @export
 * @class UIOutliner
 * @extends {UIElement}
 */
export class UIOutliner extends UIElement {

    constructor ( editor:IEditor ) {

        super( document.createElement( 'div' ), 'outliner' );

        this.core.tabIndex = 0;	// keyup event is ignored without setting tabIndex

        this._editor = editor;

        // Prevent native scroll behavior
        this.onKeyDown( ( event:KeyboardEvent ) => {

            switch ( event.keyCode ) {
            case 38: // up
            case 40: // down
                event.preventDefault();
                event.stopPropagation();
                break;
            }
        });

        // Keybindings to support arrow navigation
        this.onKeyUp ( ( event:KeyboardEvent ) => {

            switch ( event.keyCode ) {
            case 38: // up
                this.selectIndex( this._selectedIndex - 1 );
                break;
            case 40: // down
                this.selectIndex( this._selectedIndex + 1 );
                break;
            }
        });

        this._options        = [];
        this._selectedIndex  = - 1;
        this._selectedValue  = null;

        return this;

    }

    selectIndex ( index:number ) {

        if ( index >= 0 && index < this._options.length ) {

            this.setValue( this._options[ index ].value );

            let changeEvent = document.createEvent( 'HTMLEvents' );
            changeEvent.initEvent( 'change', true, true );
            this.core.dispatchEvent( changeEvent );
        }

    }

    setOptions ( options:any ) {

        let scope = this;

        while ( scope.core.children.length > 0 ) {
            if( scope.core.firstChild ) scope.core.removeChild( scope.core.firstChild );
        }


        function onClick() {

            scope.setValue( this.value );
            let changeEvent = document.createEvent( 'HTMLEvents' );
            changeEvent.initEvent( 'change', true, true );
            scope.core.dispatchEvent( changeEvent );
        }

        // Drag

    	let currentDrag;

        function onDrag( event ) {
            currentDrag = this;
        }

        function onDragStart( event ) {
            event.dataTransfer.setData( 'text', 'foo' );
        }

        function onDragOver( event ) {

            if ( this === currentDrag ) return;

            let area = event.offsetY / this.clientHeight;

            if ( area < 0.25 ) {

                this.className = 'option dragTop';

            } else if ( area > 0.75 ) {

                this.className = 'option dragBottom';

            } else {

                this.className = 'option drag';

            }
        }

        function onDragLeave() {

            if ( this === currentDrag ) return;

            this.className = 'option';
        }

        function onDrop( event ) {

            if ( this === currentDrag ) return;

            this.className = 'option';

            let scene = scope._editor.scene;
            let object = scene.getObjectById( currentDrag.value );

            let area = event.offsetY / this.clientHeight;

            if ( area < 0.25 ) {

                let nextObject = scene.getObjectById( this.value );
                moveObject( object, nextObject.parent, nextObject );

            } else if ( area > 0.75 ) {

                let nextObject = scene.getObjectById( this.nextSibling.value );
                moveObject( object, nextObject.parent, nextObject );

            } else {
                let parentObject = scene.getObjectById( this.value );
                moveObject( object, parentObject );
            }
        }

        function moveObject( object, newParent, nextObject?:any ) {

            if ( nextObject === null ) nextObject = undefined;

            let newParentIsChild = false;

            object.traverse( function ( child ) {

                if ( child === newParent ) newParentIsChild = true;

            } );

            if ( newParentIsChild ) return;

            this.editor.execute( new MoveObjectCommand( object, newParent, nextObject ) );

            let changeEvent = document.createEvent( 'HTMLEvents' );
            changeEvent.initEvent( 'change', true, true );
            scope.core.dispatchEvent( changeEvent );
        }

        //

        scope._options = [];

        for ( let i = 0; i < options.length; i ++ ) {

            let div = options[ i ];
            div.className = 'option';
            scope.core.appendChild( div );

            scope._options.push( div );

            div.addEventListener( 'click', onClick, false );

            if ( div.draggable === true ) {

                div.addEventListener( 'drag'        , onDrag        , false );
                div.addEventListener( 'dragstart'   , onDragStart   , false ); // Firefox needs this
                div.addEventListener( 'dragover'    , onDragOver    , false );
                div.addEventListener( 'dragleave'   , onDragLeave   , false );
                div.addEventListener( 'drop'        , onDrop        , false );
            }
        }
        return scope;
    }

    getValue () {

        return this._selectedValue;
    }

    setValue ( value ) {

        for ( let i = 0; i < this._options.length; i ++ ) {

            let element = this._options[ i ];

            if ( element.value === value ) {

                element.classList.add( 'active' );

                // scroll into view

                let y = element.offsetTop - this.core.offsetTop;
                let bottomY = y + element.offsetHeight;
                let minScroll = bottomY - this.core.offsetHeight;

                if ( this.core.scrollTop > y ) {

                    this.core.scrollTop = y;

                } else if ( this.core.scrollTop < minScroll ) {

                    this.core.scrollTop = minScroll;
                }

                this._selectedIndex = i;

            } else {
                element.classList.remove( 'active' );
            }
        }

        this._selectedValue = value;

        return this;
    }

    // [ Core ]

    get core() : HTMLDivElement { return <HTMLDivElement>this._core; }

    // [ Protected Variables ]

    protected _editor          : IEditor;
    protected _selectedIndex   : number;
    protected _selectedValue   : any;
    protected _options         : any;
    protected _value           : any;
    protected _clientHeight    : any;
    protected _nextSibling     : any;
}
