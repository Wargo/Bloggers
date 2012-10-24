
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

var MyArticle = require(Mods.article);

module.exports = function() {
	
	var win = Ti.UI.createWindow($$.mainWin);
	
	var loader = Ti.UI.createActivityIndicator($$.loader);
	win.add(loader);
	loader.show();
	
	var getData = require(Mods.bbdd);
	getData(setData);
	
	setTimeout(function() {
		Ti.App.Properties.removeProperty('feed');
		getData(setData);
	}, 1000);
	
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
		left:'5dp',
		zIndex:5
	});
	
	win.add(logo);
	win.add(separatorHeader);
	
	logo.addEventListener('singletap', function() {
		Ti.App.Properties.removeProperty('feed');
		if (win._tableView) {
			win.remove(win._tableView);
		}
		getData(setData);
		loader.show();
	});
	
	function setData(data) {
		
		var tableView = Ti.UI.createTableView({
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
			
			var title = Ti.UI.createLabel($$.title);
			title.text = data[i].title;
			
			var text = Ti.UI.createLabel($$.text);
			text.text = data[i].description;
			text.height = '50dp';
				
			var image = Ti.UI.createImageView({
				image:data[i].image,
				left:'10dp',
				width:'60dp'
			});
			
			content.add(title);
			content.add(text);
			row.add(image);
			row.add(content);
			
			row._article = data[i];
			
			tableView.appendRow(row);
			
		}
		
		win.add(tableView);
		win._tableView = tableView;
		loader.hide();
		
		tableView.addEventListener('click', function(e) {
			var newWin = MyArticle(e.row._article);
			newWin.open({left:0, duration:300});
		});
		
	}
	
	return win;
	
}
