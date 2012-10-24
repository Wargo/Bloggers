
ImageFactory = require('ti.imagefactory');

module.exports = function(image, name, width, height, radius) {
	
	width = width || 100;
	height = height || 100;
	radius = radius || 10;
	
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + image.md5 + '.jpg');
			
	if (Ti.App.Properties.getBool('forceImages', false)) {
		file.deleteFile();
	}
	
	if (file.exists()) {
		image.opacity = 0;
		image.image = file;
		image.borderRadius = radius;
		image._firstLoad = false;
	} else {
		image.opacity = 0;
		image.borderRadius = 10;
		image._firstLoad = true;
		image._file = file;
	}
	
	image.addEventListener('load', function(e) {
		if (e.source._firstLoad) {
			var thumb = newBlob = ImageFactory.imageTransform(e.source.toBlob(),
				{ type:ImageFactory.TRANSFORM_CROP, width:width, height:height },
				{ type:ImageFactory.TRANSFORM_ROUNDEDCORNER, borderSize:0, cornerRadius:radius }
			);
			e.source.image = thumb;
			e.source._firstLoad = false;
			//e.source._file.write(thumb);
		} else {
			e.source.animate({opacity:1});
		}
	});
	
	return image;
	
}