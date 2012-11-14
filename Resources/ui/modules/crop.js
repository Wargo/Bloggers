
ImageFactory = require('ti.imagefactory');

module.exports = function(path, name, width, height, radius, image) {
	
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory + name + '.jpg');
	
	if (Ti.Platform.osname === 'android') {
		if (!file.exists()) {
			var client = Ti.Network.createHTTPClient({
				timeout:15000,
				onload:function(e) {
					if (height != null) {
						var thumb = ImageFactory.imageTransform(client.responseData,
							{ type:ImageFactory.TRANSFORM_CROP, width:width, height:height },
							{ type:ImageFactory.TRANSFORM_ROUNDEDCORNER, borderSize:0, cornerRadius:radius }
						);
					} else {
						var thumb = ImageFactory.imageAsThumbnail(client.responseData,
							{ size:width, cornerRaduis:radius, format: ImageFactory.PNG }
						);
					}
					
					file.write(thumb);
					
					//row.add(Ti.UI.createImageView({image:client.responseData}));
					//row.add(Ti.UI.createImageView({image:file.read()}));
					
					//row.leftImage = file.nativePath;
					image.backgroundImage = file.nativePath;
				},
				onerror:function(e) {
					alert('error ' + path);
				}
			});
			
			client.open('GET', path);
			client.send();
			
		} else {
			//row.leftImage = file.nativePath;
			image.backgroundImage = file.nativePath;
		}
		
		//image.width = width + 'dp';
		return; //image;
	}
			
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
		image.borderRadius = radius;
		image._firstLoad = true;
		image._file = file;
	}
	
	image.addEventListener('load', function(e) {
		if (e.source._firstLoad) {
			try {
				if (height != null) {
					var thumb = ImageFactory.imageTransform(e.source.toBlob(),
						{ type:ImageFactory.TRANSFORM_CROP, width:width, height:height },
						{ type:ImageFactory.TRANSFORM_ROUNDEDCORNER, borderSize:0, cornerRadius:radius }
					);
				} else {
					var thumb = ImageFactory.imageAsThumbnail(e.source.toBlob(),
						{ size:width, cornerRaduis:radius, format: ImageFactory.PNG }
					);
				}
				e.source.image = thumb;
				e.source._firstLoad = false;
				e.source._file.write(thumb);
			} catch(ex) {
				e.source.animate({opacity:1});
			}
		} else {
			e.source.animate({opacity:1});
		}
	});
	
	return image;
	
}
