var path = require("path");

module.exports = {
	entry: {"modell-highlighter" : "./src/index.js"},
	output: {
		path:path.resolve(__dirname ,"dist"),
		filename:"[name].js"
	},
	mode:"development"
};

