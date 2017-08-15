/**
 * ComponentEditor.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { GL                     }   from '../../Engine/Graphic';
import { Component              }   from '../../Engine/Component';

import { UNumber                }   from '../../Engine/UNumber';
import { UIElement              }   from '../../Engine/UI/UIElement';
import { UIPanel                }   from '../../Engine/UI/UIPanel';
import { UIButton               }   from '../../Engine/UI/UIButton';
import { UINumber               }   from '../../Engine/UI/UINumber';
import { UIDiv                  }   from '../../Engine/UI/UIDiv';
import { UISpan                 }   from '../../Engine/UI/UISpan';
import { UIRow                  }   from '../../Engine/UI/UIRow';
import { UIColor                }   from '../../Engine/UI/UIColor';
import { UIText                 }   from '../../Engine/UI/UIText';
import { UIBreak                }   from '../../Engine/UI/UIBreak';
import { UISelect               }   from '../../Engine/UI/UISelect';
import { UIBoolean              }   from '../../Engine/UI/UIBoolean';
import { UIInput                }   from '../../Engine/UI/UIInput';
import { UICheckbox             }   from '../../Engine/UI/UICheckbox';
import { UITextArea             }   from '../../Engine/UI/UITextArea';
import { UIInteger              }   from '../../Engine/UI/UIInteger';
import { UIOutliner             }   from '../UI/UIOutliner';
import { ITool                  }   from '../Interfaces';
import { ISignals               }   from '../Interfaces';

/**
 * ComponentEditor
 *
 * @export
 * @class ComponentEditor
 * @extends {UIRow}
 */
export class ComponentEditor extends UIPanel {


    /**
     * update
     *
     * @memberof ComponentEditor
     */
    onUpdate () {

        for( let key in this._component ) {
            if( key[0] === '_' ) continue;

            let value = this._component[key];
            let type = typeof(value);

            switch( type ) {
            case 'boolean':
                {
                    let drawer = <UICheckbox>this._drawers[key];
                    drawer.setValue( value );
                }
                break;
            case 'number':
                {
                    let drawer = <UINumber>this._drawers[key];
                    drawer.setValue( value );
                }
                break;
            case 'string':
                {
                    let drawer = <UIInput>this._drawers[key];
                    drawer.setValue( value );
                }
                break;
            case 'object':
                if( value instanceof Array ) {

                    let drawers = <UIText[]>this._drawers[key];
                    for( let v in value ) {
                        drawers[v].setValue( value[v] );
                    }

                } else {
                    let drawer = <UIText>this._drawers[key];
                    drawer.setValue( value );
                }
                break;
            }
        }
    }

    // [ Constructor ]

    constructor ( component:Component, tool:ITool ) {
        super( component.constructor.name );

        this._tool      = tool;
        this._component = component;

        // [ Border ]

        this.setBorder('1px');
        this.setBorderColor( '0x000000' )
        this.setStyle('border-style',['solid']);
        this.setMargin( '5px','0px','5px','0px' ); //top,right,bottom,left
        this.setPadding( '0px','0px','0px','0px' ); //top,right,bottom,left

        // [ Title ]

        let titleRow     = new UIRow();
        let titleText    = new UIText();

        titleRow.add( new UIText( component.constructor.name ).setWidth( '200px' ).setFontWeight('bold') );
        this.add( titleRow );

        // [ Properties ]

        for( let key in this._component ) {
            if( key[0] === '_' ) continue;

            let value = this._component[key];
            let type = typeof(value);

            //console.log(this._component.constructor.name,key,type);

            let drawerRow = new UIRow();
            drawerRow.add( new UIText( key ).setWidth( '90px' ) );

            switch(type){
            case 'boolean':
                drawerRow.add( this._drawers[key] = new UICheckbox().onChange( ()=>{this._onChange();} ) );
                break;
            case 'number':
                drawerRow.add( this._drawers[key] = new UINumber().setWidth( '50px' ).onChange( ()=>{this._onChange();} ) );
                break;
            case 'string':
                drawerRow.add( this._drawers[key] = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).setDisabled(true).onChange( ()=>{this._onChange();} ) );
                break;
            case 'object':
                if( value instanceof Array ) {
                    this._drawers[key] = [];
                    for( let v in value ) {
                        drawerRow.add( this._drawers[key][v] = new UIText().setWidth( '150px' ).onChange( ()=>{this._onChange();} ) );
                    }
                } else {
                    drawerRow.add( this._drawers[key] = new UIText().setWidth( '150px' ).onChange( ()=>{this._onChange();} ) );
                }
                break;
            }
            this.add( drawerRow );
        }
    }

    // [ Protected Variables ]

    protected _tool     : ITool;
    protected _component: Component;
    protected _drawers  : {[member:string]:any} = {};

    // [ Protected Functions ]

    protected _onChange () {

        let object = this._tool.selected;
        if( object === undefined || object === null ) return;

        for( let key in this._component ) {
            if( key[0] === '_' ) continue;

            let value = this._component[key];
            let type = typeof(value);

            switch(type){
            case 'boolean':
                break;
            case 'number':
                let drawer = <UINumber>this._drawers[key];
                let newValue = drawer.getValue();
                if( newValue !== value ) {

                    // TODO : 컴멘더로 실행해야 한다.
                    //this._tool.execute( new SetComponentPropertyCommand( object, newValue ) );
                    this._component[key] = newValue;
                }
                break;
            case 'string':
                break;
            case 'object':
                break;
            }
        }
    }
}
window['UNITS']['EDITOR'][Component.name] = ComponentEditor;
