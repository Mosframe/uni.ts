/**
 * add menubar
 *
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import * as GL                          from '../../UnitsEngine/Graphic'                ;
import { UIPanel                    }   from '../../UnitsEngine/UI/UIPanel'             ;
import { UIRow                      }   from '../../UnitsEngine/UI/UIRow'               ;
import { UIButton                   }   from '../../UnitsEngine/UI/UIButton'            ;
import { UINumber                   }   from '../../UnitsEngine/UI/UINumber'            ;
import { UIText                     }   from '../../UnitsEngine/UI/UIText'              ;
import { UIBoolean                  }   from '../../UnitsEngine/UI/UIBoolean'           ;
import { UIHorizontalRule           }   from '../../UnitsEngine/UI/UIHorizontalRule'    ;
import { IEditor                    }   from '../Interfaces'                            ;
import { AddObjectCommand           }   from '../Commands/AddObjectCommand'             ;
import { RemoveObjectCommand        }   from '../Commands/RemoveObjectCommand'          ;
import { SetMaterialValueCommand    }   from '../Commands/SetMaterialValueCommand'      ;
import { MultiCmdsCommand           }   from '../Commands/MultiCmdsCommand'             ;
import { Menu                       }   from './Menu'                                   ;

/**
 * add menubar
 *
 * @export
 * @class AddMenu
 * @extends {Menu}
 */
export class AddMenu extends Menu {

    // [ Constructor ]

    constructor( editor:IEditor ) {
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

        let meshCount = 0;
        let lightCount = 0;
        let cameraCount = 0;

        editor.signals.editorCleared.add( () => {

            meshCount = 0;
            lightCount = 0;
            cameraCount = 0;
        });

        // [ Group ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Group' );
            option.onClick( () => {

                let mesh = new GL.Group();
                mesh.name = 'Group ' + ( ++ meshCount );
                editor.execute( new AddObjectCommand( mesh ) );
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

                let geometry = new GL.PlaneBufferGeometry( 2, 2 );
                let material = new GL.MeshStandardMaterial();
                let mesh = new GL.Mesh( geometry, material );
                mesh.name = 'Plane ' + ( ++ meshCount );

                editor.execute( new AddObjectCommand( mesh ) );

            });
            options.add( option );
        }

