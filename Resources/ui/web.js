
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

module.exports = function(url) {
	
	var win = Ti.UI.createWindow($$.win);
	win.left = win.width = Ti.Platform.displayCaps.platformWidth;
	
	var header = Ti.UI.createView({
		height:'50dp',
		top:0,
		backgroundColor:'#0069a5'
	});
	
	var logo = Ti.UI.createLabel({
		text:'FamilyBlog',
		color:'#FFF',
		font:{fontSize:'20dp', fontWeight:'bold'},
		top:0,
		height:'50dp'
	});
	
	var close = Ti.UI.createView({
		backgroundImage:'/ui/images/backButton.png',
		width:'40dp',
		height:'44dp',
		left:'10dp'
	});
	close.addEventListener('click', function() {
		win.close({left: Ti.Platform.displayCaps.platformWidth, duration:300});
	});
	
	header.add(logo);
	
	if (Ti.Platform.osname != 'android') {
		header.add(close);
	}
	
	win.add(header);
	
	var webView = Ti.UI.createWebView({
		url:url,
		top:'50dp',
		bottom:'35dp'
	});
	
	win.add(webView);
	
	var loader = Ti.UI.createActivityIndicator({
		cancelable:true
	});
	
	webView.addEventListener('load', function() {
		loader.hide();
		
		if (!webView.canGoBack()) {
			back.enabled = false;
		} else {
			back.enabled = true;
		}
		if (!webView.canGoForward()) {
			fwd.enabled = false;
		} else {
			fwd.enabled = true;
		}
	});
	
	var bottomBar = Ti.UI.createView({
		backgroundColor:'#000',
		height:'35dp',
		bottom:0
	});
	
	win.add(bottomBar);
	
	bottomBar.add(loader);
	
	var back = Ti.UI.createButton({
		backgroundImage:'/ui/images/back.png',
		left:'10dp',
		width:'25dp',
		height:'25dp',
		enabled:false,
		backgroundDisabledImage:'/ui/images/disabled_back.png'
	});
	var fwd = Ti.UI.createButton({
		backgroundImage:'/ui/images/fwd.png',
		left:'60dp',
		width:'25dp',
		height:'25dp',
		enabled:false,
		backgroundDisabledImage:'/ui/images/disabled_fwd.png'
	});
	var reload = Ti.UI.createButton({
		backgroundImage:'/ui/images/reload_web.png',
		right:'10dp',
		width:'25dp',
		height:'25dp'
	});
	
	bottomBar.add(back);
	bottomBar.add(fwd);
	bottomBar.add(reload);
	
	back.addEventListener('click', function() {
		if (webView.canGoBack()) {
			webView.goBack();
		}
	});
	fwd.addEventListener('click', function() {
		if (webView.canGoForward()) {
			webView.goForward();
		}
	});
	reload.addEventListener('click', function() {
		webView.reload();
	});
	
	webView.addEventListener('beforeload', function() {
		loader.show();
	});
	
	return win;
	
}
