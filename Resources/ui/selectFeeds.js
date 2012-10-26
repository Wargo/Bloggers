
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

var MyFeeds = require(Mods.feedsList);

var AddFeed = require(Mods.add);

module.exports = function(reload) {
	
	var win = Ti.UI.createWindow($$.win);
	win.bottom = win.height = Ti.Platform.displayCaps.platformHeight - 20;
	
	Ti.Gesture.addEventListener('orientationchange', function() {
		win.animate({height:Ti.Platform.displayCaps.platformHeight - 20});
	});
	
	var loader = Ti.UI.createActivityIndicator($$.loader);
	win.add(loader);
	
	win.addEventListener('open', function() {
		loader.show();
	});
	
	var logo = Ti.UI.createLabel({
		text:'Feeds',
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
	
	var close = Ti.UI.createView({
		top:'5dp',
		right:'5dp',
		width:'50dp',
		height:'40dp'
	});
	
	close.add(Ti.UI.createButton({
		title:'OK',
		font:{fontSize:'14dp'},
		width:'50dp',
		height:'30dp',
		backgroundImage:'none',
		color:'#FFF',
		backgroundColor:'#0069a5',
		borderRadius:5
	}));
	
	close.addEventListener('click', function() {
		win.close({bottom:'480dp'});
		reload();
	});
	
	win.add(logo);
	win.add(separatorHeader);
	win.add(close);
	
	MyFeeds(setData);
	
	function setData(data) {
		
		var tableView = Ti.UI.createTableView({
			top:'50dp',
			separatorColor:'#8CCC',
			backgroundColor:'#EEE'
		});
		
		for (i in data) {
			
			var row = Ti.UI.createTableViewRow({
				height:'60dp'
			});
			
			var separator = Ti.UI.createView({
				height:'1dp',
				backgroundColor:'#8FFF',
				top:0
			});
			
			row.add(separator);
			
			var check = Ti.UI.createImageView({
				left:'10dp',
				width:'30dp',
				height:'30dp',
				_id:data[i].id
			});
			
			if (data[i].haveIt) {
				check.backgroundImage = '/ui/images/checked.png';
			} else {
				check.backgroundImage = '/ui/images/unchecked.png';
			}
			
			var feed = Ti.UI.createLabel($$.title);
			feed.text = data[i].name;
			feed.left = '60dp';
			
			row.add(feed);
			row.add(check);
			
			tableView.appendRow(row);
			
			check.addEventListener('click', function(e) {
				if (e.source.backgroundImage == '/ui/images/checked.png') {
					e.source.backgroundImage = '/ui/images/unchecked.png';
				} else {
					e.source.backgroundImage = '/ui/images/checked.png';
				}
				AddFeed(e.source._id);
			});
			
		}
		
		loader.hide();
		
		win.add(tableView);
		
	}
	
	return win;
	
}
