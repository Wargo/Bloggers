
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

MyCrop = require(Mods.crop);
MyAmplify = require(Mods.amplify);

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
	
	var logo = Ti.UI.createLabel({
		text:'Bloggers',
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
	
	header.add(close);
	header.add(logo);
	
	close.addEventListener('click', function() {
		win.close({left:'320dp', duration:300});
	});
	
	var title = Ti.UI.createLabel($$.title);
	title.text = article.title;
	title.left = title.right = title.top = '10dp';
	title.textAlign = 'center';
	
	var author = Ti.UI.createLabel($$.text);
	author.text = 'Por ' + article.author + ', ' + article.date;
	author.left = '10dp';
	
	var text = Ti.UI.createLabel($$.text);
	text.text = article.description;
	text.top = text.right = text.left = '10dp';
	
	var image = Ti.UI.createImageView({
		image:article.image,
		top:'20dp',
		//right:'10dp',
		//left:'10dp'
	});
	
	image = MyCrop(image, article.md5, '300dp', '175dp', 5);
	
	image.addEventListener('click', function() {
		MyAmplify(article.image);
	});
	
	view.add(header);
	view.add(title);
	view.add(Ti.UI.createView({height:'1dp', backgroundColor:'#999', top:'10dp', left:'10dp', right:'10dp'}));
	view.add(author);
	view.add(Ti.UI.createView({height:'1dp', backgroundColor:'#999', top:'2dp', left:'10dp', right:'10dp'}));
	view.add(image);
	view.add(text);
	
	view.add(Ti.UI.createView({height:'1dp', top:'20dp'}));
	
	win.add(view);
	
	return win;
	
}
