
module.exports = function(f_callback) {
	
	var arrow = Ti.UI.createView({
		backgroundImage:'ui/images/arrow.png',
		width:'40dp',
		height:'50dp',
		bottom:'10dp',
		left:'20dp'
	});
	
	var statusLabel = Ti.UI.createLabel({
		text:'Desliza para recargar...',
		left:'55dp',
		width:'200dp',
		bottom:'30dp',
		color:'#333',
		textAlign:'center',
		font:{fontSize:'13dp', fontWeight:'bold'},
		shadowColor:'#999',
		shadowOffset:{x:1,y:1}
	});
	
	var lastUpdatedLabel = Ti.UI.createLabel({
		text:'Última actualización: ' + formatDate(),
		left:'55dp',
		width:'220dp',
		bottom:'15dp',
		color:'#333',
		textAlign:'center',
		font:{fontSize:'12dp'},
		shadowColor:'#999',
		shadowOffset:{x:1,y:1}
	});
	
	var loading = Ti.UI.createActivityIndicator({
		style:Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
		left:'20dp',
		bottom:'13dp'
	});
	
	var tableHeader = Ti.UI.createView({
		backgroundColor:'#EEE',
		height:'60dp'
	});
	
	var border = Ti.UI.createView({
		height:'1dp',
		bottom:0,
		backgroundColor:'#666'
	});
	
	tableHeader.add(border);
	tableHeader.add(arrow);
	tableHeader.add(statusLabel);
	tableHeader.add(lastUpdatedLabel);
	tableHeader.add(loading);
	
	
}
