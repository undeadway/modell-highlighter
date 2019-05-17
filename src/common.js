
const { Span, Mark, Common, CLike, CharCode } = require("./constants");
const components = require("./components");

const LANGUAGES = {};

const langMap = {
	JAVA: 'Java',
	JAVASCRIPT: 'JavaScript',
	VBSCRIPT: 'VBScript',
};

function commonDoRegExp(code, index, len, at, output) {
	let word = [at],
		before = at,
		hasRegex = false;
	let start = index;
	for (start += 1; start < len; start++) {
		at = code.charAt(start);
		if (at === Mark.NL_N) {
			break;
		} else if (at === Mark.SLASH && before !== CLike.ESCAPER) {
			hasRegex = true;
		} else if (hasRegex && !(at === 'i' || at === 'g' || at === 'm')) {
			break;
		}
		components.doHtmlEscape(at, word);
		before = at;
	}
	if (hasRegex) {
		output.push(Span.REGEXP + word.join(String.BLANK) + Span.CLOSE);
		start--;
		index = start;
	}
	return index;
}

function commonDoComment(code, index, len, at, output) {
	let next = code.charAt(index + 1);
	let method = (next === Mark.SLASH || next === Mark.ASTERISK) ? components.doComment4CLike : commonDoRegExp;
	return method(code, index, len, at, output);
}

function commonExecute(code) {
	let kw = this.getKeywords(),
		plugIn = this.getPlugIn(),
		escaper = CLike.ESCAPER,
		operatorRegx = CLike.OPERATOR_REGX,
		judgeExe = components.defaultJudgePluginExe,
		plugInExe = null,
		hasPlugIn = !!plugIn,
		// 插件的判断函数
		doComment = components.doComment4CLike,
		judgeComment = components.judgeComment4CLike,
		isBuiltInFunc = components.defaultIsBuiltIn,
		isBuiltInVar = components.defaultIsBuiltIn,
		// 插件的执行函数
		doKeyword = components.defaultDoKeyword,
		doChar = components.defaultDoChars,
		doNumber = components.defaultDoNumber,
		doBuiltIn = components.defaultDoBuiltIn,
		// 插件替代量的默认值
		charCaseMethod = null,
		charSpan = Span.CHAR,
		doc = false;

	let word = String.BLANK, output = [];

	// 插件和可替换（继承）处理的预处理
	if (hasPlugIn) {
		if (plugIn.charSpan) {
			charSpan = plugIn.charSpan;
		}
		if (plugIn.escaper) {
			escaper = plugIn.escaper;
		}
		if (plugIn.doComment) {
			doComment = plugIn.doComment;
		}
		if (plugIn.charCaseMethod) {
			charCaseMethod = plugIn.charCaseMethod;
		}
		if (plugIn.judgeComment) {
			judgeComment = plugIn.judgeComment;
		}
		if (plugIn.judgeExe) {
			judgeExe = plugIn.judgeExe;
			if (plugIn.execute) {
				plugInExe = plugIn.execute;
			}
		}
		if (plugIn.doChar) {
			doChar = plugIn.doChar;
		}
		if (plugIn.doNumber) {
			doNumber = plugIn.doNumber;
		}
		if (plugIn.doKeyword) {
			doKeyword = plugIn.doKeyword;
		}
		if (plugIn.doBuiltIn) {
			doBuiltIn = plugIn.doBuiltIn;
		}
		if (plugIn.isBuiltInFunc) {
			isBuiltInFunc = plugIn.isBuiltInFunc;
		}
		if (plugIn.isBuiltInVar) {
			isBuiltInVar = plugIn.isBuiltInVar;
		}
		if (plugIn.operatorRegx) {
			operatorRegx = plugIn.operatorRegx;
		}
		doc = plugIn.doc;
	}

	for (let index = 0, len = code.length; index < len; index++) {

		let at = code.charAt(index),
			codeAt = code.charCodeAt(index);

		if (codeAt === 8203) continue;

		if (Mark.SPACE_REGX.test(at)) { // 标准空白
			output.push(word);
			components.doHtmlEscape(at, output);
			word = String.BLANK;
		} else if (hasPlugIn && judgeExe(at)) { // 每个语言的自定义插件
			index = plugInExe(code, index, len, output);
		} else if (judgeComment(at)) { // 注释
			output.push(word);
			index = doComment(code, index, len, at, output, doc);
			word = String.BLANK;
		} else if (at === Mark.DQUOTE) {
			output.push(word);
			// 双引号，一般来说双引号都都是字符串，所以这里直接写死
			// 以后要是遇到了 双引号不是字符串的，再做修改
			index = components.defaultDoChars(code, index, len, output, escaper, at, Span.STRING);
			word = String.BLANK;
		} else if (at === Mark.QUOTE) {
			output.push(word);
			// 单引号，默认判断为字符，具体实现由各语言自定义的 doChar 方法来实现
			// 即，如果将 doChar 自定义为 doChars ，那单引号也可以被当作字符串来处理
			index = doChar(code, index, len, output, escaper, at, charSpan);
			word = String.BLANK;
		} else {
			if (CharCode.ZERO <= codeAt && codeAt <= CharCode.NINE) { // 数字
				output.push(word);
				word = String.BLANK;
				index = doNumber(code, index, len, output);
			} else {
				if (Common.BRACEKT_REGX.test(at)) { // 合法的括号（不含尖括号）
					output.push(word + Span.BRACKET + at + Span.CLOSE);
					word = String.BLANK;
				} else if (at === Mark.LEFT_ANGLE) { // 左尖括号
					output.push(word);
					components.doHtmlEscape(at, output);
					word = String.BLANK;
				} else {
					word += at;
					let next = code.charCodeAt(index + 1);
					if (operatorRegx.test(word)) { // 类C语言的操作符
						output.push(word);
						word = String.BLANK;
					} else if (doKeyword(output, kw, word, next, charCaseMethod)) { // 关键字
						output.push(Span.KEYWORD + word + Span.CLOSE);
						word = String.BLANK;
					} else if (doBuiltIn(word, next, code.charAt(index + 1), output, isBuiltInFunc, isBuiltInVar)) { // 语言内置函数、变量等
						word = String.BLANK;
					}
				}
			}
		}
	}

	if (!String.isEmpty(word)) {
		output.push(word);
	}

	return output.join(String.BLANK);
}

