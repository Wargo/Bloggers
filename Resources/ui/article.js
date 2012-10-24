
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

module.exports = function(article) {
	
	var win = Ti.UI.createWindow($$.win);
	win.left = '320dp';
	
	var view = Ti.UI.createScrollView({
		layout:'vertical',
		contentHeight:'auto',
		showVerticalScrollIndicator:true
	});
	
	var header = Ti.UI.createView({
		height:'50dp',
		top:0,
		backgroundColor:'#0069a5'
	});
	
	var close = Ti.UI.createButton({
		backgroundImage:'/ui/images/backButton.png',
		title:'Volver',
		width:'87dp',
		height:'50dp',
		left:'10dp'
	});
	
	header.add(close);
	
	close.addEventListener('click', function() {
		win.close({left:'320dp', duration:300});
	});
	
	var title = Ti.UI.createLabel($$.title);
	title.text = article.title;
	title.left = title.right = title.top = '10dp';
	title.textAlign = 'center';
	
	var text = Ti.UI.createLabel($$.text);
	text.text = article.description;
	text.top = text.right = text.left = '10dp';
	
	view.add(header);
	view.add(title);
	view.add(Ti.UI.createImageView({
		image:article.image,
		top:'10dp',
		right:'10dp',
		left:'10dp',
		width:'300dp'
	}));
	view.add(text);
	
	win.add(view);
	
	return win;
	
}
