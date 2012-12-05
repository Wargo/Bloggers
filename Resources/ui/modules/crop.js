
ImageFactory = require('ti.imagefactory');

module.exports = function(path, name, width, height, radius, image, loading) {

	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory + name + '.jpg');
	
	if (!file.exists()) {
		var client = Ti.Network.createHTTPClient({
			timeout:15000,
			onload:function(e) {
				
				if (height != null) {// && client.responseData.mimeType == 'image/jpeg') {
					if (Ti.Platform.osname != 'android' && client.responseData.width < width) {
						width = client.responseData.width;
					}
					
					if (Ti.Platform.osname != 'android' && client.responseData.height < height) {
						height = client.responseData.height;
					}
					
					try {
						var thumb = ImageFactory.imageTransform(client.responseData,
							{ type:ImageFactory.TRANSFORM_CROP, width:width, height:height },
							{ type:ImageFactory.TRANSFORM_ROUNDEDCORNER, borderSize:0, cornerRadius:radius }
						);
					} catch (ex) {
						var thumb = ImageFactory.imageAsThumbnail(client.responseData,
							{ size:height, cornerRaduis:radius, format: ImageFactory.PNG }
						);
					}
				} else {
					if (height != null) {
						if (Ti.Platform.osname != 'android') {
							if (client.responseData.width >= height) {
								width = height;
							} else {
								width = client.responseData.width;
							}
						} else {
							width = height;
						}
					}
					
					var thumb = ImageFactory.imageAsThumbnail(client.responseData,
						{ size:width, cornerRaduis:radius, format: ImageFactory.PNG }
					);
				}
				
				file.write(thumb);
				
				image.width = thumb.width + 'dp';
				image.height = thumb.height + 'dp';
				
				if (Ti.Platform.osname != 'android') {
					image.image = file;
				} else {
					image.backgroundImage = file.nativePath;
				}
					
			},
			onerror:function(e) {
				if (height != null) {
					image.parent.remove(image);
				}
			},
			ondatastream:function(e) {
				if (typeof loading != 'undefined') {
					if (Ti.Platform.osname != 'android') {
						loading.message = Math.round(e.progress * 100) + ' %';
					} else {
						loading.text = Math.round(e.progress * 100) + ' %';
					}
				}
			}
		});
		
		client.open('GET', path);
		client.send();
		
	} else {
		if (height != null) {
			image.image = file.nativePath;
			Ti.API.error(image.toImage().height);
			image.width = image.toImage().width + 'dp';
			image.height = image.toImage().height + 'dp';
		} else {
			image.backgroundImage = file.nativePath;
		}
	}
		
}
