const { Char, CharCode, XmlEntity } = JsConst;
const { Span, Common, CLike, JOIN } = require("./constants");

const IS_HEX_NUMBER_REGX = /^0x[a-f0-9]+$/i;
const IS_DECIMAL_REGX = /^[0-9]\.[0-9](d|f)*$/i;
const IS_INTEGER_REGX = /^[0-9](l)*/i;
const CAN_IN_NUMBER_REGX = /([0-9a-f]|l|\.|x|\-)/i;

function doHtmlEscape(at, output) {
	if (String.isEmpty(at) || at === Char.ZERO_WIDTH) return;

	switch (at) {
		case Char.Space.LF:
			append(output, JOIN);
			break;
		case Char.Angle.LEFT:
			append(output, XmlEntity.LEFT_ANGLE);
			break;
		case Char.Angle.RIGHT:
			append(output, XmlEntity.RIGHT_ANGLE);
			break;
		case Char.SHARP:
			append(output, XmlEntity.SHARP);
			break;
		case Char.AND:
			append(output, XmlEntity.AMP);
			break;
		case Char.DQUOTE:
			append(output, XmlEntity.QUOT);
			break;
		default:
			append(output, at);
	}
}

function canInNumber(at) {
	return CAN_IN_NUMBER_REGX.test(at);
}

function isNumber(str) {

	return IS_HEX_NUMBER_REGX.test(str) || // 16 进制数
		IS_DECIMAL_REGX.test(str) || // 小数
		IS_INTEGER_REGX.test(str); // 整数
}

function doNewLineJoin(output, startSpan) {
	append(output, Span.CLOSE);
	append(output, JOIN);
	if (startSpan) {
		append(output, startSpan);
	}
}

/**
 * 判断该字符是否可以作为一个词的组成部分
 * 词的范围包括：
 * 变量名、函数名、关键字
 */
function canInWord(at) {
	// [A-Z]
	return (CharCode.Upper.A <= at && at <= CharCode.Upper.Z) ||
		// [a-z]
		(CharCode.Lower.A <= at && at <= CharCode.Lower.Z) ||
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
 * @param code       处理的目标字符串
 * @param index      处理的起始位置
 * @param len        字符串长度
 * @param output     输出对象（数组）
 * @param escaper    转义字符
 * @param end        结束标识符
 * @param charSpan   字符 span 标签，用于区分字符和字符串
 */
function defaultDoChars(code, index, len, output, escaper, end, charSpan) {
	append(output, charSpan);
	let before = escaper;
	for (; index < len; index++) {
		let at = code.charAt(index);
		if (at === Char.Space.LF) {
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
	append(output, Span.CLOSE);
	return index;
}

function defaultDoCharCase(word, charCaseMethod) {
	let outWord = word;
	if (charCaseMethod) {
		switch (typeOf(charCaseMethod)) {
			case "string":
				outWord = word[charCaseMethod]();
				break;
			case "function": // TODO 这里为什么写 “,” 自己也忘了，但从上文的判断是 typeOf 来看，应该是写错了
							 // 感觉应该是 function ，先这么改了
				outWord = charCaseMethod(word);
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
 * @param kws            每种语言的关键字集
 * @param word           请求判断的语言
 * @param next           下一个字符
 * @param charCaseMethod 大小写标签，因为有些语言不区分大小写，而关键字大小写是固定的
 *                       所以这里加入这个函数对被请求的词进行大小写处理
 *                       这个函数可以是自定义函数，也可以是 JS 既存的字符串处理函数
 * 
 */
function defaultDoKeyword(kws, word, next, charCaseMethod) {
	return Array.has(kws, defaultDoCharCase(word, charCaseMethod)) && !canInWord(next);
}
/**
 * 处理内置函数
 * @param word            请求判断的内容
 * @param nextCode        下一个字符的编码
 * @param next            下一个字符
 * @param output          输出
 * @param isBuiltInFunc   判断是否是内置函数
 * @param isBuiltInVar    判断是否是内置变量 
 * @returns 
 */
function defaultDoBuiltIn(word, nextCode, next, output, isBuiltInFunc, isBuiltInVar) {

	if (canInWord(nextCode)) return false; // 紧接着的字符可以入词则返回

	let builtInFuncFlg = isBuiltInFunc(word, next),
		builtInVarFlg = isBuiltInVar(word, next);
	let result = (builtInFuncFlg || builtInVarFlg);

	if (result) {
		if (builtInFuncFlg) {
			append(output, Span.BUILTIN_FUNC + word + Span.CLOSE);
		}
		if (builtInVarFlg) {
			append(output, Span.BUILTIN_VAR + word + Span.CLOSE);
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
		append(output, at);
		return index;
	}
	let word = "";
	for (; index < len; index++) {
		at = code.charAt(index);
		if (at === "x" || at === "X") {
		}
		if (canInNumber(at)) {
			if (at === Char.HYPHEN && canInNumber(code.charAt(index - 1))) break;
			word += at;
		} else {
			break;
		}
	}

	if (isNumber(word)) {
		append(output, Span.NUMBER + word + Span.CLOSE);
	} else {
		append(output, word);
	}

	return --index;
}

function doLineComment4Like(code, index, len, at, output) {
	append(output, Span.COMMENT);
	for (; index < len; index++) {
		at = code.charAt(index);
		if (at === Char.Space.LF) {
			doNewLineJoin(output);
			break;
		} else {
			doHtmlEscape(at, output);
		}
	}

	return index;
}

function doBlockComment4CLike(code, index, len, output, hasDoc) {
	hasDoc = hasDoc && code.charAt(index + 2) === Char.ASTERISK;
	append(output, hasDoc ? Span.DOC : Span.COMMENT);
	for (; index < len; index++) {
		let at = code.charAt(index);
		if (at !== Char.ASTERISK || code.charAt(index + 1) !== Char.SLASH) {
			if (at === Char.Space.LF) {
				doNewLineJoin(output, hasDoc ? Span.DOC : Span.COMMENT);
			} else {
				doHtmlEscape(at, output);
			}
		} else {
			break;
		}
	}
	append(output, CLike.BLOCK_COMMENT_END);
	append(output, Span.CLOSE);
	// append(output, JOIN);
	return ++index;
}

function judgeComment4CLike(at) {
	return at === Char.SLASH;
}

function doComment4CLike(code, index, len, at, output, doc) {
	let next = (index < len - 1) ? code.charAt(index + 1) : String.BLNAK;
	if (judgeComment4CLike(next)) {
		index = doLineComment4Like(code, index, len, at, output);
	} else if (next === Char.ASTERISK) {
		index = doBlockComment4CLike(code, index, len, output, doc);
	}
	return index;
}


function defaultJudgePluginExe() {
	return false;
}

function append(output, str) {
	if (String.isEmpty(str)) return;

	output.push(str);
}

exports = module.exports = {
	append,
	doHtmlEscape,
	canInNumber,
	isNumber,
	doNewLineJoin,
	canInWord,
	isWord,
	defaultDoChars,
	defaultDoCharCase,
	defaultDoKeyword,
	defaultDoBuiltIn,
	defaultIsBuiltIn,
	defaultDoNumber,
	doLineComment4Like,
	doBlockComment4CLike,
	judgeComment4CLike,
	doComment4CLike,
	defaultJudgePluginExe
}