
const { Span, XmlEntity, Mark, CLike } = require("./../constants");
const { doHtmlEscape } = require("./../components");
const { addLang } = require("./../common");

const MACRODEFINE_SPAN = '<span class="macrodefine">';
const dftBuiltInFunc = ['printf', 'malloc', 'free'];

function doMacroDefine(code, index, len, output) {

	var before = null;

	for (index; index < len; index++) {
		var at = code.charAt(index);
		if (at === NL_N || (Mark.SPACE_REGX.test(at) && before !== Mark.SHARP) || at === Mark.LEFT_ANGLE || at === Mark.DQUOTE) {
			output.push(Span.CLOSE);
			doHtmlEscape(at, output);
			return index;
		} else {
			doHtmlEscape(at, output);
			before = at;
		}
	}
}

var plugIn = {
	judgeExe: function (at) {
		switch (at) {
			case SHARP:
				return true;
			default:
				return false;
		}
	},
	isBuiltInFunc: function (word) {
		return Array.has(dftBuiltInFunc, word);
	},
	OPERATOR_REGX: CLike.OPERATOR_REGX,
	execute: function (code, index, len, output) {
		var at = code.charAt(index);
		switch (at) {
			case SHARP:
				output.push(MACRODEFINE_SPAN);
				output.push(XmlEntity.SHARP);
				return doMacroDefine(code, ++index, len, output);
			default:
				return index;
		}
	}
}

addLang([{ name: "C" }], null, plugIn, ['auto', '_bool', 'break', 'case', 'char', 'const', 'continue',
	'do', 'default', 'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'int', 'long',
	'register', 'return', 'typedef', 'signed', 'sizeof', 'short', 'static', 'struct', 'switch', 'union',
	'unsigned', 'void', 'volatile', 'while'
]);

// C++暂时只在关键字上区别C语言
addLang([{ name: "C++" }], null, plugIn, ['asm', 'auto', 'bool', 'break', 'case', 'catch', 'char', 'class',
	'const', 'const_cast', 'continue', 'default', 'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum',
	'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long',
	'mutable', 'namespace', 'new', 'operator', 'private', 'protected', 'public', 'register', 'reinterpret_cast',
	'return', 'short', 'signed', 'sizeof', 'static', 'static_cast', 'struct', 'switch', 'template', 'this',
	'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void',
	'volatile', 'wchar_t', 'while'
]);