function initLangObject(execute, plugIn, keywords) {

	execute = execute || commonExecute;

	return {
		getKeywords: function () {
			return keywords;
		},
		getPlugIn: function () {
			return plugIn;
		},
		execute: execute
	};
}

let pesudocode = (function () {
	let dftBuiltInFunc = ['eval', 'alert', 'print'];

	return initLangObject(commonExecute, {
		doComment: commonDoComment,
		isBuiltInFunc: function (word) {
			return dftBuiltInFunc.has(word);
		},
	}, ['abstract', 'assert',
			'boolean', 'break', 'byte',
			'case', 'catch', 'class', 'char', 'const', 'continue',
			'default', 'delete ', 'do', 'double',
			'else', 'eval', 'echo', 'enum', 'export', 'extends',
			'false', 'final', 'finally', 'float', 'for', 'foreach', 'function',
			'goto',
			'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface',
			'long',
			'new', 'null', 'namespace',
			'package', 'private', 'protected', 'public',
			'return',
			'short', 'static', 'string', 'struct', 'super', 'switch',
			'this', 'throw', 'throws', 'true', 'try',
			'var',
			'while',
			'void'
		]);
})();

exports = module.exports = {
	doRegExp: commonDoRegExp,
	doComment: commonDoComment,
	execute: commonExecute,
	initLangObject: initLangObject,
	getLang: (langName) => {
		return LANGUAGES[langName] || pesudocode;
	},
	addLang: function (langs, execute, plugIn, ...keywords) {

		if (typeIs(keywords[0], 'array')) {
			keywords = keywords[0];
		}
		let langObj = initLangObject(execute, plugIn, keywords);

		for (let lang of langs) {
			LANGUAGES[lang.name] = langObj;
			if (lang.rename) {
				langMap[lang.rename] = lang.name;
			}
		}
	},
	getLanguagesName: () => {
		let result = Object.keys(LANGUAGES).map(function (lang) {
			return langMap[lang] || lang;
		});
		return result.sort();
	}
};