/**
 * add menubar
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import * as GL                          from '../../Engine/Graphic';
import { UIPanel                    }   from '../../Engine/UI/UIPanel';
import { UIRow                      }   from '../../Engine/UI/UIRow';
import { UIButton                   }   from '../../Engine/UI/UIButton';
import { UINumber                   }   from '../../Engine/UI/UINumber';
import { UIText                     }   from '../../Engine/UI/UIText';
import { UIBoolean                  }   from '../../Engine/UI/UIBoolean';
import { UIHorizontalRule           }   from '../../Engine/UI/UIHorizontalRule';
import { ITool                      }   from '../Interfaces';
import { AddObjectCommand           }   from '../Commands/AddObjectCommand';
import { RemoveObjectCommand        }   from '../Commands/RemoveObjectCommand';
import { SetMaterialValueCommand    }   from '../Commands/SetMaterialValueCommand';
import { MultiCmdsCommand           }   from '../Commands/MultiCmdsCommand';
import { Menu                       }   from './Menu';

import { Camera                     }   from '../../Engine/Camera';
import { GameObject                 }   from '../../Engine/GameObject';
import { Geometry                   }   from '../../Engine/Geometry';
import { Light                      }   from '../../Engine/Light';
import { LightType                  }   from '../../Engine/LightType';
import { Mesh                       }   from '../../Engine/Mesh';
import { MeshFilter                 }   from '../../Engine/MeshFilter';
import { MeshStandardMaterial       }   from '../../Engine/MeshStandardMaterial';
import { MeshRenderer               }   from '../../Engine/MeshRenderer';
import { PrimitiveType              }   from '../../Engine/PrimitiveType';

/**
 * add menubar
 *
 * @export
 * @class AddMenu
 * @extends {Menu}
 */
export class AddMenu extends Menu {

    // [ Constructor ]

    constructor( tool:ITool ) {
        super('add');

        // [ Title ]
        let title = new UIPanel();
        title.setClass( 'title' );
        title.setTextContent( 'Add' );
        this.add( title );

        // [ Options ]
        let options = new UIPanel();
        options.setClass( 'options' );
        this.add( options );

        let meshCount   = 0;
        let lightCount  = 0;
        let cameraCount = 0;

        tool.signals.editorCleared.add( () => {
            meshCount   = 0;
            lightCount  = 0;
            cameraCount = 0;
        });

        // [ Group ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Group' );
            option.onClick( () => {

                let gameObject = new GameObject('Group');
                tool.execute( new AddObjectCommand( gameObject.core ) );
            });
            options.add( option );
        }

        options.add( new UIHorizontalRule() );

