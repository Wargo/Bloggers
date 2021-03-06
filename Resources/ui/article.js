
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

MyCrop = require(Mods.crop);
MyAmplify = require(Mods.amplify);

MyFavourites = require(Mods.favourites);
MyGetIsFavourite = require(Mods.isFavourite);

MyWeb = require(Mods.web);

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
		contentHeight:'auto',
		showVerticalScrollIndicator:true,
		layout:'vertical',
		backgroundColor:'#EEE',
		top:'50dp'
	});
	
	var header = Ti.UI.createView({
		height:'50dp',
		top:0,
		backgroundColor:'#0069a5'
	});
	
	var logo = Ti.UI.createLabel({
		text:'FamilyBlog',
		color:'#FFF',
		font:{fontSize:'20dp', fontWeight:'bold'},
		top:0,
		height:'50dp'
	});
	
	var close = Ti.UI.createButtonBar({
		labels:[{image:'/ui/images/backButton.png'}],
		style:Ti.UI.iPhone.SystemButtonStyle.BAR,
		backgroundColor:'#0069a5',
		left:'10dp'
	});
	
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
			optionsDialog[0] = L('remFromFav', 'Quitar de favoritos');
		} else {
			favourite.backgroundImage = '/ui/images/favourite_off.png';
			optionsDialog[0] = L('addToFav', 'Añadir a favoritos');
		}
	}
	
	var optionsDialog = [L('addToFav', 'Añadir a favoritos'), L('shareByEmail', 'Compartir por email'), L('shareFB', 'Compartir en Facebook'), L('shareTwitter', 'Compartir en Twitter'), L('cancel', 'Cancelar')];
	
	favourite.addEventListener('singletap', function() {
		var dialog = Ti.UI.createOptionDialog({
			cancel:4,
			options:optionsDialog,
			title:L('shareTitle', 'Compartir')
		});
		
		dialog.show();
		
		dialog.addEventListener('click', function(e) {
			if (e.index === 0) {
				MyFavourites(favourite, article.id, article.blog_id, '/ui/images/favourite_on.png', '/ui/images/favourite_off.png', optionsDialog);
				setTimeout(function() {
					Ti.App.haveFavs();
				}, 1000);
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
						message:article.title + ' Via @Family_Blog',
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
								message : article.url + ' ' + article.title + ' Via @Family_Blog',
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
						message : article.url + ' ' + article.title + ' Via @Family_Blog',
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
			//caption:'Por ' + article.author + ', ' + article.date,
			caption:author.text,
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
	author.text = article.blog_name;
	if (article.date) {
		author.text += ', ' + article.date;
	}
	author.left = author.right = '10dp';
	
	var text = Ti.UI.createLabel($$.articleText);
	text.text = article.description;
	text.top = text.right = text.left = '10dp';
	
	var image = Ti.UI.createImageView({
		top:'20dp',
		//width:'300dp',
		height:'175dp',
		width:Ti.UI.SIZE,
		borderRadius:10,
		_isLoaded:false
	});
	
	if (Ti.Platform.osname === 'android') {
		var loading = Ti.UI.createLabel({
			color:'#999',
			width:'100dp',
			font:{fontSize:'13dp'}
		});
	} else {
		var loading = Ti.UI.createActivityIndicator({
			style:Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
			color:'#999',
			width:'100dp',
			font:{fontSize:'13dp'}
		});
		win.addEventListener('open', function() {
			if (!image._isLoaded) {
				loading.show();
			}
		});
	}
	
	image.add(loading);
	
	image.addEventListener('load', function() {
		image._isLoaded = true;
		loading.hide();
	});
	
	MyCrop(article.image, article.md5, 300, 175, 10, image, loading);
	
	image.addEventListener('singletap', function() {
		MyAmplify(article.image_big);
	});
	
	win.add(header);
	view.add(title);
	view.add(Ti.UI.createView({height:'1dp', backgroundColor:'#999', top:'10dp', left:'10dp', right:'10dp'}));
	view.add(author);
	view.add(Ti.UI.createView({height:'1dp', backgroundColor:'#999', top:'2dp', left:'10dp', right:'10dp'}));
	view.add(image);
	view.add(text);
	
	if (article.original_url) {
		var link = Ti.UI.createView({
			height:'60dp',
			backgroundColor:'#EEE',
		});
		
		var linkContent = Ti.UI.createView({
			layout:'vertical',
			left:'80dp',
			top:'10dp',
			bottom:'5dp',
			right:'5dp'
		});
		
		var linkTitle = Ti.UI.createLabel($$.title);
		linkTitle.text = article.blog_name;
		linkTitle.height = '20dp';
		var linkText = Ti.UI.createLabel($$.text);
		linkText.text = 'Enlace al artículo';
		var linkImage = Ti.UI.createImageView({
			left:'10dp',
			backgroundImage:article.blog_ico,
			height:'48dp',
			width:'48dp'
		});
		var linkArrow = Ti.UI.createImageView({
			right:'10dp',
			backgroundImage:'/ui/images/arrowR.png',
			height:'12dp',
			width:'12dp',
			opacity:0.5
		});
		
		linkContent.add(linkTitle);
		linkContent.add(linkText);
		
		link.add(linkArrow);
		link.add(linkImage);
		link.add(linkContent);
		
		view.add(Ti.UI.createView({height:'1dp', backgroundColor:'#8FFF', top:'30dp'}));
		view.add(link);
		view.add(Ti.UI.createView({height:'1dp', backgroundColor:'#8CCC'}));
		
		link.addEventListener('singletap', function() {
			MyWeb(article.original_url).open({top:0});
		});
	}	
	
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
	
	setTimeout(function() {
		//win.add(tableView);
		win.add(view);
	}, 200);
	
	
	return win;
	
}
