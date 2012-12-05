
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

var MyArticle = require(Mods.article);

if (Ti.Platform.osname != 'android') {
	//var MyReload = require(Mods.reload);
}

var getData = require(Mods.favouritesList);

var MyCrop = require(Mods.crop);

//var MyAppend = require(Mods.append);

var MyTableView = require(Mods.tableView);

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
	/*
	var close = Ti.UI.createView({
		backgroundImage:'/ui/images/backButton.png',
		width:'40dp',
		height:'40dp',
		left:'10dp'
	});
	*/
	var close = Ti.UI.createButtonBar({
		labels:[{image:'/ui/images/backButton.png'}],
		style:Ti.UI.iPhone.SystemButtonStyle.BAR,
		backgroundColor:'#0069a5',
		left:'10dp'
	});
	close.addEventListener('click', function() {
		win.close({left: Ti.Platform.displayCaps.platformWidth, duration:300});
	});
	
	if (Ti.Platform.osname != 'android') {
		header.add(close);
	}
	header.add(logo);
	
	win.add(header);
	
	var tableView = new MyTableView({
		top:'50dp',
		separatorColor:'#8CCC',
		backgroundColor:'#EEE',
		opacity:0
	}, {
		function1: getData,
		function2: setData
	});
	
	/*
	if (Ti.Platform.osname != 'android') {
		MyReload(tableView, getData, setData);
	} else {
		logo.addEventListener('click', function() {
			reload();
		});
	}
	*/
	/*
	setTimeout(function() {
		getData(setData, tableView);
		loader.show();
	}, 500);
	*/
	win._tableView = tableView;
	
	tableView.addEventListener('click', function(e) {
		if (e.row.focusable === false) {
			return;
		}
		var newWin = MyArticle(e.row._article);
		newWin.open({left:0, duration:300});
	});
	
	//var functions = MyAppend(tableView, getData, setData, page);
	
	function setData(data, p) {
		
		if (p === 1 && data.length === 0) {

			var message = Ti.UI.createLabel({
				left:'15dp',
				right:'15dp',
				top:'15dp',
				font:{fontSize:'13dp'},
				color:'#999',
				text:'Todavía no tienes ningún favorito añadido. Puedes hacerlo a través del botón que aparece en la esquina superior derecha dentro de cualquier artículo.'
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
	
	/*
	function reload() {
		tableView.data = [];
		page = 1;
		tableView.opacity = 0;
		loader.show();
		Ti.App.Properties.removeProperty('feed');
		getData(setData, tableView);
	}
	*/
	return win;
	
}
