
module.exports = function(tableView, f_callback, aux_function, page) {
	
	var lastDistance = 0;
	var updating = false;
	var lastRow = 0;
	var canAppend = true;
	
	var loadingRow = Ti.UI.createTableViewRow();
	loadingRow.height = '40dp';
	loadingRow.focusable = false;
	
	var loadingRowView = Ti.UI.createView();
	
	if (Ti.Platform.osname === 'android') {
		
		var loadingMore = Ti.UI.createLabel({
			text:L('loading', 'Cargando...'),
			color:'#999'
		});
		
		var loading = Ti.UI.createActivityIndicator({
			message:L('loading', 'Cargando...')
		});
		
		loadingRowView.add(loading);
		
	} else {
		
		var loadingMore = Ti.UI.createActivityIndicator({
			style:Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
			message:L('loading', 'Cargando...'),
			color:'#999'
		});
		
	}
	
	loadingRowView.add(loadingMore);
	loadingRow.add(loadingRowView);
	loadingMore.show();
	
	tableView.addEventListener('scroll', function(e) {
		
		if (Ti.Platform.osname === 'android') {
			
			if (e.firstVisibleItem + e.visibleItemCount == e.totalItemCount && e.totalItemCount > 0 && updating === false) {
				append();
			}
			
		} else if (Ti.Platform.osname === 'iphone') {
			
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
			
		}
		
	});
	
	function append() {
		
		if (typeof tableView.data[0] != 'undefined' && tableView.data[0].rows.length > 1) {
			
			if (updating === false && canAppend === true) {
				
				updating = true;
				tableView.appendRow(loadingRow);
				page += 1;
				
				f_callback(aux_function, tableView, page);
				
				setTimeout(function() {
					updating = false;
				}, 1000);
				
			}
			
		} else {
			page = 1;
		}
		
	}
	
	function resetPage(p) {
		page = p;
	}
	
	function setCanAppend(param) {
		canAppend = param;
	}
	
	var functions = new Object();
	functions.resetPage = resetPage;
	functions.setCanAppend = setCanAppend;
	
	return functions;
	
}
