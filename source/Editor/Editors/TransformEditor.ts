/**
 * TransformEditor.ts
 *
 * @author mosframe / https://github.com/mosframe
 */

import { GL                     }   from '../../Engine/Graphic';
import { Component              }   from '../../Engine/Component';
import { Transform              }   from '../../Engine/Transform';

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

import { SetPositionCommand     }   from '../Commands/SetPositionCommand';
import { SetRotationCommand     }   from '../Commands/SetRotationCommand';
import { SetScaleCommand        }   from '../Commands/SetScaleCommand';
import { SetUuidCommand         }   from '../Commands/SetUuidCommand';
import { SetValueCommand        }   from '../Commands/SetValueCommand';
import { SetColorCommand        }   from '../Commands/SetColorCommand';

import { ComponentEditor        }   from './ComponentEditor';

/**
 * TransformEditor
 *
 * @export
 * @class TransformEditor
 * @extends {UIRow}
 */
export class TransformEditor extends ComponentEditor {

    /**
     * create
     *
     * @memberof TransformEditor
     */
    onCreate() {

        super.onCreate();


        let onChangedProperties = () => {

            let object = this._tool.selected;
            if( object === undefined || object === null ) return;

            this._onChangedProperties();

            let localPosition = this._component['localPosition'];

            let posX = <UINumber>this._drawers['localPosition.x'];
            let posY = <UINumber>this._drawers['localPosition.y'];
            let posZ = <UINumber>this._drawers['localPosition.z'];

            let newPosition = new GL.Vector3( posX.getValue(), posY.getValue(), posZ.getValue() );
            if ( localPosition.distanceTo( newPosition ) >= 0.01 ) {

                this._tool.execute( new SetPositionCommand( object, newPosition ) );

            }

            let localRotation = this._component['localRotation'];

            let rotX = <UINumber>this._drawers['localRotation.x'];
            let rotY = <UINumber>this._drawers['localRotation.y'];
            let rotZ = <UINumber>this._drawers['localRotation.z'];

            let newRotation = new GL.Euler( rotX.getValue() * GL.Math.DEG2RAD, rotY.getValue() * GL.Math.DEG2RAD, rotZ.getValue() * GL.Math.DEG2RAD );
            if ( localRotation.eulerAngles.distanceTo( newRotation.toVector3() ) >= 0.01 ) {

                this._tool.execute( new SetRotationCommand( object, newRotation ) );

            }

            let localScale = this._component['localScale'];

            let scaleX = <UINumber>this._drawers['localScale.x'];
            let scaleY = <UINumber>this._drawers['localScale.y'];
            let scaleZ = <UINumber>this._drawers['localScale.z'];

            let newScale = new GL.Vector3( scaleX.getValue(), scaleY.getValue(), scaleZ.getValue() );
            if ( localScale.distanceTo( newScale ) >= 0.01 ) {

                this._tool.execute( new SetScaleCommand( object, newScale ) );

            }
        }

        let drawerRow = new UIRow();

        drawerRow.add( new UIText( 'Position' ).setWidth( '90px' ) );
        let posX = this._drawers['localPosition.x'] = new UINumber().setWidth( '50px' ).onChange( onChangedProperties );
        let posY = this._drawers['localPosition.y'] = new UINumber().setWidth( '50px' ).onChange( onChangedProperties );
        let posZ = this._drawers['localPosition.z'] = new UINumber().setWidth( '50px' ).onChange( onChangedProperties );
        drawerRow.add( posX, posY, posZ );

        drawerRow.add( new UIText( 'Rotation' ).setWidth( '90px' ) );
        let rotX = this._drawers['localRotation.x'] = new UINumber().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onChange( onChangedProperties );
        let rotY = this._drawers['localRotation.y'] = new UINumber().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onChange( onChangedProperties );
        let rotZ = this._drawers['localRotation.z'] = new UINumber().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onChange( onChangedProperties );
        drawerRow.add( rotX, rotY, rotZ );

        drawerRow.add( new UIText( 'Scale' ).setWidth( '90px' ) );
        let scaleLock   = this._drawers['localScale.lock'] = new UICheckbox( true ).setPosition( 'absolute' ).setLeft( '75px' );
        let scaleX      = this._drawers['localScale.x'] = new UINumber( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( onChangedProperties );
        let scaleY      = this._drawers['localScale.y'] = new UINumber( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( onChangedProperties );
        let scaleZ      = this._drawers['localScale.z'] = new UINumber( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( onChangedProperties );
        drawerRow.add( scaleLock );
        drawerRow.add( scaleX, scaleY, scaleZ );

        this.add( drawerRow );
    }

    /**
     * update inspector GUI
     *
     * @memberof ComponentEditor
     */
    onInspectorGUI () {
        super.onInspectorGUI();

        let pos = this._component['localPosition'];
        this._drawers['localPosition.x'].setValue( pos.x );
        this._drawers['localPosition.y'].setValue( pos.y );
        this._drawers['localPosition.z'].setValue( pos.z );

        let rot = this._component['localEulerAngles'];
        this._drawers['localRotation.x'].setValue( rot.x );
        this._drawers['localRotation.y'].setValue( rot.y );
        this._drawers['localRotation.z'].setValue( rot.z );

        let scale = this._component['localScale'];
        this._drawers['localScale.x'].setValue( scale.x );
        this._drawers['localScale.y'].setValue( scale.y );
        this._drawers['localScale.z'].setValue( scale.z );
    }

    // [ Protected Functions ]

    protected _onChangedProperties2 = () => {
        this._onChangedProperties();
    }


}
window['UNITS']['EDITOR'][Transform.name] = TransformEditor;
