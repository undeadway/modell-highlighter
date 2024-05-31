const fs = require("fs");
const sass = require("sass");

const inputFileName = __dirname + "/../src/scss/modell-highLighter.scss";
const outputFileName = __dirname + "/../dist/modell-highLighter.css";

const result = sass.compile(inputFileName);

fs.writeFileSync(outputFileName, result.css);