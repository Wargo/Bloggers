
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

var MyFeeds = require(Mods.feedsList);
var MyCategories = require(Mods.catsList);

var AddFeed = require(Mods.add);

module.exports = function(reload) {
	
	var win = Ti.UI.createWindow($$.win);
	win.backgroundColor = '#6000';
	
	if (Ti.Platform.osname != 'android') {
		win.bottom = win.height = Ti.Platform.displayCaps.platformHeight - 20;
		var margin = '20dp'
	} else {
		var margin = 0;
	}
	
	var view = Ti.UI.createView({
		top:margin,
		left:margin,
		right:margin,
		bottom:margin,
		backgroundColor:'white',
		borderRadius:5
	});
	
	win.add(view);
	
	Ti.Gesture.addEventListener('orientationchange', function() {
		win.animate({height:Ti.Platform.displayCaps.platformHeight - 20});
	});
	
	var loader = Ti.UI.createActivityIndicator($$.loader);
	win.add(loader);
	
	if (Ti.Platform.osname === 'android') {
		win.addEventListener('open', function() {
			loader.show();
		});
	} else {
		loader.show();
	}
	
	var logo = Ti.UI.createLabel({
		//text:'Elige los blogs que desees seguir',
		text:'Categorías',
		color:'#333',
		font:{fontSize:'15dp', fontWeight:'bold'},
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
	
	var close = Ti.UI.createButton({
		title:'Continuar',
		font:{fontSize:'18dp', fontWeight:'bold'},
		//width:'50dp',
		height:'40dp',
		bottom:'5dp',
		left:'5dp',
		right:'5dp',
		backgroundImage:'none',
		color:'#FFF',
		backgroundColor:'#0069a5',
		borderRadius:5
	});
	
	close.addEventListener('click', function() {
		if (close.title == 'Guardar y volver') {
			close.title = 'Continuar';
			logo.text = 'Categorías';
			loader.show();
			view.remove(tableView);
			MyCategories(setCategories);
		} else {
			win.close({bottom:'480dp'});
			reload();
		}
	});
	
	view.add(logo);
	view.add(separatorHeader);
	view.add(close);
	
	setTimeout(function() {
		//MyFeeds(setData);
		MyCategories(setCategories);
	}, 500);

	var tableView = null;
	
	function setCategories(data) {

		tableView = Ti.UI.createTableView({
			top:'50dp',
			bottom:'50dp',
			separatorColor:'#8CCC',
			backgroundColor:'#EEE'
		});
		
		for (i in data) {
			
			var row = Ti.UI.createTableViewRow({
				//backgroundColor:'#60694A90',
				height:'70dp',
				_id:data[i].id
			});

			var separator = Ti.UI.createView({
				height:'1dp',
				backgroundColor:'#8FFF',
				top:0
			});
			
			row.add(separator);
			
			var title = Ti.UI.createLabel($$.title);
			title.text = data[i].name;
			title.top = '10dp';
			
			var text = Ti.UI.createLabel($$.text);
			//text.text = data[i].description;
			text.text = data[i].num;
			text.top = '10dp';

			var content = Ti.UI.createView({
				left:'90dp',
				right:'10dp',
				layout:'vertical'
			});

			var image = Ti.UI.createImageView({
				hires:true,
				width:'30dp',
				height:'30dp',
				left:'20dp',
				image:data[i].ico
			});
			
			content.add(title);
			content.add(text);

			row.add(image);
			row.add(content);
			
			tableView.appendRow(row);
			
		}
		
		tableView.addEventListener('click', function(e) {
			logo.text = 'Elige los blogs que desees seguir';
			close.title = 'Guardar y volver';
			loader.hide();
			view.remove(tableView);
			MyFeeds(setData, e.row._id);
		});
		
		loader.hide();
		
		view.add(tableView);

	}

	function setData(data) {
		
		tableView = Ti.UI.createTableView({
			top:'50dp',
			bottom:'50dp',
			separatorColor:'#8CCC',
			backgroundColor:'#EEE'
		});
		
		for (i in data) {
			
			var row = Ti.UI.createTableViewRow({
				//backgroundColor:'#60694A90',
				height:'90dp'
			});

			var separator = Ti.UI.createView({
				height:'1dp',
				backgroundColor:'#8FFF',
				top:0
			});
			
			row.add(separator);
			
			var check = Ti.UI.createImageView({
				left:'5dp',
				width:'30dp',
				height:'30dp',
				_id:data[i].id
			});
			
			if (data[i].haveIt) {
				check.backgroundImage = '/ui/images/checked.png';
			} else {
				check.backgroundImage = '/ui/images/unchecked.png';
			}
			
			var title = Ti.UI.createLabel($$.title);
			title.text = data[i].name;
			title.top = '10dp';
			
			var text = Ti.UI.createLabel($$.text);
			text.text = data[i].description;
			text.top = '10dp';

			var followers = Ti.UI.createLabel($$.text);
			followers.text = data[i].followers;
			followers.bottom = followers.left = '5dp';
			
			if (data[i].plus >= 1) {
				row.backgroundColor = '#694A90';
				title.color = '#FFF';
				title.shadowColor = '#333';
				text.color = '#FFF';
				followers.color = '#FFF';
			}
			
			var content = Ti.UI.createView({
				left:'90dp',
				right:'10dp',
				layout:'vertical'
			});
			
			var image = Ti.UI.createImageView({
				hires:true,
				width:'30dp',
				height:'30dp',
				left:'40dp',
				image:data[i].image
			});

			if (data[i].plus >= 2) {
				image.width = '45dp';
				image.height = '45dp';
			}

			content.add(title);
			content.add(text);
			
			row.add(check);
			row.add(content);
			row.add(image);

			row.add(followers);
			
			tableView.appendRow(row);
			
			row._check = check;
			
		}
		
		tableView.addEventListener('click', function(e) {
			if (e.row._check.backgroundImage == '/ui/images/checked.png') {
				e.row._check.backgroundImage = '/ui/images/unchecked.png';
			} else {
				e.row._check.backgroundImage = '/ui/images/checked.png';
			}
			AddFeed(e.row._check._id);
		});
		
		loader.hide();
		
		view.add(tableView);
		
	}
	
	return win;
	
}
