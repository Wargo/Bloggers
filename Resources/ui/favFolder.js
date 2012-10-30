
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

var MyArticle = require(Mods.article);

if (Ti.Platform.osname != 'android') {
	var MyReload = require(Mods.reload);
}

var getData = require(Mods.favouritesList);

var MyCrop = require(Mods.crop);

var MyAppend = require(Mods.append);

module.exports = function() {
	
	var win = Ti.UI.createWindow($$.win);
	
	var loader = Ti.UI.createActivityIndicator($$.loader);
	win.add(loader);
	loader.show();
	
	var header = Ti.UI.createView({
		height:'50dp',
		top:0,
		backgroundColor:'#0069a5'
	});
	
	var logo = Ti.UI.createLabel({
		text:'Favoritos',
		color:'#FFF',
		font:{fontSize:'20dp', fontWeight:'bold'},
		top:0,
		height:'50dp'
	});
	
	var close = Ti.UI.createView({
		backgroundImage:'/ui/images/backButton.png',
		width:'86dp',
		height:'41dp',
		left:'10dp',
		color:'#333'
	});
	close.add(Ti.UI.createLabel($$.backButton));
	close.addEventListener('click', function() {
		win.close({left: Ti.Platform.displayCaps.platformWidth, duration:300});
	});
	
	header.add(close);
	header.add(logo);
	
	win.add(header);
	
	var tableView = Ti.UI.createTableView({
		top:'50dp',
		separatorColor:'#8CCC',
		backgroundColor:'#EEE',
		opacity:0
	});
	
	if (Ti.Platform.osname != 'android') {
		MyReload(tableView, getData, setData);
	} else {
		logo.addEventListener('click', function() {
			reload();
		});
	}
	
	getData(setData, tableView);
	
	win._tableView = tableView;
	
	tableView.addEventListener('click', function(e) {
		var newWin = MyArticle(e.row._article);
		newWin.open({left:0, duration:300});
	});
	
	MyAppend(tableView, getData, setData);
	
	function setData(data, tableView, page) {
		
		if (page === 1) {
			if (Ti.Platform.osname === 'android') {
			
				if (tableView.parent) {
					tableView.parent.remove(tableView);
				}
				
			}
			
			tableView.data = [];
		}
		
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
				left:'10dp'
			});
			
			if (Ti.Platform.osname === 'android') {
				image.width = '60dp';
			} else {
				image = MyCrop(image, 'small_' + data[i].md5, 60, null, 5);
			}
			
			content.add(title);
			content.add(text);
			row.add(image);
			row.add(content);
			
			row._article = data[i];
			
			tableView.appendRow(row);
			
		}
		
		if (Ti.Platform.osname === 'android' && page === 1) {
			
			win.add(tableView);
			
		}
		
		tableView.animate({opacity:1});
		
		loader.hide();
		
	}
	
	win.add(tableView);
	
	function reload() {
		tableView.opacity = 0;
		loader.show();
		Ti.App.Properties.removeProperty('feed');
		getData(setData, tableView);
	}
	
	return win;
	
}
