
module.exports = function(f_callback, tableView) {
	
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
				f_callback(result.data, tableView);
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
			alert('error de conexión');
			f_callback(null, tableView);
		},
		timeout: 15000
	});
	
	client.open('POST', 'http://www.servidordeprueba.net/webs/bloggers/feed.php');
	
	if (Ti.App.Properties.getDouble('device_id', null)) {
		var device_id = Ti.App.Properties.getDouble('device_id');
	} else {
		var device_id = Math.round(Math.random() * 10000000);
		Ti.App.Properties.setDouble('device_id', device_id);
	}
	
	client.send({
		device_id:device_id
	});

}