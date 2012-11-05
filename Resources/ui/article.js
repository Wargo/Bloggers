
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
		var dialog = Ti.UI.createOptionDialog({
			cancel:3,
			options:[L('addToFav', 'Añadir a favoritos'), L('shareByEmail', 'Compartir por email'), L('shareFB', 'Compartir en Facebook'), L('cancel', 'Cancelar')],
			title:L('shareTitle', 'Compartir')
		});
		
		dialog.show();
		
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				MyFavourites(favourite, article.id, article.blog_id, '/ui/images/favourite_on.png', '/ui/images/favourite_off.png');
			} else if (e.index === 1) {
				var emailDialog = Titanium.UI.createEmailDialog();
				emailDialog.subject = 'Mira este artículo';
				emailDialog.html = true;
				emailDialog.toRecipients = null;
				emailDialog.messageBody = 'Visita <a href="http://www.artvisual.net">este artículo</a>';
				emailDialog.open();
			} else if(e.index === 2) {
				Titanium.Facebook.appid = '384278204990770';
				Titanium.Facebook.permissions = ['publish_stream'];
				if(Titanium.Facebook.loggedIn) {
					alert('estoy logueado');
				} else {
					Titanium.Facebook.authorize();
					Titanium.Facebook.addEventListener('login', function(e) {
						Titanium.API.info('FACEBOOK LOGIN DATA' + e.data);
						alert('me acabo de loguear')
					});
				}
			}
		});
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
	
	view.add(Ti.UI.createView({height:'1dp', top:'30dp'})); // separator
	
	var footer = Ti.UI.createView({
		height:'25dp',
		backgroundColor:'#9000',
		bottom:0,
		zIndex:100
	});
	
	var moreSize = Ti.UI.createButton({
		title:'+A',
		color:'#FFF',
		font:{fontSize:18},
		right:'100dp',
		backgroundImage:'none'
	});
	var lessSize = Ti.UI.createButton({
		title:'-A',
		color:'#FFF',
		font:{fontSize:13},
		left:'100dp',
		backgroundImage:'none'
	});
	
	footer.add(lessSize);
	footer.add(moreSize);
	
	moreSize.addEventListener('click', function() {
		moreSize.color = '#CCC';
		font = parseInt(text.font.fontSize.replace('dp', '')) + 1;
		if (font < 25) {
			text.font = {fontSize:font + 'dp'};
			author.font = {fontSize:font + 'dp'};
			$$.text.font = {fontSize:font + 'dp'};
		}
		setTimeout(function() {
			moreSize.color = '#FFF';
		}, 500);
	});
	lessSize.addEventListener('click', function() {
		lessSize.color = '#CCC';
		font = parseInt(text.font.fontSize.replace('dp', '')) - 1;
		if (font > 10) {
			text.font = {fontSize:font + 'dp'};
			author.font = {fontSize:font + 'dp'};
			$$.text.font = {fontSize:font + 'dp'};
		}
		setTimeout(function() {
			lessSize.color = '#FFF';
		}, 500);
	});
	
	win.add(footer);
	
	win.add(view);
	
	return win;
	
}
