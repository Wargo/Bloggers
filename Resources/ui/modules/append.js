
module.exports = function(tableView, f_callback, aux_function) {
	
	var lastDistance = 0;
	var updating = false;
	var lastRow = 0;
	var page = 1;
	
	var loadingRow = Ti.UI.createTableViewRow();
	loadingRow.height = '40dp';
	loadingRow.focusable = false;
	
	if (Ti.Platform.osname === 'android') {
		
		var loadingMore = Ti.UI.createLabel({
			text:L('loading', 'Cargando...'),
			color:'#999'
		});
		
	} else {
		
		var loadingMore = Ti.UI.createActivityIndicator({
			style:Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
			message:L('loading', 'Cargando...'),
			color:'#999'
		});
		
	}
	var loadingRowView = Ti.UI.createView();
	
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
		
		if (updating === false) {
			
			updating = true;
			tableView.appendRow(loadingRow);
			page += 1;
			
			var lastRow = 0;
			for(var i = 0; i < tableView.data.length; i++) {
				for(var j = 0; j < tableView.data[i].rowCount; j++) {
					lastRow ++;
				}
			}
			
			f_callback(aux_function, tableView, page);
			
			setTimeout(function() {
				updating = false;
				if (Ti.Platform.osname === 'android') {
					tableView.deleteRow(lastRow - 1);
				} else {
					tableView.deleteRow(lastRow - 1);
				}
			}, 2000);
			
		}
		
	}
	
}
