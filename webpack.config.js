const path = require('path'); 
 
module.exports = { 
	entry: ['./src/server.js'], 
	output: { 
		path: path.resolve(__dirname, './dist'), 
		filename: 'server.js' 
	}, 
	module: { 
		loaders: [ 
			{ 
				loader: 'babel-loader', 
				test: /\.js$/, 
				exclude: /node_modules/ 
			} 
		] 
	} 
}