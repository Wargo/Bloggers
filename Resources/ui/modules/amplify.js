
module.exports = function(src) {
	
	if (Ti.Platform.osname === 'android') {
		
		var win = Ti.UI.createWindow({
			backgroundColor:'#000',
			exitOnClose:false,
			fullscreen:true,
			navBarHidden:true,
			modal:true
		});
		
	} else {
		
		var win = Ti.UI.createWindow({
			backgroundColor:'#000',
			opacity:0
		});
		
		win.addEventListener('singletap', function() {
			win.close({opacity:0});
		});
		
	}
	
	var scrollView = Ti.UI.createScrollView({
		maxZoomScale: 10,
	    minZoomScale: 1,
	    zoomScale: 1
	});
	
	win.add(scrollView);
	
	var image = Ti.UI.createImageView({
		//image:src + '?casheBuster=' + new Date().getTime(),
		image:src + '?d=1',
		height:'100%',
		defaultImage:'none',
		_isLoaded:false
	});
	
	var loading = Ti.UI.createActivityIndicator();
	image.add(loading);
	
	win.addEventListener('open', function() {
		if (!image._isLoaded) {
			loading.show();
		}
	});
	
	image.addEventListener('load', function() {
		loading.hide();
		image._isLoaded = true;
	});
	
	if (Ti.Platform.osname != 'android') {
		image.width = '100%';
	}
	
	scrollView.add(image);
	
	win.open({opacity:1});
	
}
