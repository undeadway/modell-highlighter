var path = require("path");

module.exports = {
	entry: {FlyHighlighter : "./src/index.js"},
	node: {
		fs: "empty"	
	},
	output: {
		path:path.resolve(__dirname ,"dist"),
		filename:"[name].js"
	}
};

