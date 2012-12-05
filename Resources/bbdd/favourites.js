
module.exports = function(f_callback, page) {
	
	page = page || 1;
	/*
	if (page > 1) {
		var lastRow = 0;
		for(var i = 0; i < tableView.data.length; i++) {
			for(var j = 0; j < tableView.data[i].rowCount; j++) {
				lastRow ++;
			}
		}
	}
	*/
	var client = Ti.Network.createHTTPClient({
		onload: function() {
			var result = JSON.parse(this.responseText);
			if (result.status == 'ok') {
				Ti.API.info('fav ' + this.responseText);
				Ti.App.Properties.setString('feed', this.responseText);
				if (result.data) {
					f_callback(result.data, page);
				}
			} else {
				Ti.UI.createAlertDialog({
					title:'Error',
					message:result.message,
					ok:'Vale'
				}).show();
				f_callback(null);
			}
		},
		onerror: function(e) {
			alert('error de conexión');
			f_callback(null);
		},
		timeout: 15000
	});
	
	client.open('POST', Ti.App.path + 'feeds/myposts');
	
	client.send({
		device_id:Ti.App.Properties.getDouble('device_id'),
		page:page
	});

}