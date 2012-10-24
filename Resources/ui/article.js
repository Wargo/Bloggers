
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
		backgroundColor:'#133783'
	});
	
	var close = Ti.UI.createButton({
		title:'Cerrar',
		width:'80dp',
		height:'30dp',
		right:'10dp'
	});
	
	header.add(close);
	
	close.addEventListener('click', function() {
		win.close({left:'320dp', duration:300});
	});
	
	view.add(header);
	
	view.add(Ti.UI.createLabel({
		color:'#000',
		text:article.title,
		shadowOffset:{x:1,y:1},
		shadowColor:'#333',
		font:{fontSize:'18dp', fontWeight:'bold'},
		left:'10dp',
		right:'10dp',
		top:'10dp',
		textAlign:'center'
	}));
	view.add(Ti.UI.createImageView({
		image:article.image,
		top:'10dp',
		right:'10dp',
		left:'10dp',
		width:'300dp',
		//height:'200dp'
	}));
	view.add(Ti.UI.createLabel({
		text:article.description,
		top:'10dp',
		right:'10dp',
		left:'10dp',
		color:'#666'
	}));
	
	win.add(view);
	
	return win;
	
}
