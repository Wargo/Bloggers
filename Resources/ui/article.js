
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

MyCrop = require(Mods.crop);
MyAmplify = require(Mods.amplify);

MyFavourites = require(Mods.favourites);
MyGetIsFavourite = require(Mods.isFavourite);

if (Ti.Platform.osname != 'android') {
	if(parseFloat(Titanium.Platform.version) < 5) {
		social = require(Mods.twitter);
		twitter = social.create({
			site: 'Twitter',
			consumerSecret : 'YsBEbgEXKJvXkVqjy5FhKh8zv2FjSQNBNFAqnyxHOQ',
			consumerKey : 'xdYSDOO2KpUjeeJQ4UKrkQ'
		});
	} else {
		twitter = require('de.marcelpociot.twitter');
	}
} else {
	social = require(Mods.twitter);
	var twitter = social.create({
		site: 'Twitter',
		consumerSecret : 'YsBEbgEXKJvXkVqjy5FhKh8zv2FjSQNBNFAqnyxHOQ',
		consumerKey : 'xdYSDOO2KpUjeeJQ4UKrkQ'
	});
}

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
			cancel:4,
			options:[L('addToFav', 'Añadir a favoritos'), L('shareByEmail', 'Compartir por email'), L('shareFB', 'Compartir en Facebook'), L('shareTwitter', 'Compartir en Twitter'), L('cancel', 'Cancelar')],
			title:L('shareTitle', 'Compartir')
		});
		
		dialog.show();
		
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				MyFavourites(favourite, article.id, article.blog_id, '/ui/images/favourite_on.png', '/ui/images/favourite_off.png');
			} else if (e.index === 1) {
				var emailDialog = Titanium.UI.createEmailDialog();
				emailDialog.subject = 'Te recomiendo que leas "' + article.title + '"';
				emailDialog.html = true;
				emailDialog.toRecipients = null;
				emailDialog.messageBody = '¡Hola! Leyendo a mis bloggers favoritos en FamilyBlog he visto esto y creo que te puede interesar, ¡ya me cuentas!<br /><a href="' + article.url + '">' + article.title + '</a>';
				emailDialog.open();
			} else if (e.index === 2) {
				Ti.Facebook.appid = '384278204990770';
				Ti.Facebook.permissions = ['publish_stream'];
				if(Ti.Facebook.loggedIn) {
					fb_post();
				} else {
					Ti.Facebook.authorize();
					Ti.Facebook.addEventListener('login', function(e) {
						fb_post();
					});
				}
			} else if (e.index === 3) {
				if (Ti.Platform.osname != 'android') {
					twitter.tweet({
						message:article.title + ' Via @FamilyBlog',
						urls:[article.url],
						images:[],
						success: function() {
							//alert('Twitted!')
						},
						cancel: function() {
							//alert('cancel')
						},
						error: function() {
							social = require(Mods.twitter);
							twitter = social.create({
								site: 'Twitter',
								consumerSecret : 'YsBEbgEXKJvXkVqjy5FhKh8zv2FjSQNBNFAqnyxHOQ',
								consumerKey : 'xdYSDOO2KpUjeeJQ4UKrkQ'
							});
							twitter.share({
								message : article.url + ' Via @FamilyBlog -> ' + article.title,
								success : function() {
									alert('Tweeted!');
								},
								error : function() {
									alert('Ha ocurrido un error');
								}
							});
						}
					});
				} else {
					twitter.share({
						message : article.url + ' Via @FamilyBlog -> ' + article.title,
						success : function() {
							alert('Tweeted!');
						},
						error : function() {
							alert('Ha ocurrido un error');
						}
					});
				}
			}
		});
	});
	
	function fb_result(r) {
		if (r.result) {
			Ti.UI.createAlertDialog({
				title:'Facebook',
				message:'Publicado correctamente',
				ok:'Vale'
			}).show();
		} else {
			Ti.Facebook.logout();
		}
	}
	
	function fb_post() {
		var data = {
			name:article.title,
			link:article.url,
			caption:'Por ' + article.author + ', ' + article.date,
			description:article.description.substring(0, 200) + '...'
		};
		var fb_dialog = Ti.Facebook.dialog(
			'feed', data, fb_result
		);
	}

	if (Ti.Platform.osname != 'android') {
		header.add(close);
	}
	
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
	
	var text = Ti.UI.createLabel($$.articleText);
	text.text = article.description;
	text.top = text.right = text.left = '10dp';
	
	var image = Ti.UI.createImageView({
		top:'20dp',
		//width:'300dp',
		height:'175dp'
	});
	
	var loading = Ti.UI.createActivityIndicator({
		style:Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
		cancelable:true,
		color:'#999',
		width:'100dp',
		font:{fontSize:'13dp'}
	});
	image.add(loading);
	loading.show();
	
	image.addEventListener('load', function() {
		loading.hide();
	});
	
	MyCrop(article.image, article.md5, 300, 175, 10, image, loading);
	
	image.addEventListener('singletap', function() {
		MyAmplify(article.image_big);
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
		font:{fontSize:'18dp'},
		right:'80dp',
		backgroundImage:'none',
		height:'40dp',
		width:'60dp'
	});
	var lessSize = Ti.UI.createButton({
		title:'-A',
		color:'#FFF',
		font:{fontSize:'13dp'},
		left:'80dp',
		backgroundImage:'none',
		height:'40dp',
		width:'60dp'
	});
	
	footer.add(lessSize);
	footer.add(moreSize);
	
	moreSize.addEventListener('click', function() {
		moreSize.color = '#999';
		font = parseInt(text.font.fontSize.replace('dp', '')) + 1;
		if (font < 25) {
			text.font = {fontSize:font + 'dp'};
			$$.articleText.font = {fontSize:font + 'dp'};
		}
		setTimeout(function() {
			moreSize.color = '#FFF';
		}, 500);
	});
	lessSize.addEventListener('click', function() {
		lessSize.color = '#999';
		font = parseInt(text.font.fontSize.replace('dp', '')) - 1;
		if (font > 10) {
			text.font = {fontSize:font + 'dp'};
			$$.articleText.font = {fontSize:font + 'dp'};
		}
		setTimeout(function() {
			lessSize.color = '#FFF';
		}, 500);
	});
	
	win.add(footer);
	
	win.add(view);
	
	return win;
	
}
