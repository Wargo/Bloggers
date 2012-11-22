
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

page = 1;

module.exports = function() {
	
	var win = Ti.UI.createWindow($$.win);
	win.left = win.width = Ti.Platform.displayCaps.platformWidth;
	
	var loader = Ti.UI.createActivityIndicator($$.loader);
	win.add(loader);
	
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
	
	if (Ti.Platform.osname != 'android') {
		header.add(close);
	}
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
	
	setTimeout(function() {
		getData(setData, tableView);
		loader.show();
	}, 500);
	
	win._tableView = tableView;
	
	tableView.addEventListener('click', function(e) {
		var newWin = MyArticle(e.row._article);
		newWin.open({left:0, duration:300});
	});
	
	var functions = MyAppend(tableView, getData, setData, page);
	
	function setData(data, tableView, p) {

		if (Ti.Platform.osname === 'android' && p === 1) {
		
			if (tableView.parent) {
				tableView.parent.remove(tableView);
			}
				
		}
		
		if (p === 1) {
			functions.resetPage(1);
		}
		
		if (data === null) {
			functions.setCanAppend(false);
		} else {
			functions.setCanAppend(true);
		}
		
		var rows = [];
		
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
			
			var author = Ti.UI.createLabel($$.text);
			author.color = '#BBB';
			author.text = data[i].blog_name;
			if (data[i].date) {
				author.text += ', ' + data[i].date;
			}
			
			var text = Ti.UI.createLabel($$.text);
			text.text = data[i].description;
			if  (Ti.Platform.osname === 'android') {
				text.height = '33dp';
			} else {
				text.height = '30dp';
			}
			
			if (Ti.Platform.osname === 'android') {
				var image = Ti.UI.createView({
					left:'10dp',
					backgroundImage:'/ui/images/logo.png',
					height:'60dp',
					width:'60dp',
					borderRadius:10
				});
			} else {
				var image = Ti.UI.createImageView({
					left:'10dp',
					backgroundImage:'/ui/images/logo.png',
					height:'60dp',
					width:'60dp',
					borderRadius:10
				});
			}
			
			//row.leftImage = '/ui/images/logo.png';
			
			if (data[i].image) {
				MyCrop(data[i].image, 'small_' + data[i].md5, 60, null, 10, image);
			}
			
			content.add(title);
			content.add(author);
			content.add(text);
			row.add(image);
			row.add(content);
			
			row._article = data[i];
			
			rows.push(row);
			
		}
		
		tableView.appendRow(rows);
		
		if (Ti.Platform.osname === 'android' && page === 1) {
			
			win.add(tableView);
			
		}
		
		tableView.animate({opacity:1});
		
		loader.hide();
		
	}
	
	win.add(tableView);
	
	function reload() {
		tableView.data = [];
		page = 1;
		tableView.opacity = 0;
		loader.show();
		Ti.App.Properties.removeProperty('feed');
		getData(setData, tableView);
	}
	
	return win;
	
}
