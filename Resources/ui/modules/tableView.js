
module.exports = function(params, functions) {
	
	var page = 1;
	
	functions.function1(functions.function2); //getData(setData);
	
	var text1 = 'Desliza para recargar';
	var text2 = 'Suelta para recargar';
	var text3 = 'Recargando';
	
	var tableView = Ti.UI.createTableView(params);
	
	if (Ti.Platform.osname === 'android') {

		if (!params._noReload) {
		
			var t1 = Ti.UI.create2DMatrix();
			var t2 = Ti.UI.create2DMatrix();
			t2 = t2.rotate(-180);
			
			var arrow = Ti.UI.createImageView({
				image:'/ui/images/arrow_reload_tableView.png',
				width:'22dp',
				height:'32dp',
				left:0
			});
			var reloadText = Ti.UI.createLabel({
				text:text1,
				textAlign:'center'
			});
			
			var reloadTextView = Ti.UI.createView({
				width:'250dp'
			});
			reloadTextView.add(arrow);
			reloadTextView.add(reloadText);
			
			var reload = Ti.UI.createTableViewRow({
				height:'60dp',
				focusable:false
			});
			reload.add(reloadTextView);
			
			var loader = Ti.UI.createActivityIndicator({
				message:'Cargando...',
				cancelable:true
			});
			
			var miniReload = Ti.UI.createTableViewRow({
				height:'10dp',
				focusable:false
			});
			
			tableView.appendRow(miniReload);
			tableView.appendRow(reload);
			
			tableView.scrollToIndex(2);
			
			var firstVisibleItem = 0;
			var visibleItemCount = 0;
			var totalItemCount = 0;
			
			tableView.addEventListener('scroll', function(e) {
				if (e.firstVisibleItem == 0) {
					if  (reloadText.text != text2) {
						reloadText.text = text2;
						//arrow.animate({transform:t2, duration:500});
						arrow.transform = t2;
					}
				} else {
					if (reloadText.text != text1) {
						reloadText.text = text1;
						//arrow.animate({transform:t1, duration:500});
						arrow.transform = t1;
					}
				}
				firstVisibleItem = e.firstVisibleItem;
				visibleItemCount = e.visibleItemCount;
				totalItemCount = e.totalItemCount;
			});
			
			tableView.addEventListener('scrollEnd', function(e) {
				if (reloadText.text == text2) {
					reloadText.text = text3;
					arrow.opacity = 0;
					reloadData();
				} else if (firstVisibleItem < 2) {
					tableView.scrollToIndex(2);
				}
			});
			
			var reloading = false;
			
			function reloadData() {
				page = 1;
				reloading = true;
				updating = false;
				lastRow = 0;
				loader.show();
				functions.function1(onComplete);
			}
			
			function onComplete(data) {
				tableView.data = [];
				tableView.appendRow(miniReload);
				tableView.appendRow(reload);
				functions.function2(data, 1);
				reloading = false;
				setTimeout(function() {
					tableView.scrollToIndex(2);
					loader.hide();
					arrow.opacity = 1;
				}, 1000);
				page = 1;
			}
			
			tableView._reload = reloadData;
		}
		
	} else { // iOS

		var arrow = Ti.UI.createView({
			backgroundImage:'ui/images/arrow_reload_tableView.png',
			width:'22dp',
			height:'32dp',
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
			
			tableView.data = [];
			page = 1;
			lastRow = 0;
			updating = false;
			
			functions.function1(endReloading, 1);
			
		}
		
		function endReloading(data) {
			tableView.setContentInsets({top:0},{animated:true});
			setTimeout(function() {
				reloading = false;
			}, 500);
			
			lastUpdatedLabel.text = L('Última actualización') + ': ' + formatDate();
			statusLabel.text = L('Desliza para recargar...');
			actInd.hide();
			arrow.show();
			functions.function2(data, 1);
		}
		
		tableView._reload = beginReloading;

	}
	
	// APPEND
	
	var lastDistance = 0;
	var updating = false;
	var lastRow = 0;
	
	var loadingRow = Ti.UI.createTableViewRow();
	loadingRow.height = '40dp';
	loadingRow.focusable = false;
	
	var loadingRowView = Ti.UI.createView();
	
	if (Ti.Platform.osname != 'android') {
		
		var loadingMore = Ti.UI.createActivityIndicator({
			style:Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
			message:L('loading', 'Cargando...'),
			color:'#999'
		});
		
		loadingRowView.add(loadingMore);
		loadingRow.add(loadingRowView);
		loadingMore.show();
		
	}
	
	if (Ti.Platform.osname === 'android') {
		
		tableView.addEventListener('scrollEnd', function(e) {
			
			if (firstVisibleItem + visibleItemCount == totalItemCount && totalItemCount > visibleItemCount && updating === false) {
				append();
			}
			
		});
		
	} else {
			
		tableView.addEventListener('scroll', function(e) {
			
			var offset = e.contentOffset.y;
			var height = e.size.height;
			var total = offset + height;
			var theEnd = e.contentSize.height;
			var distance = theEnd - total;
			
			if (distance < lastDistance) {
				
				var nearEnd = theEnd * 0.95;
				
				if  (!updating && (total > nearEnd)) {
					append();
				}
				
			}
			
			lastDistance = distance;
				
		});
		
	}
	
	function append() {
		
		if (typeof tableView.data[0] != 'undefined' && tableView.data[0].rows.length > 1) {

			if (updating === false && reloading == false) {
				
				updating = true;
				
				if (Ti.Platform.osname === 'android') {
					loader.show();
				} else {
					tableView.appendRow(loadingRow);
					lastRow = tableView.data[0].rowCount - 1;
					Ti.API.error(lastRow);
				}
				
				page += 1;
				
				functions.function1(appendCompleted, page);
				
			}
			
		} else {
			page = 1;
		}
		
	}
	
	function appendCompleted(data) {
		if (data.length > 0) {
			functions.function2(data);
			updating = false;
		}
		if (Ti.Platform.osname === 'android') {
			loader.hide();
		} else {
			tableView.deleteRow(lastRow);
		}
	}
	
	return tableView;
	
}
