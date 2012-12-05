
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

Ti.App.haveFavs = require(Mods.haveFavs);

//page = 1;

var MyTableView = require(Mods.tableView);

module.exports = function() {
	
	var win = Ti.UI.createWindow($$.mainWin);
	
	var loader = Ti.UI.createActivityIndicator($$.loader);
	win.add(loader);
	loader.show();
	
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
	
	var separator1 = Ti.UI.createView({
		width:'1dp',
		left:'50dp',
		top:'5dp',
		height:'37dp',
		backgroundColor:'#CCC'
	});
	win.add(separator1);
	var separator2 = Ti.UI.createView({
		width:'1dp',
		right:'50dp',
		top:'5dp',
		height:'37dp',
		backgroundColor:'#CCC'
	});
	win.add(separator2);
	
	var feeds = Ti.UI.createButton({
		top:'5dp',
		right:'5dp',
		height:'37dp',
		width:'37dp',
		backgroundImage:'/ui/images/tools.png'
	});
	
	feeds.addEventListener('click', function() {
		if (Ti.Platform.osname != 'android') {
			MyFeedsSelector(tableView._reload).open({bottom:0});
		} else {
			MyFeedsSelector(tableView._reload).open();
		}
	});
	
	win.add(logo);
	win.add(separatorHeader);
	win.add(feeds);

	var tableView = new MyTableView({
		top:'50dp',
		separatorColor:'#8CCC',
		backgroundColor:'#EEE',
		opacity:0
	}, {
		function1: getData,
		function2: setData
	});
	
	if (!Ti.App.Properties.getDouble('device_id', null)) {
		win.addEventListener('open', function() {
			MyFeedsSelector(tableView._reload).open({bottom:0});
		});
	}

	var favList = Ti.UI.createButton({
		backgroundImage:'/ui/images/fav_folder.png',
		width:'40dp',
		height:'40dp',
		left:'5dp',
		top:'2dp'
	});
	favList.addEventListener('click', function() {
		MyFavFolder().open({left:0, duration:300});
	});
	win.add(favList);
	
	Ti.App.favList = favList;
	
	Ti.App.haveFavs();
	
	win._tableView = tableView;
	
	tableView.addEventListener('click', function(e) {
		if (e.row.focusable === false) {
			return;
		}
		var newWin = MyArticle(e.row._article);
		newWin.open({left:0, duration:300});
	});
	
	function setData(data, p) {

		if (p === 1 && data.length === 0) {
			
			var message = Ti.UI.createLabel({
				left:'15dp',
				right:'15dp',
				top:'15dp',
				font:{fontSize:'13dp'},
				color:'#999',
				text:'Para poder ver los artículos, añade los blogs que más te gusten a través del botón que aparece en la esquina superior derecha.'
			});
			var messageView = Ti.UI.createView({
				backgroundColor:'#FFF',
				left:'20dp',
				right:'20dp',
				top:'10dp',
				height:'95dp',
				borderColor:'#DDD',
				borderWidth:1
			});
			var row = Ti.UI.createTableViewRow({
				height:Ti.Platform.displayCaps.platformHeight - 50,
				selectionStyle:Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
				focusable:false
				//_noData:true
			});
			
			messageView.add(message);
			row.add(messageView);
			tableView.appendRow(row);
			
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
		
		tableView.animate({opacity:1});
		
		loader.hide();
		
	}
	
	win.add(tableView);
	
	return win;
	
}
