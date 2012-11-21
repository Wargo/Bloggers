
module.exports = function(element, id, blog_id, image_on, image_off, optionsDialog) {
	
	element.backgroundImage = 'none';
	
	var loader = Ti.UI.createActivityIndicator();
	element.add(loader);
	loader.show();
	
	var client = Ti.Network.createHTTPClient({
		onload: function() {
			var result = JSON.parse(this.responseText);
			if (result.status == 'ok') {
				if (result.data === 1) {
					element.backgroundImage = image_on;
					optionsDialog[0] = L('remFromFav', 'Quitar de favoritos');
				} else {
					element.backgroundImage = image_off;
					optionsDialog[0] = L('addToFav', 'Añadir a favoritos');
				}
				loader.hide();
			} else {
				loader.hide();
				alert(result.message);
			}
		},
		onerror: function() {
			loader.hide();
			alert('error de conexión');
		},
		timeout: 15000
	});
	
	client.open('POST', Ti.App.path + 'feeds/favourites');
	
	client.send({
		device_id:Ti.App.Properties.getDouble('device_id'),
		id:id,
		blog_id:blog_id
	});
	
}
