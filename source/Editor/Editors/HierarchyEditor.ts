/**
 * HierarchyEditor.ts
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import * as GL              from '../../Engine/Graphic';
import { UIPanel        }   from '../../Engine/UI/UIPanel';
import { UIButton       }   from '../../Engine/UI/UIButton';
import { UINumber       }   from '../../Engine/UI/UINumber';
import { UIDiv          }   from '../../Engine/UI/UIDiv';
import { UISpan         }   from '../../Engine/UI/UISpan';
import { UIRow          }   from '../../Engine/UI/UIRow';
import { UIColor        }   from '../../Engine/UI/UIColor';
import { UIText         }   from '../../Engine/UI/UIText';
import { UIBreak        }   from '../../Engine/UI/UIBreak';
import { UISelect       }   from '../../Engine/UI/UISelect';
import { UIBoolean      }   from '../../Engine/UI/UIBoolean';
import { UIOutliner     }   from '../UI/UIOutliner';
import { ITool          }   from '../Interfaces';
import { ISignals       }   from '../Interfaces';

/**
 * scene hierarchy editor
 *
 * @export
 * @class HierarchyEditor
 * @extends {UIPanel}
 */
export class HierarchyEditor extends UIPanel {

    // [ Constructor ]

    constructor ( tool:ITool ) {
        super( 'hierarchy' );

        this._tool      = tool;
        this._signals   = tool.signals;
        this.setBorderTop( '0' );
        this.setPaddingTop( '20px' );

        let ignoreObjectSelectedSignal = false;

        // [ outliner ]

        this._outliner = new UIOutliner( tool );
        this._outliner.setId( 'outliner' );
        this._outliner.onChange( () => {
            ignoreObjectSelectedSignal = true;
            this._tool.selectById( this._outliner.getValue() );
            ignoreObjectSelectedSignal = false;
        });
        this._outliner.onDblClick( () => {
            this._tool.focusById( this._outliner.getValue() );
        });
        this.add( this._outliner );
        this.add( new UIBreak() );

        // [ events ]

        this._signals.editorCleared.add( this._refreshUI );
        this._signals.sceneGraphChanged.add( this._refreshUI );
        this._signals.objectChanged.add( ( object:GL.Object3D ) => {

            let options = this._outliner.options;

            for ( let i = 0; i < options.length; i ++ ) {
                let option = options[ i ];
                if ( option['value'] === object.id ) {
                    option.innerHTML = this._buildHTML( object );
                    return;
                }
            }
        });

        this._signals.objectSelected.add( ( object:GL.Object3D ) => {
            if ( ignoreObjectSelectedSignal === true ) return;
            this._outliner.setValue( object !== null ? object.id : 0 );
        });

        //
        this._refreshUI();
    }


    // [ Private Variables ]

    private _tool       : ITool;
    private _signals    : ISignals;
    private _outliner   : UIOutliner;

    // [ Private Functions ]

    private _refreshUI = () => {

        let camera = this._tool.camera;
        let scene = this._tool.scene;

        let options:HTMLDivElement[] = [];

        options.push( this._buildOption( camera, false ) );
        options.push( this._buildOption( scene, false ) );

        this._addObjects( options, scene.children, 1 );

        this._outliner.setOptions( options );

        if ( this._tool.selected !== null ) {

            this._outliner.setValue( this._tool.selected.id );
        }
    }

    private _buildOption = ( object:GL.Object3D, draggable:boolean ) : HTMLDivElement => {

        let option = document.createElement( 'div' );
        option.draggable = draggable;
        option.innerHTML = this._buildHTML( object );
        option['value'] = object.id;

        return option;
    }

    private _getMaterialName = ( material:GL.Material ) => {

        if ( Array.isArray( material ) ) {
            let array:any = [];
            for ( let i = 0; i < material.length; i ++ ) {
                array.push( material[ i ].name );
            }
            return array.join( ',' );
        }
        return material.name;
    }

    private _buildHTML = ( object:GL.Object3D ) => {

        let html = '<span class="type ' + object.type + '"></span> ' + object.name;

        if ( object instanceof GL.Mesh ) {

            let geometry = object.geometry;
            let material = object.material;

            html += ' <span class="type ' + geometry.type + '"></span> ' + geometry.name;
            html += ' <span class="type ' + material.type + '"></span> ' + this._getMaterialName( material );

        }

        html += this._getScript( object.uuid );

        return html;

    }

    private _getScript = ( uuid:string ) => {

        if ( this._tool.scripts[ uuid ] !== undefined ) {
            return ' <span class="type Script"></span>';
        }
        return '';
    }

    private _addObjects = ( options:HTMLDivElement[], objects:GL.Object3D[], pad:number ) => {

        for ( let i = 0, l = objects.length; i < l; i ++ ) {

            let object = objects[ i ];
            let option = this._buildOption( object, true );
            option.style.paddingLeft = ( pad * 10 ) + 'px';
            options.push( option );

            this._addObjects( options, object.children, pad + 1 );
        }
    }
}
