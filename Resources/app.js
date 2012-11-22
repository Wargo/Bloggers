	
(function() {
	
	Ti.App.path = 'http://www.familyblog.es/';
	
	Mods = require('/modules');
	
	if (Ti.Platform.osname == 'iphone') {
		$$ = require(Mods.iphone);
	}
	alert(Ti.Platform.osname)
	if (Ti.Platform.osname == 'ipad') {
		$$ = require(Mods.ipad);
	}
	
	var MyWin = require(Mods.main);
	
	new MyWin().open();
	
})();
