
module.exports = function(feed_id) {
	
	var client = Ti.Network.createHTTPClient({
		onload: function() {
			var result = JSON.parse(this.responseText);
			if (result.status == 'ok') {
				Ti.API.info('cache ' + this.responseText);
			} else {
				Ti.UI.createAlertDialog({
					title:'Error',
					message:result.message,
					ok:'Vale'
				}).show();
			}
		},
		onerror: function(e) {
			alert('error de conexión');
		},
		timeout: 15000
	});
	
	client.open('POST', 'http://www.servidordeprueba.net/webs/bloggers/add.php');
	
	client.send({
		device_id:Ti.App.Properties.getDouble('device_id', null),
		feed_id:feed_id
	});

}