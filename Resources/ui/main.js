
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

module.exports = function() {
	
	var win = Ti.UI.createWindow($$.win);
	
	return win;
	
}
