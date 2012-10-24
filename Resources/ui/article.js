
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

module.exports = function(article) {
	
	var win = Ti.UI.createWindow($$.win);
	win.left = '320dp';
	
	win.add(Ti.UI.createLabel({text:article.title}));
	
	return win;
	
}
