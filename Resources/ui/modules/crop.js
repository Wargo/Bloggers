
ImageFactory = require('ti.imagefactory');

module.exports = function(path, name, width, height, radius, image) {
	//alert(width);
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory + name + '.jpg');
	
	if (!file.exists()) {
		var client = Ti.Network.createHTTPClient({
			timeout:15000,
			onload:function(e) {
				
				//Ti.API.error(client.responseData.mimeType);
				//try {
					if (height != null && client.responseData.mimeType == 'image/jpeg') {
						//alert('-> ' + client.responseData.width);
						if (Ti.Platform.osname != 'android' && laclient.responseData.width < width) {
							width = client.responseData.width;
							image.width = width;
						}
						if (Ti.Platform.osname != 'android' && client.responseData.height < height) {
							height = client.responseData.height;
							image.height = height;
						}
						var thumb = ImageFactory.imageTransform(client.responseData,
							{ type:ImageFactory.TRANSFORM_CROP, width:width, height:height },
							{ type:ImageFactory.TRANSFORM_ROUNDEDCORNER, borderSize:0, cornerRadius:radius }
						);
					} else {
						if (height != null) {
							if (client.responseData.width >= height) {
								width = height;
							} else {
								width = client.responseData.width;
							}
							image.width = width;
							image.height = width; // El mismo porque es cuadrado
						}
						var thumb = ImageFactory.imageAsThumbnail(client.responseData,
							{ size:width, cornerRaduis:radius, format: ImageFactory.PNG }
						);
					}
					
					file.write(thumb);
					
					if (height != null) {
						image.image = file.nativePath;
					} else {
						image.backgroundImage = file.nativePath;
					}
					
				
				/*} catch (ex) {
					if (height != null) {
						image.parent.remove(image);
					}
				}*/
			},
			onerror:function(e) {
				//alert('error ' + path);
				if (height != null) {
					image.parent.remove(image);
				}
			}
		});
		
		client.open('GET', path);
		client.send();
		
	} else {
		//row.leftImage = file.nativePath;
		if (height != null) {
			image.image = file.nativePath;
		} else {
			image.backgroundImage = file.nativePath;
		}
	}
		
	return; //image;
	/*
			
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
	*/
}
