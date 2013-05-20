
module.exports = function(f_callback) {
	
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
			Ti.UI.createAlertDialog({
				title:'Error',
				message:'Error de conexión',
				ok:'Vale'
			}).show();
			f_callback(null);
		},
		timeout: 15000
	});
	
	client.open('GET', Ti.App.path + 'categories/json');
	
	client.send();
	
}
