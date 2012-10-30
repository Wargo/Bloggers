
module.exports = function(element, id) {
	
	var client = Ti.Network.createHTTPClient({
		onload: function() {
			var result = JSON.parse(this.responseText);
			if (result.status == 'ok') {
				Ti.API.info('success ' + this.responseText);
				if (result.data === 1) {
					element.backgroundImage = '/ui/images/favorite_on.png';
				} else {
					element.backgroundImage = '/ui/images/favorite_off.png';
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
	
	client.open('POST', Ti.App.path + 'isFavorite.php');
	
	client.send({
		device_id:Ti.App.Properties.getDouble('device_id', null),
		id:id
	});
	
}
