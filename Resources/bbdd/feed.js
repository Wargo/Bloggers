
module.exports = function(f_callback, tableView) {
	
	if (Ti.App.Properties.getString('feed', null)) {
		var result = JSON.parse(Ti.App.Properties.getString('feed'));
		Ti.API.info('cache ' + Ti.App.Properties.getString('feed'));
		f_callback(result.data, tableView);
		return;
	}

	var client = Ti.Network.createHTTPClient({
		onload: function() {
			var result = JSON.parse(this.responseText);
			if (result.status == 'ok') {
				Ti.API.info('cache ' + this.responseText);
				Ti.App.Properties.setString('feed', this.responseText);
				f_callback(result.data, tableView);
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
			f_callback(null, tableView);
		},
		timeout: 15000
	});
	
	client.open('GET', 'http://www.servidordeprueba.net/webs/bloggers/feed.php');
	
	client.send();

}