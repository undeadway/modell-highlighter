/**
 * JavaScript
 */
const { Char } = JsConst;
const { Span, CLike } = require("./../constants");
const common = require("./../common");
const { defaultDoChars } = require("./../components");

const dftBuiltInFunc = ["eval", "alert", "Object", "String", "Date", "Number", "Math", "RegExp", "Function",
	"Error", "Boolean", "Array", "parseInt", "parseFloat", "isNaN", "isFinite", "decodeURI", "decodeURIComponent",
	"encodeURI", "encodeURIComponent", "escape", "unescape", "setTimeout", "setInterval", "apply", "call", "callee"
];
const dftBuiltInVar = ["document", "window", "console", "Infinity", "NaN", "arguments", "global", "exports", "module", "import", "from"];

// json 就是 js ，所以直接引用JS 的实现
common.addLang([{ name: "JAVASCRIPT" }, { name: "JSON" }], null, {
	doComment: common.commonDoComment,
	charSpan: Span.STRING,
	judgeExe: function (at) {
		return at === Char.GRAVE_ACCENT;
	},
	execute: function (code, index, len, output) {
		// js 中的 ` 就是字符串符号，所以直接调用字符串操作
		let at = code.charAt(index);
		switch (at) {
			case Char.GRAVE_ACCENT:
				return defaultDoChars(code, index, len, output, CLike.ESCAPER, Char.GRAVE_ACCENT, Span.STRING);

		}
	},
	isBuiltInFunc: function (word) {
		return Array.has(dftBuiltInFunc, word);
	},
	isBuiltInVar: function (word) {
		return Array.has(dftBuiltInVar, word);
	}
}, ["break", "case", "catch", "continue", "default", "delete ", "do", "else", "false", "finally", "for",
	"function", "if", "in", "instanceof", "new", "null", "return", "switch", "this", "throw", "true",
	"try", "typeof", "let", "var", "while", "with", "void", "undefined", "abstract", "boolean",
	"class", "const", "debug"
	// "byte", "char", "double", "enum", "extends", "final", "float", "goto", "let",
	// "implements", "int", "interface", "long", "native", "package", "private", "protected",
	// "public", "short", "static", "super", "synchronized", "throws", "transient", "volatile"
]);