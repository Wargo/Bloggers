
module.exports = function(f_callback, tableView, page, loading) {
	
	page = page || 1;
	
	if (page > 1) {
		var lastRow = 0;
		for(var i = 0; i < tableView.data.length; i++) {
			for(var j = 0; j < tableView.data[i].rowCount; j++) {
				lastRow ++;
			}
		}
	}
	
	if (false && Ti.App.Properties.getString('feed', null)) {
		var result = JSON.parse(Ti.App.Properties.getString('feed'));
		Ti.API.info('cache ' + Ti.App.Properties.getString('feed'));
		f_callback(result.data, tableView);
		return;
	}

	var client = Ti.Network.createHTTPClient({
		onload: function() {
			var result = JSON.parse(this.responseText);
			if (result.status == 'ok') {
				Ti.API.info('bbdd ' + this.responseText);
				Ti.App.Properties.setString('feed', this.responseText);
				if (result.data) {
					f_callback(result.data, tableView, page);
				}
				
				if  (page > 1) {
					tableView.deleteRow(lastRow - 1);
				}
				if (loading) {
					loading.hide();
				}
			} else {
				Ti.UI.createAlertDialog({
					title:'Error',
					message:result.message,
					ok:'Vale'
				}).show();
				f_callback(null, tableView);
			}
		},
		onerror: function(e) {
			f_callback(null, tableView);
		},
		timeout: 15000
	});
	
	client.open('POST', Ti.App.path + 'feeds/feed');
	
	if (Ti.App.Properties.getDouble('device_id', null)) {
		var device_id = Ti.App.Properties.getDouble('device_id');
	} else {
		var device_id = Math.round(Math.random() * 10000000);
		Ti.App.Properties.setDouble('device_id', device_id);
	}
	
	Ti.API.error(page)
	
	client.send({
		device_id:device_id,
		page:page
	});

}