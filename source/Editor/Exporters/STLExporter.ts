/**
 * STLExporter.ts
 *
 * @author kovacsv / http://kovacsv.hu/
 * @author mrdoob / http://mrdoob.com/
 * @author mosframe / https://github.com/mosframe
 */

import * as GL from '../../Engine/Graphic';

/**
 * STL Exporter
 *
 * @export
 * @class STLExporter
 */
export class STLExporter {

	parse ( scene ) {

		var vector = new GL.Vector3();
		var normalMatrixWorld = new GL.Matrix3();

		return function parse( scene ) {

			var output = '';

			output += 'solid exported\n';

			scene.traverse( function ( object ) {

				if ( object instanceof GL.Mesh ) {

					var geometry = object.geometry;
					var matrixWorld = object.matrixWorld;

					if( geometry instanceof GL.BufferGeometry ) {

						geometry = new GL.Geometry().fromBufferGeometry( geometry );

					}

					if ( geometry instanceof GL.Geometry ) {

						var vertices = geometry.vertices;
						var faces = geometry.faces;

						normalMatrixWorld.getNormalMatrix( matrixWorld );

						for ( var i = 0, l = faces.length; i < l; i ++ ) {

							var face = faces[ i ];

							vector.copy( face.normal ).applyMatrix3( normalMatrixWorld ).normalize();

							output += '\tfacet normal ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
							output += '\t\touter loop\n';

							var indices = [ face.a, face.b, face.c ];

							for ( var j = 0; j < 3; j ++ ) {

								vector.copy( vertices[ indices[ j ] ] ).applyMatrix4( matrixWorld );

								output += '\t\t\tvertex ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';

							}

							output += '\t\tendloop\n';
							output += '\tendfacet\n';

						}

					}

				}

			} );

			output += 'endsolid exported\n';

			return output;

		};

	}

}
