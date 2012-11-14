
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
		image:src + '?casheBuster=' + casheBuster.getTime(),
		height:'100%'
	});
	
	if (Ti.Platform.osname != 'android') {
		image.width = '100%';
	}
	
	scrollView.add(image);
	
	win.open({opacity:1});
	
}
