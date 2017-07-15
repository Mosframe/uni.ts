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
import { ITool              }   from '../Interfaces';
import { MoveObjectCommand  }   from '../Commands/MoveObjectCommand'


/**
 * UIOutliner
 *
 * @export
 * @class UIOutliner
 * @extends {UIElement}
 */
export class UIOutliner extends UIElement {

    // [ Public Variables ]

    get options () : HTMLDivElement[] {
        return this._options;
    }

    // [ Public Functions ]

    selectIndex ( index:number ) {

        if ( index >= 0 && index < this._options.length ) {

            this.setValue( this._options[ index ]['value'] );

            let changeEvent = document.createEvent( 'HTMLEvents' );
            changeEvent.initEvent( 'change', true, true );
            this.core.dispatchEvent( changeEvent );
        }
    }

    setOptions ( options:HTMLDivElement[] ) {

        let scope = this;

        while ( scope.core.children.length > 0 ) {
            if( scope.core.firstChild ) scope.core.removeChild( scope.core.firstChild );
        }

        function onClick() {
            let option = <HTMLDivElement>this;
            scope.setValue( option['value'] );
            let changeEvent = document.createEvent( 'HTMLEvents' );
            changeEvent.initEvent( 'change', true, true );
            scope.core.dispatchEvent( changeEvent );
        }

        // Drag

    	let currentDrag:any;

        function onDrag( event ) {
            currentDrag = this;
        }

        function onDragStart( event ) {
            event.dataTransfer.setData( 'text', 'foo' );
        }

        function onDragOver( event ) {

            let option = <HTMLDivElement>this;

            if ( option === currentDrag ) return;

            let area = event.offsetY / option.clientHeight;

            if ( area < 0.25 ) {

                option.className = 'option dragTop';

            } else if ( area > 0.75 ) {

                option.className = 'option dragBottom';

            } else {

                option.className = 'option drag';

            }
        }

        function onDragLeave() {

            let option = <HTMLDivElement>this;
            if ( option === currentDrag ) return;

            option.className = 'option';
        }

        function onDrop( event ) {

            let option = <HTMLDivElement>this;
            if ( option === currentDrag ) return;

            option.className = 'option';

            let scene = scope._tool.scene;
            let object = scene.getObjectById( currentDrag['value'] );

            let area = event.offsetY / option.clientHeight;

            if ( area < 0.25 ) {

                let nextObject = scene.getObjectById( option['value'] );
                moveObject( object, nextObject.parent, nextObject );

            } else if ( area > 0.75 ) {
                let nextOption = option.nextSibling;
                if( nextOption ) {
                    let nextObject = scene.getObjectById( nextOption['value'] );
                    moveObject( object, nextObject.parent, nextObject );
                }

            } else {
                let parentObject = scene.getObjectById( option['value'] );
                moveObject( object, parentObject );
            }
        }

        function moveObject( object, newParent, nextObject?:any ) {

            if ( nextObject === null ) nextObject = undefined;

            let newParentIsChild = false;

            object.traverse( ( child ) => {
                if ( child === newParent ) newParentIsChild = true;
            });

            if ( newParentIsChild ) return;

            scope._tool.execute( new MoveObjectCommand( object, newParent, nextObject ) );

            let changeEvent = document.createEvent( 'HTMLEvents' );
            changeEvent.initEvent( 'change', true, true );
            scope.core.dispatchEvent( changeEvent );
        }

        //

        scope._options = [];

        for ( let i = 0; i < options.length; i ++ ) {

            let option = options[ i ];
            option.className = 'option';
            scope.core.appendChild( option );

            scope._options.push( option );

            option.addEventListener( 'click', onClick, false );

            if ( option.draggable === true ) {

                option.addEventListener( 'drag'        , onDrag        , false );
                option.addEventListener( 'dragstart'   , onDragStart   , false ); // Firefox needs this
                option.addEventListener( 'dragover'    , onDragOver    , false );
                option.addEventListener( 'dragleave'   , onDragLeave   , false );
                option.addEventListener( 'drop'        , onDrop        , false );
            }
        }
        return scope;
    }

    getValue () : number {
        return this._selectedValue;
    }

    setValue ( value:number ) {
        for ( let i = 0; i < this._options.length; i ++ ) {

            let option = this._options[ i ];

            if ( option['value'] === value ) {

                option.classList.add( 'active' );

                // scroll into view

                let y = option.offsetTop - this.core.offsetTop;
                let bottomY = y + option.offsetHeight;
                let minScroll = bottomY - this.core.offsetHeight;

                if ( this.core.scrollTop > y ) {

                    this.core.scrollTop = y;

                } else if ( this.core.scrollTop < minScroll ) {

                    this.core.scrollTop = minScroll;
                }

                this._selectedIndex = i;

            } else {
                option.classList.remove( 'active' );
            }
        }

        this._selectedValue = value;

        return this;
    }

    // [ Constructor ]

    constructor ( tool:ITool ) {

        super( document.createElement( 'div' ), 'outliner' );

        this.core.tabIndex = 0;	// keyup event is ignored without setting tabIndex

        this._tool = tool;

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
        this._selectedIndex  =-1;
        this._selectedValue  = 0;

        return this;

    }

    // [ Core ]

    get core() : HTMLDivElement { return <HTMLDivElement>this._core; }

    // [ Protected Variables ]

    protected _tool             : ITool;
    protected _selectedIndex    : number;
    protected _selectedValue    : number;
    protected _options          : HTMLDivElement[];
}
