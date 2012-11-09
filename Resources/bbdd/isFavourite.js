
module.exports = function(f_callback, id) {
	
	var client = Ti.Network.createHTTPClient({
		onload: function() {
			var result = JSON.parse(this.responseText);
			if (result.status == 'ok') {
				Ti.API.info('success ' + this.responseText);
				f_callback(result.data);
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
	
	client.open('POST', Ti.App.path + 'feeds/isFavorite');
	
	client.send({
		device_id:Ti.App.Properties.getDouble('device_id', null),
		id:id
	});
	
}
