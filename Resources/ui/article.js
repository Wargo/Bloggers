
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

MyCrop = require(Mods.crop);
MyAmplify = require(Mods.amplify);

MyFavourites = require(Mods.favourites);
MyGetIsFavourite = require(Mods.isFavourite);

module.exports = function(article) {
	
	var win = Ti.UI.createWindow($$.win);
	win.left = win.width = Ti.Platform.displayCaps.platformWidth;
	
	Ti.Gesture.addEventListener('orientationchange', function() {
		win.animate({width:Ti.Platform.displayCaps.platformWidth});
	});
	
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
	
	favourite = Ti.UI.createButton({
		right:'15dp',
		width:'32dp',
		height:'32dp',
		backgroundImage:'none'
	});
	
	MyGetIsFavourite(setFavourite, article.id);
	
	function setFavourite(result) {
		if (result === 1) {
			favourite.backgroundImage = '/ui/images/favourite_on.png';
		} else {
			favourite.backgroundImage = '/ui/images/favourite_off.png';
		}
	}
	
	favourite.addEventListener('singletap', function() {
		MyFavourites(favourite, article.id, article.blog_id, '/ui/images/favourite_on.png', '/ui/images/favourite_off.png');
	});
	
	header.add(close);
	header.add(logo);
	header.add(favourite);
	
	close.addEventListener('click', function() {
		win.close({left: Ti.Platform.displayCaps.platformWidth, duration:300});
	});
	
	var title = Ti.UI.createLabel($$.title);
	title.text = article.title;
	title.left = title.right = title.top = '10dp';
	title.textAlign = 'center';
	
	var author = Ti.UI.createLabel($$.text);
	author.text = 'Por ' + article.author + ', ' + article.date;
	author.left = author.right = '10dp';
	
	var text = Ti.UI.createLabel($$.text);
	text.text = article.description;
	text.top = text.right = text.left = '10dp';
	
	var image = Ti.UI.createImageView({
		image:article.image,
		top:'20dp'
	});
	
	if (Ti.Platform.osname === 'android') {
		image.left = image.right = '10dp';
	}
	
	image = MyCrop(image, article.md5, 300, 175, 5);
	
	image.addEventListener('singletap', function() {
		MyAmplify(article.image);
	});
	
	view.add(header);
	view.add(title);
	view.add(Ti.UI.createView({height:'1dp', backgroundColor:'#999', top:'10dp', left:'10dp', right:'10dp'}));
	view.add(author);
	view.add(Ti.UI.createView({height:'1dp', backgroundColor:'#999', top:'2dp', left:'10dp', right:'10dp'}));
	view.add(image);
	view.add(text);
	
	view.add(Ti.UI.createView({height:'1dp', top:'50dp'})); // separator
	
	var footer = Ti.UI.createView({
		height:'30dp',
		backgroundColor:'#9000',
		bottom:0
	});
	
	var moreSize = Ti.UI.createButton({
		title:'+A',
		color:'white',
		font:{fontSize:18},
		right:'100dp',
		backgroundImage:'none'
	});
	var lessSize = Ti.UI.createButton({
		title:'-A',
		color:'white',
		font:{fontSize:13},
		left:'100dp',
		backgroundImage:'none'
	});
	
	footer.add(lessSize);
	footer.add(moreSize);
	
	moreSize.addEventListener('singletap', function() {
		font = parseInt(text.font.fontSize.replace('dp', ''));
		text.font.fontSize = font + 1;
	});
	lessSize.addEventListener('singletap', function() {
		font = parseInt(text.font.fontSize.replace('dp', ''));
		text.font.fontSize = font - 1;
	});
	
	win.add(footer);
	
	win.add(view);
	
	return win;
	
}
