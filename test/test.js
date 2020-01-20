require("coralian");
require("./../src/index");
const highlighter = FlyHighLighter;
const fs = require("fs");
const FOLDER = './test/res/';

let testLang;

if (testLang) {

	var file = fs.readFileSync(`./test/res/test.${testLang}`, "utf-8");

	var output = highlighter.execute(file, testLang);

	var html = `<html><head>
	<title>测试</title>
	<link rel="stylesheet" type="text/css" href="./../FlyHighLighter.css" />
	</head>
	<body>${output}</body></html>`;
	fs.writeFileSync(`./test/output/${testLang}.html`, html);
} else {
	for (let fileName of require("fs").readdirSync(FOLDER)) {
		try {
			let file = fs.readFileSync(`${FOLDER}${fileName}`, "utf-8");
			var lang = fileName.split(".")[1];

			let output = highlighter.execute(file, lang);

			let html = `<html><head>
	<title>${lang}测试</title>
	<link rel="stylesheet" type="text/css" href="./../FlyHighLighter.css" />
	</head>
	<body>${output}</body></html>`;
			fs.writeFileSync(`./test/output/${lang}.html`, html);
		} catch (e) {
			console.log(`${lang}错误`);
			console.log(e.stack);
		}
	}
}


