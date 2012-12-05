	
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
	
	/*
	 * Clear Cache
	 */
	var version = 3;
	
	var haveToClear = Ti.App.Properties.getInt('clearCache', version);
	
	if (haveToClear <= version) {
		var cacheFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory);
		var files = cacheFolder.getDirectoryListing();
		
		for (i in files) {
			
			if (files[i].substring(files[i].length - 4, files[i].length) == '.jpg') {
				var fileToDelete = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory + files[i]);
				fileToDelete.deleteFile();
			}
			
		}
		
		Ti.API.error('Caché limpiada');
		
		Ti.App.Properties.setInt('clearCache', version + 1);

	}
	
})();
