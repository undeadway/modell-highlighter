require("coralian");
var highlighter = require("./../src/index");

var fs = require("fs");

var file = fs.readFileSync("./test/res/test.java", "utf-8");

var output = highlighter.execute(file, "Java");

var html = `<html><head>
<title>测试</title>
<link rel="stylesheet" type="text/css" href="./FlyHighLighter.css" />
</head>
<body>${output}</body></html>`;
fs.writeFileSync("./test/output/java.html", html);