const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

global.$ = $;
global.window = window;
global.document = window.document;

require("coralian");
require("../dist/ModellHighlighter");
const highlighter = ModellHighLighter;