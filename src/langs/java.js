
const { Span, Mark } = require("../constants");
const common = require("../common");

const ANNOTATION_SPAN = '<span class="annotation">',
	AT_INTERFACE = '@interface';

function doAnnotation(code, index, len, output) {

	let word = String.BLANK;
	for (; index < len; index++) {
		let at = code.charAt(index);
		if (Mark.SPACE_REGX.test(at) || at === Mark.LEFT_PARENTHE) break;
		word += at;
	}
	if (word === AT_INTERFACE) {
		output.push(Span.KEYWORD_SPAN + word + Span.CLOSE);
	} else {
		output.push(ANNOTATION_SPAN + word + Span.CLOSE);
	}

	return --index;
}

const dftBuiltInFunc = ['Object', 'System', 'NullPointerException', 'Boolean', 'Integer', 'main', 'Exception',
	'Throwable', 'Error', 'Class', 'String', 'Long', 'Number', 'Character', 'Short', 'Byte', 'Float',
	'Double', 'Math', 'Date', 'Calendar', 'StringBuffer', 'StringBuilder', 'Arrays'
];
const dftBuiltInVar = ['T', 'E', 'K', 'V'];

common.addLang([{ name: "JAVA" }], null, {
	judgeExe: function (at) {
		switch (at) {
			case Mark.AT:
				return true;
			default:
				return false;
		}
	},
	isBuiltInFunc: function (word) {
		return Array.has(dftBuiltInFunc, word);
	},
	isBuiltInVar: function (word) {
		return Array.has(dftBuiltInVar, word);
	},
	doc: true,
	execute: function (code, index, len, output) {
		switch (code.charAt(index)) {
			case Mark.AT:
				return doAnnotation(code, index, len, output);
			default:
				return index;
		}
	}
}, ['private', 'protected', 'public', 'abstract', 'class', 'extends', 'final', 'implements', 'interface',
		'native', 'new', 'static', 'strictfp', 'synchronized', 'transient', 'volatile', 'break', 'continue',
		'return', 'do', 'while', 'if', 'else', 'for', 'instanceof', 'switch', 'case', 'default', 'assert',
		'catch', 'finally', 'throw', 'throws', 'try', 'import', 'package', 'boolean', 'byte', 'char', 'double',
		'float', 'int', 'long', 'short', 'null', 'true', 'false', 'super', 'this', 'void', 'goto'
	]);