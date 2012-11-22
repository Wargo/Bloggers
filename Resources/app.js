	
(function() {
	
	Ti.App.path = 'http://www.familyblog.es/';
	
	Mods = require('/modules');
	
	if (Ti.Platform.osname == 'iphone') {
		$$ = require(Mods.iphone);
	}
	if (Ti.Platform.osname == 'ipad') {
		$$ = require(Mods.ipad);
	}
	
	var MyWin = require(Mods.main);
	
	new MyWin().open();
	
})();
