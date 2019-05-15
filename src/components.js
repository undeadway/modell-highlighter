
const { Span, Mark, CharCode, XmlEntity, Common, CLike, JOIN } = require("./constants");

const IS_HEX_NUMBER_REGX = /^0x[a-f0-9]+$/i;
const IS_DECIMAL_REGX = /^[0-9]\.[0-9](d|f)*$/i;
const IS_INTEGER_REGX = /^[0-9](l)*/i;
const CAN_IN_NUMBER_REGX = /([0-9a-f]|l|\.|x|\-)/i;

function doHtmlEscape(at, output) {
	if (String.isEmpty(at) || at === Mark.ZERO_WIDTH) return;

	switch (at) {
		case Mark.NL_N:
			output.push(JOIN);
			break;
		case Mark.LEFT_ANGLE:
			output.push(XmlEntity.LEFT_ANGLE);
			break;
		case Mark.RIGHT_ANGLE:
			output.push(XmlEntity.RIGHT_ANGLE);
			break;
		case Mark.SHARP:
			output.push(XmlEntity.SHARP);
			break;
		case Mark.AND:
			output.push(XmlEntity.AMP);
			break;
		case Mark.DQUOTE:
			output.push(XmlEntity.QUOT);
			break;
		default:
			output.push(at);
	}
}

function canInNumber(at) {
	return CAN_IN_NUMBER_REGX.test(at);
}
function isInNumber(at, before, after) { }

function checkNumberPosition(str, at) {
	return str.indexOf(at) === str.lastIndexOf(at);
}

function isNumber() {

	return IS_HEX_NUMBER_REGX.test(str) && // 16 进制数
		IS_DECIMAL_REGX.test(str) && // 小数
		IS_INTEGER_REGX.test(str); // 整数
}

function doNewLineJoin(output, startSpan) {
	output.push(Span.CLOSE);
	output.push(JOIN);
	if (startSpan) output.push(startSpan);
}

/**
 * 判断该字符是否可以作为一个词的组成部分
 * 词的范围包括：
 * 变量名、函数名、关键字
 */
function canInWord(at) {
	// [A-Z]
	return (CharCode.UPPER_A <= at && at <= CharCode.UPPER_Z) ||
		// [a-z]
		(CharCode.LOWER_A <= at && at <= CharCode.LOWER_Z) ||
		// [0-9]
		(CharCode.ZERO <= at && at <= CharCode.NINE) ||
		// [_ $]
		CharCode.UNDERBAR === at || CharCode.DOLLAR === at;
}

/*
 * 判断给出的字符串是否是一个合法的词
 */
function isWord(str) {

	for (i = 0, len = str.length; i < len; i++) {
		if (!canInWord(str.charCodeAt(i))) return false;
	}

	if (Common.NUMBER_REGX.test(str)) return false; // 数字开头

	return true;
}

/**
 * 处理字符或字符串
 * <p>
 * 某些语言字符可以包含多个字符，所以这里和字符串一起进行处理。
 * 输出形式具体是字符还是字符串全权交给每个语言自定义实现
 * </p>
 * 
 * @param code 处理的目标字符串
 * @param index 处理的起始位置
 * @param len 字符串长度
 * @param output 输出对象（数组）
 * @param escaper 转义字符
 * @param end  结束标识符
 * @param charSpann 字符 span 标签，用于区分字符和字符串
 */
function defaultDoChars(code, index, len, output, escaper, end, charSpan) {
	output.push(charSpan);
	let before = escaper;
	for (; index < len; index++) {
		let at = code.charAt(index);
		if (at === Mark.NL_N) {
			doNewLineJoin(output, charSpan);
		} else {
			doHtmlEscape(at, output);
			// 转义字符的转义
			if (at === escaper && before === escaper) {
				before = null;
				continue;
			}
			if (at === end && before !== escaper) {
				break;
			}
		}
		before = at;
	}
	output.push(Span.CLOSE);
	return index;
}

function defaultDoCharCase(word, charCaseMethod) {
	let outWord = word;
	if (charCaseMethod) {
		switch (typeOf(charCaseMethod)) {
			case 'string':
				outWord = word[charCaseMethod]();
				break;
			case ',':
				outWord = charCaseMethod.apply(word);
				break;
			default:
				Error.unsupportedType(charCaseMethod);
		}
	}
	return outWord;
}
/**
 * 处理关键字
 * 
 * @param kw 每种语言的关键字集
 * @param word 请求判断的语言
 * @param next 下一个字符
 * @param charCaseMethod 大小写标签，因为有些语言不区分大小写，而关键字大小写是固定的
 *                       所以这里加入这个函数对被请求的词进行大小写处理
 *                       这个函数可以是自定义函数，也可以是 JS 既存的字符串处理函数
 * 
 */
