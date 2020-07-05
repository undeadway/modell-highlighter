/**
 * CSS
 */
const { Mark } = Coralian.constants;
const { Span } = require("./../constants");
const { doHtmlEscape, doBlockComment4CLike, doNewLineJoin, append } = require("./../components");
const { addLang } = require("./../common");

const CSS_ID_SPAN = '<span class="css_name css_id">',
	CSS_CLASS_SPAN = '<span class="css_name css_class">',
	CSS_AT_SPAN = '<span class="css_name css_at">',
	CSS_XMLTAG_SPAN = '<span class="css_name xmltag">',
	CSS_PESUDO_CLASS_SPAN = '<span class="css_name css_pesudo_class">',
	CSS_FILETYPE = "@CHARSET";

// 这个函数负责进入解析 CSS 名称部分
// 各种不同的名称逻辑交给 doCssCssNames 去实现
function doCssName(code, index, len, output) {
	for (; index < len; index++) {

		let at = code.charAt(index);

		if (at === Mark.TILDE || Mark.SPACE_REGX.test(at)) {
			doHtmlEscape(at, output);
			continue;
		}

		switch (at) {
			case Mark.POINT:
				append(output, CSS_CLASS_SPAN);
				break;
			case Mark.SHARP:
				append(output, CSS_ID_SPAN);
				break;
			case Mark.LEFT_BRACKET:
			case Mark.RIGHT_BRACKET:
				return index;
			default:
				append(output, CSS_XMLTAG_SPAN);
		}

		index = doCssCssNames(code, index, len, output, at);
	}
}

function doCssBody(code, index, len, output) {

	for (; index < len; index++) {
		let at = code.charAt(index);
		if (Mark.SPACE_REGX.test(at)) {
			doHtmlEscape(at, output);
		} else if (at === Mark.RIGHT_BRACKET) {
			append(output, at);
			return index;
		} else if (at === Mark.SLASH && Mark.ASTERISK === code.charAt(index + 1)) {
			index = doBlockComment4CLike(code, index, len, output, false);
		} else if (at !== Mark.LEFT_BRACKET) {
			// let charCode = code.charCodeAt(index);
			index = doCssAttr(code, index, len, output);
			if (index < len) {
				index = cssBody(code, index, len, output);
			} else {
				index = cssSpace(code, index, len, output);
			}
		} else {
			doHtmlEscape(at, output);
		}
	}
}

function doCssAt(code, index, len, output) {
	append(output, CSS_AT_SPAN);
	for (; index < len; index++) {
		let at = code.charAt(index);
		if (at === Mark.LEFT_BRACKET) {
			append(output, Span.CLOSE);
			append(output, Mark.LEFT_BRACKET);

			return index;
		} else {
			doHtmlEscape(at, output);
		}
	}
}

function doCssPesudoClass(code, index, len, output) {

	for (; index < len; index++) {
		let at = code.charAt(index);
		if (at === Mark.COMMA || Mark.SPACE_REGX.test(at)) {
			append(output, Span.CLOSE);
			doHtmlEscape(at, output);
			return index;
		} else if (at === Mark.LEFT_BRACKET) {
			append(output, Span.CLOSE);
			return --index;
		} else {
			doHtmlEscape(at, output);
		}
	}
}

// 这个函数是具体负责解析各种名称的
function doCssCssNames(code, index, len, output) {
	for (; index < len; index++) {
		let at = code.charAt(index);
		if (at === Mark.RIGHT_ANGLE) {
			append(output, Span.CLOSE);
			doHtmlEscape(at, output);
			if (code.charAt(index + 1) === Mark.COLON) {
				append(output, CSS_PESUDO_CLASS_SPAN);
				index = doCssPesudoClass(code, ++index, len, output);
			} else {
				return index;
			}
		} else if (at === Mark.COMMA || Mark.SPACE_REGX.test(at)) {
			append(output, Span.CLOSE);
			doHtmlEscape(at, output);
			return index;
		} else if (at === Mark.LEFT_BRACKET) {
			append(output, Span.CLOSE);
			return --index;
		} else {
			doHtmlEscape(at, output);
		}
	}
}

function cssBody(code, index, len, output) {

	index = cssSpace(code, index, len, output);

	append(output, Span.DATA_VAL);
	for (; index < len; index++) {
		let at = code.charAt(index);
		if (at === Mark.SEMICOLON) {
			append(output, Span.CLOSE);
			append(output, at);
			return index;
		} else if (at === Mark.RIGHT_BRACKET) {
			// 后括号判断为退出 CSS 身体部，身体部的所有逻辑到此结束
			append(output, Span.CLOSE);
			return --index;
		}
		if (at === Mark.NEW_LINE) {
			doNewLineJoin(output, Span.DATA_VAL);
		} else {
			doHtmlEscape(at, output);
		}
	}
}

function cssSpace(code, index, len, output) {

	for (; index < len; index++) {
		let at = code.charAt(index);
		if (at === Mark.SLASH && Mark.ASTERISK === code.charAt(index + 1)) {
			index = doBlockComment4CLike(code, index, len, output, false);
		} else if (at === Mark.COMMA || Mark.SPACE_REGX.test(at)) {
			doHtmlEscape(at, output);
		} else {
			return index;
		}
	}
}

function doCssAttr(code, index, len, output) {

	append(output, Span.DATA_KEY);
	for (; index < len; index++) {
		let at = code.charAt(index);
		if (at === Mark.COLON || at === Mark.RIGHT_BRACKET) {
			append(output, Span.CLOSE);
			append(output, at);
			return ++index;
		}
		if (at === Mark.NEW_LINE) {
			doNewLineJoin(output, Span.DATA_KEY);
		} else {
			doHtmlEscape(at, output);
		}
	}
}

function doCSS(code) {

	let len = code.length,
		index = 0,
		output = [];
	let at = code.charAt(index);
	// CSS 文档以 @charset 开头
	if (String.startsWith(String.trim(code).toUpperCase(), CSS_FILETYPE)) {
		for (; index < len; index++) {
			at = code.charAt(index);
			if (at === Mark.AT) {
				append(output, Span.FILETYPE);
			}
			append(output, at);
			if (at === Mark.SEMICOLON) {
				append(output, Span.CLOSE);
				index++;
				break;
			}
		}
	}

	for (; index < len; index++) {
		at = code.charAt(index);
		if (at === Mark.AT) {
			index = doCssAt(code, index, len, output);
		} else if (at === Mark.SLASH) {
			index = doBlockComment4CLike(code, index, len, output);
		} else if (at === Mark.COMMA || Mark.SPACE_REGX.test(at)) {
			doHtmlEscape(at, output);
		} else {
			index = doCssName(code, index, len, output);
			index = doCssBody(code, index, len, output);
		}
	}

	return output.join(String.BLANK);

}

addLang([{ name: "CSS" }], doCSS);