require("./Eureka!");// 载入本地的一些初始化设置，自行实现
var flyHighLighter = require("./FlyHighLighter");
var fs = require("fs");

var src = fs.readFileSync("./test/ ", "utf-8"); // 这里自己换文件

var out = '<link rel="stylesheet" type="text/css" href="./FlyHighLighter.css" />' + flyHighLighter.execute(src).join("");

fs.writeFileSync("out.html", out);