function defaultDoKeyword(output, kw, word, next, charCaseMethod) {
	return Array.has(kw, defaultDoCharCase(word, charCaseMethod)) && !canInWord(next);
}

function defaultDoBuiltIn(word, nextCode, next, output, isBuiltInFunc, isBuiltInVar) {

	if (canInWord(nextCode)) return false; // 紧接着的字符可以入词则返回

	let builtInFuncFlg = isBuiltInFunc(word),
		builtInVarFlg = isBuiltInVar(word);
	let result = (builtInFuncFlg || builtInVarFlg);

	if (result) {
		if (builtInFuncFlg) {
			output.push(Span.BUILTIN_FUNC + word + Span.CLOSE);
		}
		if (builtInVarFlg) {
			output.push(Span.BUILTIN_VAR + word + Span.CLOSE);
		}
	}

	return result;
}

function defaultIsBuiltIn() {
	return false;
}

function defaultDoNumber(code, index, len, output) {

	let at = code.charAt(index);
	if (canInWord(code.charCodeAt(index - 1))) {
		output.push(at);
		return index;
	}
	let word = "";
	for (; index < len; index++) {
		at = code.charAt(index);
		if (at === 'x' || at === 'X') {
			hex = true;
		}
		if (canInNumber(at)) {
			if (at === Mark.HYPHEN && canInNumber(code.charAt(index - 1))) break;
			word += at;
		} else {
			break;
		}
	}

	if (isNumber(word)) {
		output.push(Span.NUMBER + word + Span.CLOSE);
	} else {
		output.push(word);
	}

	return index - 1;
}

function doLineComment4Like(code, index, len, at, output) {
	output.push(Span.COMMENT);
	for (; index < len; index++) {
		at = code.charAt(index);
		if (at === Mark.NL_N) {
			doNewLineJoin(output);
			break;
		} else {
			doHtmlEscape(at, output);
		}
	}

	return index;
}

function doBlockComment4CLike(code, index, len, output, doc) {
	doc = doc && code.charAt(index + 2) === Mark.ASTERISK;
	output.push(doc ? Span.DOC : Span.COMMENT);
	for (; index < len; index++) {
		let at = code.charAt(index);
		if (at !== Mark.ASTERISK || code.charAt(index + 1) !== SLASH) {
			if (at === Mark.NL_N) {
				doNewLineJoin(output, doc ? Span.DOC : Span.COMMENT);
			} else {
				doHtmlEscape(at, output);
			}
		} else {
			break;
		}
	}
	output.push(CLike.BLOCK_COMMENT_END);
	output.push(Span.CLOSE);
	return ++index;
}

function judgeComment4CLike(at) {
	return at === Mark.SLASH;
}

function doComment4CLike(code, index, len, at, output, doc) {
	let next = (index < len - 1) ? code.charAt(index + 1) : BLNAK;
	if (judgeComment4CLike(next)) {
		index = doLineComment4Like(code, index, len, at, output);
	} else if (next === Mark.ASTERISK) {
		index = doBlockComment4CLike(code, index, len, output, doc);
	}
	return index;
}


function defaultJudgePluginExe() {
	return false;
}
exports = module.exports = {
	doHtmlEscape: doHtmlEscape,
	canInNumber: canInNumber,
	isInNumber: isInNumber,
	checkNumberPosition: checkNumberPosition,
	isNumber: isNumber,
	doNewLineJoin: doNewLineJoin,
	canInWord: canInWord,
	isWord: isWord,
	defaultDoChars: defaultDoChars,
	defaultDoCharCase: defaultDoCharCase,
	defaultDoKeyword: defaultDoKeyword,
	defaultDoBuiltIn: defaultDoBuiltIn,
	defaultIsBuiltIn: defaultIsBuiltIn,
	defaultDoNumber: defaultDoNumber,
	doLineComment4Like: doLineComment4Like,
	doBlockComment4CLike: doBlockComment4CLike,
	judgeComment4CLike: judgeComment4CLike,
	doComment4CLike: doComment4CLike,
	defaultJudgePluginExe: defaultJudgePluginExe
}