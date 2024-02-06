/**
 * Java
 */
const { Char } = JsConst;
const { Span } = require("../constants");
const common = require("../common");
const { canInWord } = require("../components");

const AT_INTERFACE = "@interface";

function doAnnotation(code, index, len, output) {

	let word = String.BLANK;
	for (; index < len; index++) {
		let at = code.charAt(index);
		if (Char.Space.REGX.test(at) || at === Char.Parenthe.LEFT) break;
		word += at;
	}
	if (word === AT_INTERFACE) {
		output.push(Span.KEYWORD_SPAN + word + Span.CLOSE);
	} else {
		output.push(Span.DESCRIPTION + word + Span.CLOSE);
	}

	return --index;
}

const dftBuiltInFunc = ["main",
	"Boolean", "Byte", "Character", "Double", "Float", "Integer", "Long", "Short", "Enum",
	"Error", "Exception", "NoSuchFieldException", "NoSuchMethodException", "NullPointerException",
	"ClassCastException", "ClassNotFoundException", "IndexOutOfBoundsException", "IllegalAccessException",
	"IllegalArgumentException", "Throwable", "Class", "Object", "System", "Thread", "Runnable", "Properties",
	"String", "Number", "Void", "StringBuffer", "StringBuilder", "Math", "Package", "Random",
	"Arrays", "Calendar", "Map", "List", "Set", "Collection", "HashMap", "HashSet", "ArrayList"
];
const dftBuiltInVar = ["T", "E", "K", "V", "O"];

common.addLang([{ name: "JAVA" }], null, {
	judgeExe: function (at) {
		switch (at) {
			case Char.AT:
				return true;
			default:
				return false;
		}
	},
	isBuiltInFunc: function (word, next) {
		return Array.has(dftBuiltInFunc, word && !canInWord(next.charCodeAt(0)));
	},
	isBuiltInVar: function (word, next) {
		return Array.has(dftBuiltInVar, word) && !canInWord(next.charCodeAt(0));
	},
	doc: true,
	execute: function (code, index, len, output) {
		switch (code.charAt(index)) {
			case Char.AT:
				return doAnnotation(code, index, len, output);
			default:
				return index;
		}
	}
}, ["private", "protected", "public", "abstract", "class", "extends", "final", "implements", "interface",
	"native", "new", "static", "strictfp", "synchronized", "transient", "volatile", "break", "continue",
	"return", "do", "while", "if", "else", "for", "instanceof", "switch", "case", "default", "assert",
	"catch", "finally", "throw", "throws", "try", "import", "package", "boolean", "byte", "char", "double",
	"float", "int", "long", "short", "null", "true", "false", "super", "this", "void", "goto"
]);