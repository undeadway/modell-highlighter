
const { Span, XmlEntity, Mark, CLike } = require("./../constants");
const { doHtmlEscape, append } = require("./../components");
const { addLang } = require("./../common");

const MACRODEFINE_SPAN = '<span class="macrodefine">';
const dftBuiltInFunc = ['printf', 'malloc', 'free'];

function doMacroDefine(code, index, len, output) {

	let before = null;

	for (index; index < len; index++) {
		let at = code.charAt(index);
		if (at === Mark.NEW_LINE || (Mark.SPACE_REGX.test(at) && before !== Mark.SHARP) || at === Mark.LEFT_ANGLE || at === Mark.DQUOTE) {
			append(output, Span.CLOSE);
			doHtmlEscape(at, output);
			return index;
		} else {
			doHtmlEscape(at, output);
			before = at;
		}
	}
}

const plugIn = {
	judgeExe: function (at) {
		return at === Mark.SHARP;
	},
	isBuiltInFunc: function (word) {
		return Array.has(dftBuiltInFunc, word);
	},
	execute: function (code, index, len, output) {
		let at = code.charAt(index);
		switch (at) {
			case Mark.SHARP:
				append(output, MACRODEFINE_SPAN);
				append(output, XmlEntity.SHARP);
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