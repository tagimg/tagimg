tagImg_image_handler = (function() {
	getImageMimeType = function(imageBase64Data) {
		var mimeType = 'image/jpeg';
		if(imageBase64Data.indexOf("base64,") >= 0) {
			mimeType = imageBase64Data.split('base64,')[0].replace("data:", "").replace(";", "");
		}
		return mimeType;
	}

	getResizeImageBase64Data = function(modelImg, resizeWidth, resizeHeight) {
		//var quality = O.7 * 100 || 70;
		var quality = 70;
		var imageBase64Data = img.src;
		var mimeType = getImageMimeType(imageBase64Data);

		var maxHeight = resizeHeight;
		var maxWidth = resizeWidth;
		var height = img.height;
		var width = img.width;
		// 计算宽高，限制压缩后的最大尺寸
		if(width > height) {
			if(width > maxWidth) {
				height = Math.round(height *= maxWidth / width);
				width = maxWidth;
			}
		} else {
			if(height > maxHeight) {
				width = Math.round(width *= maxHeight / height);
				height = maxHeight;
			}
		}

		var p = new Promise(function(resolve, reject) {
			var image = new Image();

			image.src = imageBase64Data; //+"?timestemp=";

			image.onload = function() {
				//画布绘制图片
				var cvs = document.createElement('canvas');
				cvs.width = width; //sourceImgObj.naturalWidth;
				cvs.height = height; //sourceImgObj.naturalHeight;
				var ctx = cvs.getContext('2d');
				ctx.drawImage(image, 0, 0, width, height);
				var newImageData = cvs.toDataURL(mimeType);
				resolve(newImageData);
			}
		});
		return p;

	};
	getPngImageDepth = function(imgData) {
		//png
		var bitsPerPixel = 4;
		/*bytes[24] & 0xff;
				if((bytes[25] & 0xff) == 2) {
					bitsPerPixel *= 3;
				} else if((bytes[25] & 0xff) == 6) {
					bitsPerPixel *= 4;
				}*/
		return bitsPerPixel;
	};
	getJpegImageDepth = function(imgData) {
		//jpg
		var i = 2;
		var bitsPerPixel = 3;
		/*while(true) {
			int marker = (bytes[i] & 0xff) << 8 | (bytes[i + 1] & 0xff);
			int size = (bytes[i + 2] & 0xff) << 8 | (bytes[i + 3] & 0xff);
			if(marker >= 0xffc0 && marker <= 0xffcf && marker != 0xffc4 &&
				marker != 0xffc8) {
				bitsPerPixel = (bytes[i + 4] & 0xff) * (bytes[i + 9] & 0xff);
				break;
			} else {
				i += size + 2;
			}
		}*/

		return bitsPerPixel;
	};

	getBmpImageDepth = function(imgData) {
		//bmp
		var bitsPerPixel = 3; //(bytes[28] & 0xff) | (bytes[29] & 0xff) << 8;

		return bitsPerPixel;
	};

	getGifImageDepth = function(imgData) {
		//gif
		var bitsPerPixel = 3; //(bytes[10] & 0x07) + 1;

		return bitsPerPixel;
	};
	getImageDepth = function(imageBase64Data) {
		var imgDepth = 3;
		var mimeType = getImageMimeType(imageBase64Data);
		var imgData = imageBase64Data;
		if(imgData.indexOf("base64,") >= 0) {
			imgData = imgData.split('base64,')[1];
		}
		if("image/jpeg" == mimeType) {
			imgDepth = getJpegImageDepth(imgData);
		} else if("image/png" == mimeType) {
			imgDepth = getPngImageDepth(imgData);
		} else if("image/bmp" == mimeType) {
			imgDepth = getBmpImageDepth(imgData);
		} else if("image/gif" == mimeType) {
			imgDepth = getGifImageDepth(imgData);
		}
		return imgDepth;
	};
	getImageBase64DataAndSize = function(inputItem) {
		function getBase64(img) {

			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;

			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			var dataURL = canvas.toDataURL('image/jpeg');
			return dataURL;
		}

		var p = new Promise(function(resolve, reject) {
			var image = new Image();
			image.crossOrigin = 'Anonymous';
			var imgSrc = inputItem.src;
			image.src = imgSrc; //+"?timestemp=";

			image.onload = function() {
				var imageBase64Data = imgSrc;
				if(imgSrc.indexOf("base64,") < 0) {
					imageBase64Data = getBase64(image);
				}
				var modelImg = {};
				modelImg.src = imageBase64Data;
				modelImg.width = image.width;
				modelImg.height = image.height;
				modelImg.depth = getImageDepth(imageBase64Data);
				modelImg.name = inputItem.name;
				modelImg.rectList = inputItem.rectList;
				resolve(modelImg);
			}
		});
		return p;

	};
	return {
		getResizeImageBase64Data: getResizeImageBase64Data,
		getImageBase64DataAndSize: getImageBase64DataAndSize
	}

})();