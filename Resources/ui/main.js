
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

var MyArticle = require(Mods.article);

var MyFeedsSelector = require(Mods.selectFeeds);

var MyReload = require(Mods.reload);

var getData = require(Mods.bbdd);

var MyCrop = require(Mods.crop);

module.exports = function() {
	
	var win = Ti.UI.createWindow($$.mainWin);
	
	var loader = Ti.UI.createActivityIndicator($$.loader);
	win.add(loader);
	loader.show();
	
	setTimeout(function() {
		//Ti.App.Properties.removeProperty('feed');
		//getData(setData, tableView);
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
		top:'45dp',
		right:'5dp',
		left:'5dp',
		zIndex:5
	});
	
	var feeds = Ti.UI.createView({
		top:'5dp',
		right:'10dp',
		height:'40dp',
		width:'50dp'
	});
	feeds.add(Ti.UI.createImageView({image:'/ui/images/feeds.png', width:'30dp', height:'30dp'}));
	
	feeds.addEventListener('click', function() {
		MyFeedsSelector(reload).open({bottom:0});
	});
	
	win.add(logo);
	win.add(separatorHeader);
	win.add(feeds);
	
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
	
	function setData(data, tableView) {
		
		if (Ti.Platform.osname === 'android') {
			
			if (tableView.parent) {
				tableView.parent.remove(tableView);
			}
			
		}
		
		tableView.data = [];
		
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
			
			image = MyCrop(image, 'small_' + data[i].md5, '60dp', null, 5);
			
			content.add(title);
			content.add(text);
			row.add(image);
			row.add(content);
			
			row._article = data[i];
			
			tableView.appendRow(row);
			
		}
		
		if (Ti.Platform.osname === 'android') {
			
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
