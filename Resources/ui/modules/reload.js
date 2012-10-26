
if (Ti.Platform.osname == 'android') {
	Mods = require('/modules');
	$$ = require(Mods.android);
}

var getData = require(Mods.bbdd);

module.exports = function(tableView, f_callback, f_callback2) {
	
	var arrow = Ti.UI.createView({
		backgroundImage:'ui/images/arrow.png',
		width:'30dp',
		height:'40dp',
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
	
	var actInd = Ti.UI.createActivityIndicator({
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
	tableHeader.add(actInd);
	
	function formatDate() {
		var objToday = new Date(),
	    weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
	    dayOfWeek = weekday[objToday.getDay()],
	    domEnder = new Array( 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th' ),
	    dayOfMonth = (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder[objToday.getDate()] : objToday.getDate() + domEnder[parseFloat(("" + objToday.getDate()).substr(("" + objToday.getDate()).length - 1))],
	    months = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'),
	    curMonth = months[objToday.getMonth()],
	    curYear = objToday.getFullYear(),
	    curHour = objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours(),
	    curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
	    curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
	    curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
		return curHour + ":" + curMinute;
	}
	
	tableView.headerPullView = tableHeader;
	
	tableView.addEventListener('scroll',function(e) {
		var offset = e.contentOffset.y;
		if (offset <= -65.0 && !pulling) {
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(-180);
			pulling = true;
			arrow.animate({transform:t,duration:180});
			statusLabel.text = L('Suelta para recargar...');
		} else if (pulling && offset > -65.0 && offset < 0) {
			pulling = false;
			var t = Ti.UI.create2DMatrix();
			arrow.animate({transform:t,duration:180});
			statusLabel.text = L('Desliza para recargar...');
		}
	});
	
	tableView.addEventListener('dragEnd',function(e) {
		if (pulling && !reloading) {// && e.contentOffset.y <= -65.0) {
			reloading = true;
			pulling = false;
			arrow.hide();
			actInd.show();
			statusLabel.text = L('Recargando...');
			tableView.setContentInsets({top:60},{animated:true});
			arrow.transform=Ti.UI.create2DMatrix();
			beginReloading();
		}
	});
	
	var pulling = false;
	var reloading = false;
	 
	function beginReloading() {
		
		Ti.App.Properties.removeProperty('feed');

		lastRow = 0;
		
		f_callback(endReloading, tableView);
		
	}
	
	function endReloading(data, tableView) {
		tableView.setContentInsets({top:0},{animated:true});
		reloading = false;
		lastUpdatedLabel.text = L('Última actualización') + ': ' + formatDate();
		statusLabel.text = L('Desliza para recargar...');
		actInd.hide();
		arrow.show();
		f_callback2(data, tableView);
	}
	
}
