/*
 * TGALoader.ts
 *
 * @author Daosheng Mu / https://github.com/DaoshengMu/
 * @author mrdoob / http://mrdoob.com/
 * @author takahirox / https://github.com/takahirox/
 * @author mosframe / https://github.com/mosframe
 */

import { THREE }   from '../../Engine/Core';

// TGA Constants
const	TGA_TYPE_NO_DATA = 0;
const	TGA_TYPE_INDEXED = 1;
const	TGA_TYPE_RGB = 2;
const	TGA_TYPE_GREY = 3;
const	TGA_TYPE_RLE_INDEXED = 9;
const	TGA_TYPE_RLE_RGB = 10;
const	TGA_TYPE_RLE_GREY = 11;

const	TGA_ORIGIN_MASK = 0x30;
const	TGA_ORIGIN_SHIFT = 0x04;
const	TGA_ORIGIN_BL = 0x00;
const	TGA_ORIGIN_BR = 0x01;
const	TGA_ORIGIN_UL = 0x02;
const	TGA_ORIGIN_UR = 0x03;

/**
 * TGA Loader
 *
 * @export
 * @class TGALoader
 */
export class TGALoader {

	// [ Public Functions ]

	load ( url:any, onLoad:any, onProgress:any, onError:any ) : THREE.Texture {

		let texture = new THREE.Texture();

		let loader = new THREE.FileLoader( this._manager );
		loader.setResponseType( 'arraybuffer' );

		loader.load( url, ( buffer ) => {

			texture.image = this.parse( buffer );
			texture.needsUpdate = true;

			if ( onLoad !== undefined ) {

				onLoad( texture );

			}

		}, onProgress, onError );

		return texture;
	}

	// reference from vthibault, https://github.com/vthibault/roBrowser/blob/master/src/Loaders/Targa.js
	parse ( buffer ) {

		if ( buffer.length < 19 )
			console.error( 'GL.TGALoader.parse: Not enough data to contain header.' );

		let content = new Uint8Array( buffer );
		let offset = 0;
		let header = {
				id_length:       content[ offset ++ ],
				colormap_type:   content[ offset ++ ],
				image_type:      content[ offset ++ ],
				colormap_index:  content[ offset ++ ] | content[ offset ++ ] << 8,
				colormap_length: content[ offset ++ ] | content[ offset ++ ] << 8,
				colormap_size:   content[ offset ++ ],

				origin: [
					content[ offset ++ ] | content[ offset ++ ] << 8,
					content[ offset ++ ] | content[ offset ++ ] << 8
				],
				width:      content[ offset ++ ] | content[ offset ++ ] << 8,
				height:     content[ offset ++ ] | content[ offset ++ ] << 8,
				pixel_size: content[ offset ++ ],
				flags:      content[ offset ++ ]
			};
		this._header = header;

		// Check tga if it is valid format
		this.tgaCheckHeader( header );

		if ( header.id_length + offset > buffer.length ) {

			console.error( 'GL.TGALoader.parse: No data' );

		}

		// Skip the needn't data
		offset += header.id_length;

		// Get targa information about RLE compression and palette
		let use_rle = false,
			use_pal = false,
			use_grey = false;

		this._use_grey = use_grey;
		this._use_rle = use_rle;
		this._use_pal = use_pal;

		switch ( header.image_type ) {

			case TGA_TYPE_RLE_INDEXED:
				use_rle = true;
				use_pal = true;
				break;

			case TGA_TYPE_INDEXED:
				use_pal = true;
				break;

			case TGA_TYPE_RLE_RGB:
				use_rle = true;
				break;

			case TGA_TYPE_RGB:
				break;

			case TGA_TYPE_RLE_GREY:
				use_rle = true;
				use_grey = true;
				break;

			case TGA_TYPE_GREY:
				use_grey = true;
				break;

		}
		let canvas = document.createElement( 'canvas' );
		canvas.width = header.width;
		canvas.height = header.height;

		let context = canvas.getContext( '2d' );
		if( context ) {
			let imageData = context.createImageData( header.width, header.height );

			let result = this.tgaParse( use_rle, use_pal, header, offset, content );
			let rgbaData = this.getTgaRGBA( imageData.data, header.width, header.height, result.pixel_data, result.palettes );

			context.putImageData( imageData, 0, 0 );
		}
		return canvas;
	}

