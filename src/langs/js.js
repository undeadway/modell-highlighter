
const { Span } = require("./../constants");
const common = require("./../common");

const dftBuiltInFunc = ['eval', 'alert', 'Object', 'String', 'Date', 'Number', 'Math', 'RegExp', 'Function',
	'Error', 'Boolean', 'Array', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'decodeURI', 'decodeURIComponent',
	'encodeURI', 'encodeURIComponent', 'escape', 'unescape', 'setTimeout', 'setInterval', 'apply', 'call', 'callee'
];
const dftBuiltInVar = ['document', 'window', 'console', 'Infinity', 'NaN', 'arguments', 'global', 'exports', 'module'];

// json 就是 js ，所以直接引用JS 的实现
common.addLang([{ name: 'JAVASCRIPT' }, { name: 'JSON' }], null, {
	doComment: common.commonDoComment,
	charSpan: Span.STRING,
	isBuiltInFunc: function (word) {
		return Array.has(dftBuiltInFunc, word);
	},
	isBuiltInVar: function (word) {
		return Array.has(dftBuiltInVar, word);
	}
}, ['break', 'case', 'catch', 'continue', 'default', 'delete ', 'do', 'else', 'false', 'finally', 'for',
		'function', 'if', 'in', 'instanceof', 'new', 'null', 'return', 'switch', 'this', 'throw', 'true',
		'try', 'typeof', 'let', 'var', 'while', 'with', 'void', 'undefined', 'abstract', 'boolean', 'byte', 'char',
		'class', 'const', 'debugger', 'double', 'enum', 'export', 'extends', 'final', 'float', 'goto', 'let',
		'implements', 'import', 'int', 'interface', 'long', 'native', 'package', 'private', 'protected',
		'public', 'short', 'static', 'super', 'synchronized', 'throws', 'transient', 'volatile'
	]);