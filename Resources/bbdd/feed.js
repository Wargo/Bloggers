
module.exports = function(f_callback) {

	var client = Ti.Network.createHTTPClient({
		onload: function() {
			f_callback(this.responseXML);
		},
		onerror: function(e) {
			alert(e);
		},
		timeout: 15000
	});
	
	client.open('GET', 'http://blog.elembarazo.net/category/bloggers/feed');
	
	client.send();

}