	tgaCheckHeader( header:any ) {

		switch ( header.image_type ) {

			// Check indexed type
			case TGA_TYPE_INDEXED:
			case TGA_TYPE_RLE_INDEXED:
				if ( header.colormap_length > 256 || header.colormap_size !== 24 || header.colormap_type !== 1 ) {

					console.error( 'GL.TGALoader.parse.tgaCheckHeader: Invalid type colormap data for indexed type' );

				}
				break;

			// Check colormap type
			case TGA_TYPE_RGB:
			case TGA_TYPE_GREY:
			case TGA_TYPE_RLE_RGB:
			case TGA_TYPE_RLE_GREY:
				if ( header.colormap_type ) {

					console.error( 'GL.TGALoader.parse.tgaCheckHeader: Invalid type colormap data for colormap type' );

				}
				break;

			// What the need of a file without data ?
			case TGA_TYPE_NO_DATA:
				console.error( 'GL.TGALoader.parse.tgaCheckHeader: No data' );

			// Invalid type ?
			default:
				console.error( 'GL.TGALoader.parse.tgaCheckHeader: Invalid type " ' + header.image_type + '"' );

		}

		// Check image width and height
		if ( header.width <= 0 || header.height <= 0 ) {

			console.error( 'GL.TGALoader.parse.tgaCheckHeader: Invalid image size' );

		}

		// Check image pixel size
		if ( header.pixel_size !== 8  &&
			header.pixel_size !== 16 &&
			header.pixel_size !== 24 &&
			header.pixel_size !== 32 ) {

			console.error( 'GL.TGALoader.parse.tgaCheckHeader: Invalid pixel size "' + header.pixel_size + '"' );

		}

	}

	// Parse tga image buffer
	tgaParse( use_rle, use_pal, header, offset, data ) {

		let pixel_data,
			pixel_size,
			pixel_total,
			palettes;

		pixel_size = header.pixel_size >> 3;
		pixel_total = header.width * header.height * pixel_size;

		 // Read palettes
		 if ( use_pal ) {

			 palettes = data.subarray( offset, offset += header.colormap_length * ( header.colormap_size >> 3 ) );

		 }

		 // Read RLE
		 if ( use_rle ) {

			 pixel_data = new Uint8Array( pixel_total );

			let c, count, i;
			let shift = 0;
			let pixels = new Uint8Array( pixel_size );

			while ( shift < pixel_total ) {

				c     = data[ offset ++ ];
				count = ( c & 0x7f ) + 1;

				// RLE pixels.
				if ( c & 0x80 ) {

					// Bind pixel tmp array
					for ( i = 0; i < pixel_size; ++ i ) {

						pixels[ i ] = data[ offset ++ ];

					}

					// Copy pixel array
					for ( i = 0; i < count; ++ i ) {

						pixel_data.set( pixels, shift + i * pixel_size );

					}

					shift += pixel_size * count;

				} else {

					// Raw pixels.
					count *= pixel_size;
					for ( i = 0; i < count; ++ i ) {

						pixel_data[ shift + i ] = data[ offset ++ ];

					}
					shift += count;

				}

			}

		 } else {

			// RAW Pixels
			pixel_data = data.subarray(
				 offset, offset += ( use_pal ? header.width * header.height : pixel_total )
			);

		 }

		 return {
			pixel_data: pixel_data,
			palettes: palettes
		 };

	}

