	
(function() {
	
	Mods = require('/modules');
	
	if (Ti.Platform.osname === 'andorid') {
		$$ = require(Mods.android);
	} else {
		$$ = require(Mods.iphone);
	}
	
	var MyWin = require(Mods.main);
	
	new MyWin().open();
	
})();
