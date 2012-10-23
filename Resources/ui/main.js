
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

module.exports = function() {
	
	var win = Ti.UI.createWindow($$.win);
	
	var getData = require(Mods.bbdd);
	getData(setData);
	
	var MONTH_MAP = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };
	
	function setData(xml) {
		if (xml === null || xml.documentElement === null) { 
			return;
		}

		var items = xml.documentElement.getElementsByTagName("item");
		var data = [];

		for (var i = 0; i < items.length; i++) {
			var item = items.item(i);
			var image;
			try {
				var image = item.getElementsByTagNameNS('http://mashable.com/', 'thumbnail').item(0).getElementsByTagName('img').item(0).getAttribute('src');
			} catch (e) {
				image = '';
			}

			data.push({
				title: getRssText(item, 'title'),
				link: getRssText(item, 'link'),
				pubDate: parseDate(getRssText(item, 'pubDate')),
				image: image
			});
		}
		
		alert(data);
	}
	
	var getRssText = function(item, key) {
		return item.getElementsByTagName(key).item(0).text;
	}
	
	var parseDate = function(dateString) {
		var dateParts = dateString.split(' ');
		var timeParts = dateParts[4].split(':');
		return MONTH_MAP[dateParts[2].toUpperCase()] + '/' + dateParts[1] + ' ' + timeParts[0] + ':' + timeParts[1];
	}
	
	return win;
	
}