        // [ Plane ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Plane' );
            option.onClick( () => {

                let gameObject = GameObject.createPrimitive( PrimitiveType.Plane );
                tool.execute( new AddObjectCommand( gameObject.core ) );
            });
            options.add( option );
        }

        // [ Cube ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Cube' );
            option.onClick( () => {

                let gameObject = GameObject.createPrimitive( PrimitiveType.Cube );
                tool.execute( new AddObjectCommand( gameObject.core ) );
            });
            options.add( option );
        }

        // [ Circle ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Circle' );
            option.onClick( () => {

                let gameObject = GameObject.createPrimitive( PrimitiveType.Circle );
                tool.execute( new AddObjectCommand( gameObject.core ) );

            });
            options.add( option );
        }
        // [ Cylinder ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Cylinder' );
            option.onClick( () => {

                let gameObject = GameObject.createPrimitive( PrimitiveType.Cylinder );
                tool.execute( new AddObjectCommand( gameObject.core ) );

            });
            options.add( option );
        }

        // [ Sphere ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Sphere' );
            option.onClick( () => {

                let gameObject = GameObject.createPrimitive( PrimitiveType.Sphere );
                tool.execute( new AddObjectCommand( gameObject.core ) );

            });
            options.add( option );
        }

        // [ Icosahedron ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Icosahedron' );
            option.onClick( () => {

                let gameObject = GameObject.createPrimitive( PrimitiveType.Icosahedron );
                tool.execute( new AddObjectCommand( gameObject.core ) );

            });
            options.add( option );
        }

        // [ Torus ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Torus' );
            option.onClick( () => {

                let gameObject = GameObject.createPrimitive( PrimitiveType.Torus );
                tool.execute( new AddObjectCommand( gameObject.core ) );
            });
            options.add( option );
        }

        // [ TorusKnot ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'TorusKnot' );
            option.onClick( () => {

                let gameObject = GameObject.createPrimitive( PrimitiveType.TorusKnot );
                tool.execute( new AddObjectCommand( gameObject.core ) );

            });
            options.add( option );
        }

        // [ Lathe ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Lathe' );
            option.onClick( () => {

                let gameObject = GameObject.createPrimitive( PrimitiveType.Lathe );
                tool.execute( new AddObjectCommand( gameObject.core ) );
            });
            options.add( option );
        }

        // [ Sprite ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Sprite' );
            option.onClick( () => {

                let sprite = new GL.Sprite( new GL.SpriteMaterial() );
                sprite.name = 'Sprite ' + ( ++ meshCount );

                let gameObject = new GameObject( sprite.name );
                gameObject.core = sprite;

                tool.execute( new AddObjectCommand( gameObject.core ) );

            });
            options.add( option );
        }

        options.add( new UIHorizontalRule() );

        // [ PointLight ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'PointLight' );
            option.onClick( () => {

                let gameObject = new GameObject( 'PointLight' );
                let light = gameObject.addComponent( Light );
                if( light !== undefined ) {
                    light.type = LightType.Point;
                }
                tool.execute( new AddObjectCommand( gameObject.core ) );
            });
            options.add( option );
        }

        // [ SpotLight ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'SpotLight' );
            option.onClick( () => {

                let gameObject = new GameObject( 'SpotLight' );
                let light = gameObject.addComponent( Light );
                if( light !== undefined ) {
                    light.type = LightType.Spot;
                }
                tool.execute( new AddObjectCommand( gameObject.core ) );
            });
            options.add( option );
        }

        // [ DirectionalLight ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'DirectionalLight' );
            option.onClick( () => {

                let gameObject = new GameObject( 'DirectionalLight' );
                let light = gameObject.addComponent( Light );
                if( light !== undefined ) {
                    light.type = LightType.Directional;
                }
                tool.execute( new AddObjectCommand( gameObject.core ) );
            });
            options.add( option );
        }

        // [ HemisphereLight ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'HemisphereLight' );
            option.onClick( () => {

                let gameObject = new GameObject( 'HemisphereLight' );
                let light = gameObject.addComponent( Light );
                if( light !== undefined ) {
                    light.type = LightType.Hemisphere;
                }
                tool.execute( new AddObjectCommand( gameObject.core ) );
            });
            options.add( option );
        }

        // [ AmbientLight ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'AmbientLight' );
            option.onClick( () => {

                let gameObject = new GameObject( 'AmbientLight' );
                let light = gameObject.addComponent( Light );
                if( light !== undefined ) {
                    light.type = LightType.Ambient;
                }
                tool.execute( new AddObjectCommand( gameObject.core ) );
            });
            options.add( option );
        }

        options.add( new UIHorizontalRule() );

        // [ PerspectiveCamera ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'PerspectiveCamera' );
            option.onClick( () => {

                //let camera = new GL.PerspectiveCamera( 50, 1, 1, 10000 );
                //camera.name = 'PerspectiveCamera ' + ( ++ cameraCount );

                let gameObject = new GameObject( 'Camera' );
                let camera = gameObject.addComponent( Camera );
                if( camera !== undefined ) {
                    //camera.type =
                }
                tool.execute( new AddObjectCommand( gameObject.core ) );
            });
            options.add( option );
        }
    }
}
