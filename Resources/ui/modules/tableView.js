
module.exports = function(params, functions) {
	
	var page = 1;
	
	functions.function1(functions.function2); //getData(setData);
	
	var text1 = 'Desliza para recargar';
	var text2 = 'Suelta para recargar';
	var text3 = 'Recargando';
	
	var tableView = Ti.UI.createTableView(params);
	
	if (Ti.Platform.osname === 'android') {
		
		var loader = Ti.UI.createActivityIndicator({
			message:'Cargando...',
			cancelable:true
		});
		
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
					//arrow.animate({transform:t2});
					arrow.transform = t2;
				}
			} else {
				if (reloadText.text != text1) {
					reloadText.text = text1;
					//arrow.animate({transform:t1});
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
		
		function reloadData() {
			loader.show();
			functions.function1(onComplete);
		}
		
		function onComplete(data) {
			tableView.data = [];
			tableView.appendRow(miniReload);
			tableView.appendRow(reload);
			functions.function2(data, 1);
			setTimeout(function() {
				tableView.scrollToIndex(2);
				loader.hide();
				arrow.opacity = 1;
			}, 1000);
			page = 1;
		}
		
		tableView._reload = reloadData;
		
	} else {
		// TODO iOS reload
	}
	
	var lastDistance = 0;
	var updating = false;
	var lastRow = 0;
	var canAppend = true;
	
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
			
			if (updating === false && canAppend === true) {
				
				updating = true;
				
				if (Ti.Platform.osname === 'android') {
					loader.show();
				} else {
					tableView.appendRow(loadingRow);
				}
				
				page += 1;
				
				functions.function1(appendCompleted, page);
				
				setTimeout(function() {
					updating = false;
				}, 1000);
				
			}
			
		} else {
			page = 1;
		}
		
	}
	
	function appendCompleted(data) {
		functions.function2(data);
		loader.hide();
		// TODO iOS delete loading row
	}
	
	return tableView;
	
}
