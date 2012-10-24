
module.exports = {

	mainWin: {
		backgroundColor:'white'
	},

	win: {
		backgroundColor:'white',
		width:320
	},
	
	loader: {
		style:Ti.UI.iPhone.ActivityIndicatorStyle.DARK
	},
	
	title: {
		font:{fontSize:'15dp', fontWeight:'bold'},
		left:0,
		color:'#333',
		shadowOffset:{x:1,y:1},
		shadowColor:'#CCC'
	},
	
	text: {
		font:{fontSize:'13dp'},
		left:0,
		color:'#666'
	},
	
	backButton: {
		text:'Volver',
		color:'#666',
		right:'15dp',
		font:{fontSize:'14dp'}
	}

}