        // [ Box ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Box' );
            option.onClick( () => {

                let geometry    = new GL.BoxBufferGeometry( 1, 1, 1 );
                let mesh        = new GL.Mesh( geometry, new GL.MeshStandardMaterial() );
                mesh.name = 'Box ' + ( ++ meshCount );

                editor.execute( new AddObjectCommand( mesh ) );

            });
            options.add( option );
        }

        // [ Circle ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Circle' );
            option.onClick( () => {

                let radius = 1;
                let segments = 32;

                let geometry = new GL.CircleBufferGeometry( radius, segments );
                let mesh = new GL.Mesh( geometry, new GL.MeshStandardMaterial() );
                mesh.name = 'Circle ' + ( ++ meshCount );

                editor.execute( new AddObjectCommand( mesh ) );

            });
            options.add( option );
        }
        // [ Cylinder ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Cylinder' );
            option.onClick( () => {

                let radiusTop = 1;
                let radiusBottom = 1;
                let height = 2;
                let radiusSegments = 32;
                let heightSegments = 1;
                let openEnded = false;

                let geometry = new GL.CylinderBufferGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
                let mesh = new GL.Mesh( geometry, new GL.MeshStandardMaterial() );
                mesh.name = 'Cylinder ' + ( ++ meshCount );

                editor.execute( new AddObjectCommand( mesh ) );

            });
            options.add( option );
        }

        // [ Sphere ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Sphere' );
            option.onClick( () => {

                let radius          = 1;
                let widthSegments   = 32;
                let heightSegments  = 16;
                let phiStart        = 0;
                let phiLength       = Math.PI * 2;
                let thetaStart      = 0;
                let thetaLength     = Math.PI;

                let geometry = new GL.SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
                let mesh = new GL.Mesh( geometry, new GL.MeshStandardMaterial() );
                mesh.name = 'Sphere ' + ( ++ meshCount );

                editor.execute( new AddObjectCommand( mesh ) );

            });
            options.add( option );
        }

        // [ Icosahedron ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Icosahedron' );
            option.onClick( () => {

                let radius = 1;
                let detail = 2;

                let geometry = new GL.IcosahedronGeometry( radius, detail );
                let mesh = new GL.Mesh( geometry, new GL.MeshStandardMaterial() );
                mesh.name = 'Icosahedron ' + ( ++ meshCount );

                editor.execute( new AddObjectCommand( mesh ) );

            });
            options.add( option );
        }

        // [ Torus ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Torus' );
            option.onClick( () => {

                let radius = 2;
                let tube = 1;
                let radialSegments = 32;
                let tubularSegments = 12;
                let arc = Math.PI * 2;

                let geometry = new GL.TorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc );
                let mesh = new GL.Mesh( geometry, new GL.MeshStandardMaterial() );
                mesh.name = 'Torus ' + ( ++ meshCount );

                editor.execute( new AddObjectCommand( mesh ) );

            });
            options.add( option );
        }

        // [ TorusKnot ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'TorusKnot' );
            option.onClick( () => {

                let radius = 2;
                let tube = 0.8;
                let tubularSegments = 64;
                let radialSegments = 12;
                let p = 2;
                let q = 3;

                let geometry = new GL.TorusKnotBufferGeometry( radius, tube, tubularSegments, radialSegments, p, q );
                let mesh = new GL.Mesh( geometry, new GL.MeshStandardMaterial() );
                mesh.name = 'TorusKnot ' + ( ++ meshCount );

                editor.execute( new AddObjectCommand( mesh ) );

            });
            options.add( option );
        }

        /*
        // [ Teapot ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Teapot' );
            option.onClick( () => {

                let size = 50;
                let segments = 10;
                let bottom = true;
                let lid = true;
                let body = true;
                let fitLid = false;
                let blinnScale = true;

                let material = new GL.MeshStandardMaterial();

                let geometry = new GL.TeapotBufferGeometry( size, segments, bottom, lid, body, fitLid, blinnScale );
                let mesh = new GL.Mesh( geometry, material );
                mesh.name = 'Teapot ' + ( ++ meshCount );

                editor.addObject( mesh );
                editor.select( mesh );

            });
            options.add( option );
        }
        */

        // [ Lathe ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'Lathe' );
            option.onClick( () => {

                let points = [
                    new GL.Vector3( 0, 0 ),
                    new GL.Vector3( 4, 0 ),
                    new GL.Vector3( 3.5, 0.5 ),
                    new GL.Vector3( 1, 0.75 ),
                    new GL.Vector3( 0.8, 1 ),
                    new GL.Vector3( 0.8, 4 ),
                    new GL.Vector3( 1, 4.2 ),
                    new GL.Vector3( 1.4, 4.8 ),
                    new GL.Vector3( 2, 5 ),
                    new GL.Vector3( 2.5, 5.4 ),
                    new GL.Vector3( 3, 12 )
                ];
                let segments = 20;
                let phiStart = 0;
                let phiLength = 2 * Math.PI;

                let geometry = new GL.LatheBufferGeometry( points, segments, phiStart, phiLength );
                let mesh = new GL.Mesh( geometry, new GL.MeshStandardMaterial( { side: GL.DoubleSide } ) );
                mesh.name = 'Lathe ' + ( ++ meshCount );

                editor.execute( new AddObjectCommand( mesh ) );

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

                editor.execute( new AddObjectCommand( sprite ) );

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

                let color = 0xffffff;
                let intensity = 1;
                let distance = 0;

                let light = new GL.PointLight( color, intensity, distance );
                light.name = 'PointLight ' + ( ++ lightCount );

                editor.execute( new AddObjectCommand( light ) );

            });
            options.add( option );
        }

        // [ SpotLight ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'SpotLight' );
            option.onClick( () => {

                let color = 0xffffff;
                let intensity = 1;
                let distance = 0;
                let angle = Math.PI * 0.1;
                let penumbra = 0;

                let light = new GL.SpotLight( color, intensity, distance, angle, penumbra );
                light.name = 'SpotLight ' + ( ++ lightCount );
                light.target.name = 'SpotLight ' + ( lightCount ) + ' Target';

                light.position.set( 5, 10, 7.5 );

                editor.execute( new AddObjectCommand( light ) );

            });
            options.add( option );
        }

        // [ DirectionalLight ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'DirectionalLight' );
            option.onClick( () => {

                let color = 0xffffff;
                let intensity = 1;

                let light = new GL.DirectionalLight( color, intensity );
                light.name = 'DirectionalLight ' + ( ++ lightCount );
                light.target.name = 'DirectionalLight ' + ( lightCount ) + ' Target';

                light.position.set( 5, 10, 7.5 );

                editor.execute( new AddObjectCommand( light ) );

            });
            options.add( option );
        }

        // [ HemisphereLight ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'HemisphereLight' );
            option.onClick( () => {

                let skyColor = 0x00aaff;
                let groundColor = 0xffaa00;
                let intensity = 1;

                let light = new GL.HemisphereLight( skyColor, groundColor, intensity );
                light.name = 'HemisphereLight ' + ( ++ lightCount );

                light.position.set( 0, 10, 0 );

                editor.execute( new AddObjectCommand( light ) );

            });
            options.add( option );
        }

        // [ AmbientLight ]
        {
            let option = new UIRow();
            option.setClass( 'option' );
            option.setTextContent( 'AmbientLight' );
            option.onClick( () => {

                let color = 0x222222;
                let light = new GL.AmbientLight( color );
                light.name = 'AmbientLight ' + ( ++ lightCount );
                editor.execute( new AddObjectCommand( light ) );

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

                let camera = new GL.PerspectiveCamera( 50, 1, 1, 10000 );
                camera.name = 'PerspectiveCamera ' + ( ++ cameraCount );
                editor.execute( new AddObjectCommand( camera ) );
            });
            options.add( option );
        }
    }
}
