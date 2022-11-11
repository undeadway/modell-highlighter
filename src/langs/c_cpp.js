/**
 * C、C++
 */
const { XmlEntity, Char } = JsConst;
const { Span } = require("./../constants");
const { doHtmlEscape, append } = require("./../components");
const { addLang } = require("./../common");

const dftBuiltInFunc = ["printf", "malloc", "free"];

function doMacroDefine(code, index, len, output) {

	let before = null;

	for (index; index < len; index++) {
		let at = code.charAt(index);
		if (at === Char.NEW_LINE || (Char.SPACE_REGX.test(at) && before !== Char.SHARP) || at === Char.LEFT_ANGLE || at === Char.DQUOTE) {
			append(output, Span.CLOSE);
			doHtmlEscape(at, output);
			return index;
		}

		doHtmlEscape(at, output);
		before = at;
	}
}

const plugIn = {
	judgeExe: function (at) {
		return at === Char.SHARP;
	},
	isBuiltInFunc: function (word) {
		return Array.has(dftBuiltInFunc, word);
	},
	execute: function (code, index, len, output) {
		let at = code.charAt(index);
		switch (at) {
			case Char.SHARP:
				append(output, Span.DEFINE);
				append(output, XmlEntity.SHARP);
				return doMacroDefine(code, ++index, len, output);
			default:
				return index;
		}
	}
}

addLang([{ name: "C" }], null, plugIn, ["auto", "_bool", "break", "case", "char", "const", "continue",
	"do", "default", "double", "else", "enum", "extern", "float", "for", "goto", "if", "int", "long",
	"register", "return", "typedef", "signed", "sizeof", "short", "static", "struct", "switch", "union",
	"unsigned", "void", "volatile", "while"
]);

// C++暂时只在关键字上区别C语言
addLang([{ name: "C++" }], null, plugIn, ["asm", "auto", "bool", "break", "case", "catch", "char", "class",
	"const", "const_cast", "continue", "default", "delete", "do", "double", "dynamic_cast", "else", "enum",
	"explicit", "export", "extern", "false", "float", "for", "friend", "goto", "if", "inline", "int", "long",
	"mutable", "namespace", "new", "operator", "private", "protected", "public", "register", "reinterpret_cast",
	"return", "short", "signed", "sizeof", "static", "static_cast", "struct", "switch", "template", "this",
	"throw", "true", "try", "typedef", "typeid", "typename", "union", "unsigned", "using", "virtual", "void",
	"volatile", "wchar_t", "while"
]);