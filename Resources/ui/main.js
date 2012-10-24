
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

module.exports = function() {
	
	var win = Ti.UI.createWindow($$.win);
	
	var loader = Ti.UI.createActivityIndicator();
	win.add(loader);
	loader.show();
	
	var getData = require(Mods.bbdd);
	getData(setData);
	
	var logo = Ti.UI.createLabel({
		text:'Bloggers',
		color:'#333',
		font:{fontSize:'20dp', fontWeight:'bold'},
		top:0,
		height:'50dp'
	});
	
	var separatorHeader = Ti.UI.createView({
		height:'5dp',
		backgroundColor:'#999',
		top:'50dp',
		right:'5dp',
		left:'5dp'
	});
	
	win.add(logo);
	win.add(separatorHeader);
	
	logo.addEventListener('longpress', function() {
		Ti.App.Properties.removeProperty('feed');
		win.remove(tableView);
		getData(setData);
		loader.show();
	});
	
	var tableView = null;
	
	function setData(data) {
		
		tableView = Ti.UI.createTableView({
			top:'50dp',
			separatorColor:'#8CCC',
			backgroundColor:'#EEE'
		});
		
		for (i in data) {
			
			var row = Ti.UI.createTableViewRow({
				height:'100dp'
			});
			
			var separator = Ti.UI.createView({
				height:'1dp',
				backgroundColor:'#8FFF',
				top:0
			});
			
			row.add(separator);
			
			var content = Ti.UI.createView({
				layout:'vertical',
				left:'80dp',
				top:'5dp',
				bottom:'5dp',
				right:'5dp'
			});
			
			var title = Ti.UI.createLabel({
				text:data[i].title,
				font:{fontSize:'15dp', fontWeight:'bold'},
				left:0
			});
			
			var text = Ti.UI.createLabel({
				text:data[i].description,
				font:{fontSize:'13dp'},
				left:0
			});
			
			var image = Ti.UI.createImageView({
				image:data[i].image,
				left:'10dp',
				width:'60dp'
			});
			
			content.add(title);
			content.add(text);
			row.add(image);
			row.add(content);
			
			tableView.appendRow(row);
			
		}
		
		win.add(tableView);
		loader.hide();
		
	}
	
	return win;
	
}
