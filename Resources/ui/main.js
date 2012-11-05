
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

var MyArticle = require(Mods.article);

var MyFeedsSelector = require(Mods.selectFeeds);

var getData = require(Mods.bbdd);

if (Ti.Platform.osname != 'android') {
	var MyReload = require(Mods.reload);
}

var MyCrop = require(Mods.crop);

var MyAppend = require(Mods.append);

var MyFavFolder = require(Mods.favFolder);

page = 1;

module.exports = function() {
	
	var win = Ti.UI.createWindow($$.mainWin);
	
	if (!Ti.App.Properties.getDouble('device_id', null)) {
		win.addEventListener('open', function() {
			MyFeedsSelector(reload).open({bottom:0});
		});
	}
	
	var loader = Ti.UI.createActivityIndicator($$.loader);
	win.add(loader);
	loader.show();
	
	setTimeout(function() {
		//Ti.App.Properties.removeProperty('feed');
		//getData(setData, tableView);
	}, 1000);
	
	var logo = Ti.UI.createLabel({
		text:'FamilyBlog',
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
	
	var feeds = Ti.UI.createButton({
		top:'5dp',
		right:'10dp',
		height:'32dp',
		width:'32dp',
		backgroundImage:'/ui/images/tools2.png'
	});
	
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
		var reloadButton = Ti.UI.createButton({
			backgroundImage:'/ui/images/reload.png',
			width:'32dp',
			height:'32dp',
			left:'40dp',
			top:'5dp'
		});
		reloadButton.addEventListener('click', function() {
			reload();
		});
		win.add(reloadButton);
	}
	
	var favList = Ti.UI.createButton({
		backgroundImage:'/ui/images/fav_folder.png',
		width:'32dp',
		height:'32dp',
		left:'10dp',
		top:'5dp'
	});
	favList.addEventListener('click', function() {
		MyFavFolder().open({left:0, duration:300});
	});
	win.add(favList);
	
	getData(setData, tableView);
	
	win._tableView = tableView;
	
	tableView.addEventListener('click', function(e) {
		var newWin = MyArticle(e.row._article);
		newWin.open({left:0, duration:300});
	});
	
	MyAppend(tableView, getData, setData);
	
	function setData(data, tableView) {

		if (page === 1) {
			
			if (Ti.Platform.osname === 'android') {
			
				if (tableView.parent) {
					tableView.parent.remove(tableView);
				}
				
			}
			
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
		tableView.data = [];
		page = 1;
		tableView.opacity = 0;
		loader.show();
		Ti.App.Properties.removeProperty('feed');
		getData(setData, tableView);
	}
	
	return win;
	
}
