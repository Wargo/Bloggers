
module.exports = function() {
	
	var client = Ti.Network.createHTTPClient({
		onload: function() {
			var result = JSON.parse(this.responseText);
			if (result.data > 0) {
				Ti.App.favList.backgroundImage = '/ui/images/fav_folder_on.png';
			} else {
				Ti.App.favList.backgroundImage = '/ui/images/fav_folder.png';
			}
		},
		onerror: function(e) {
			alert('error de conexión');
		},
		timeout: 15000
	});
	
	client.open('POST', Ti.App.path + 'feeds/havefavs');
	
	client.send({
		device_id:Ti.App.Properties.getDouble('device_id', null)
	});

}