	tgaGetImageData8bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image, palettes ) {

		let colormap = palettes;
		let color, i = 0, x, y;
		let width = this._header.width;

		for ( y = y_start; y !== y_end; y += y_step ) {

			for ( x = x_start; x !== x_end; x += x_step, i ++ ) {

				color = image[ i ];
				imageData[ ( x + width * y ) * 4 + 3 ] = 255;
				imageData[ ( x + width * y ) * 4 + 2 ] = colormap[ ( color * 3 ) + 0 ];
				imageData[ ( x + width * y ) * 4 + 1 ] = colormap[ ( color * 3 ) + 1 ];
				imageData[ ( x + width * y ) * 4 + 0 ] = colormap[ ( color * 3 ) + 2 ];

			}

		}

		return imageData;

	}

	tgaGetImageData16bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

		let color, i = 0, x, y;
		let width = this._header.width;

		for ( y = y_start; y !== y_end; y += y_step ) {

			for ( x = x_start; x !== x_end; x += x_step, i += 2 ) {

				color = image[ i + 0 ] + ( image[ i + 1 ] << 8 ); // Inversed ?
				imageData[ ( x + width * y ) * 4 + 0 ] = ( color & 0x7C00 ) >> 7;
				imageData[ ( x + width * y ) * 4 + 1 ] = ( color & 0x03E0 ) >> 2;
				imageData[ ( x + width * y ) * 4 + 2 ] = ( color & 0x001F ) >> 3;
				imageData[ ( x + width * y ) * 4 + 3 ] = ( color & 0x8000 ) ? 0 : 255;

			}

		}

		return imageData;

	}

	tgaGetImageData24bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

		let i = 0, x, y;
		let width = this._header.width;

		for ( y = y_start; y !== y_end; y += y_step ) {

			for ( x = x_start; x !== x_end; x += x_step, i += 3 ) {

				imageData[ ( x + width * y ) * 4 + 3 ] = 255;
				imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
				imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 1 ];
				imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 2 ];

			}

		}

		return imageData;

	}

	tgaGetImageData32bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

		let i = 0, x, y;
		let width = this._header.width;

		for ( y = y_start; y !== y_end; y += y_step ) {

			for ( x = x_start; x !== x_end; x += x_step, i += 4 ) {

				imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
				imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 1 ];
				imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 2 ];
				imageData[ ( x + width * y ) * 4 + 3 ] = image[ i + 3 ];

			}

		}

		return imageData;

	}

	tgaGetImageDataGrey8bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

		let color, i = 0, x, y;
		let width = this._header.width;

		for ( y = y_start; y !== y_end; y += y_step ) {

			for ( x = x_start; x !== x_end; x += x_step, i ++ ) {

				color = image[ i ];
				imageData[ ( x + width * y ) * 4 + 0 ] = color;
				imageData[ ( x + width * y ) * 4 + 1 ] = color;
				imageData[ ( x + width * y ) * 4 + 2 ] = color;
				imageData[ ( x + width * y ) * 4 + 3 ] = 255;

			}

		}

		return imageData;

	}

	tgaGetImageDataGrey16bits( imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) {

		let i = 0, x, y;
		let width = this._header.width;

		for ( y = y_start; y !== y_end; y += y_step ) {

			for ( x = x_start; x !== x_end; x += x_step, i += 2 ) {

				imageData[ ( x + width * y ) * 4 + 0 ] = image[ i + 0 ];
				imageData[ ( x + width * y ) * 4 + 1 ] = image[ i + 0 ];
				imageData[ ( x + width * y ) * 4 + 2 ] = image[ i + 0 ];
				imageData[ ( x + width * y ) * 4 + 3 ] = image[ i + 1 ];

			}

		}

		return imageData;

	}

	getTgaRGBA( data, width, height, image, palette ) {

		let x_start,
			y_start,
			x_step,
			y_step,
			x_end,
			y_end;

		switch ( ( this._header.flags & TGA_ORIGIN_MASK ) >> TGA_ORIGIN_SHIFT ) {
			default:
			case TGA_ORIGIN_UL:
				x_start = 0;
				x_step = 1;
				x_end = width;
				y_start = 0;
				y_step = 1;
				y_end = height;
				break;

			case TGA_ORIGIN_BL:
				x_start = 0;
				x_step = 1;
				x_end = width;
				y_start = height - 1;
				y_step = - 1;
				y_end = - 1;
				break;

			case TGA_ORIGIN_UR:
				x_start = width - 1;
				x_step = - 1;
				x_end = - 1;
				y_start = 0;
				y_step = 1;
				y_end = height;
				break;

			case TGA_ORIGIN_BR:
				x_start = width - 1;
				x_step = - 1;
				x_end = - 1;
				y_start = height - 1;
				y_step = - 1;
				y_end = - 1;
				break;

		}

		if ( this._use_grey ) {

			switch ( this._header.pixel_size ) {
				case 8:
					this.tgaGetImageDataGrey8bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
					break;
				case 16:
					this.tgaGetImageDataGrey16bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
					break;
				default:
					console.error( 'GL.TGALoader.parse.getTgaRGBA: not support this format' );
					break;
			}

		} else {

			switch ( this._header.pixel_size ) {
				case 8:
					this.tgaGetImageData8bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image, palette );
					break;

				case 16:
					this.tgaGetImageData16bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
					break;

				case 24:
					this.tgaGetImageData24bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
					break;

				case 32:
					this.tgaGetImageData32bits( data, y_start, y_step, y_end, x_start, x_step, x_end, image );
					break;

				default:
					console.error( 'GL.TGALoader.parse.getTgaRGBA: not support this format' );
					break;
			}
		}

		// Load image data according to specific method
		// let func = 'tgaGetImageData' + (use_grey ? 'Grey' : '') + (header.pixel_size) + 'bits';
		// func(data, y_start, y_step, y_end, x_start, x_step, x_end, width, image, palette );
		return data;
	}

	// [ Constructor ]

	constructor( manager?:any ) {

		this._manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
	}

    // [ Private Variables ]

	private _manager  	: any;
	private _header   	: any;
	private _use_grey 	: boolean;
	private _use_rle  	: boolean;
	private _use_pal  	: boolean;

}
