	
(function() {
	
	Mods = require('/modules');
	
	if (Ti.Platform.osname != 'android') {
		$$ = require(Mods.iphone);
	}
	
	var MyWin = require(Mods.main);
	
	new MyWin().open();
	
})();
