
const { Span, XmlEntity, Mark } = require("../constants");
const { doHtmlEscape, doNewLineJoin } = require("./../components");
const common = require("./../common");

const _doCSS = common.getLang("CSS"), _doJS = common.getLang("JAVASCRIPT");

// HTML 专用
const COMMENT_TAG_REGX = /<(script|style)([^>]*)>([\s\t\n]*)<\!\-\-([\s\S\n]*?)\-\->([\s\t\n]*)<\/(script|style)>/i,
	SCRIPT_STYLE_TAG_REGX = /<(script|style)([^>]*)>([\s\S\n]*?)<\/(script|style)>/i,
	XML_DOCTYPE_REGX = /<\!(DOCTYPE)([\s\S\n]*?)>/i;

// XML 和 HTML 通用
const XML_TAG_REGX = /<([^>]*?)>/i,
	XML_END_TAG_REGX = /<\/([^>]*?)>/i,
	XML_PROCESSING_REGX = /<\?([\s\S\n]*)\?>/,
	XML_COMMENT_REGX = /\<\!\-\-([\s\S\n]*?)\-\-\>/i,
	// XML_ATTR_REGX = /(.+)\=(.+)/,
	XML_CDATA_REGX = /<\!\[CDATA\[([\s\S\n]*)\]\]>/;

const XML_REPLACE_PART = "{{XML_Replace_Part:",
	HTML_REPLACE_PART = "{{HTML_Replace_Part:",
	// XML_ATTR_REPLACE_PART = "XML_Attr_Replace_Part:",
	REPLACE_END = ":}}";

	// XML 标签转义之后的实体
const XML_COMMENT_START_ENTITY = "&lt!--",
	XML_COMMENT_END_ENTITY = "--&gt;",
	XML_CDATA_START = "&lt![CDATA[",
	XML_CDATA_END = "]]&gt;",
	XML_PROCESSING_START = "&lt?",
	XML_PROCESSING_END = "?&gt;",
	// XML 注释
	XML_COMMENT_START = "<!--",
	XML_COMMENT_END = "-->";

const XML_EMPTY_ATTR_REGX = new RegExp(Span.DATA_KEY + Span.CLOSE, "g"),
	XML_EMPTY_VAL_REGX = new RegExp(Span.DATA_VAL + Span.CLOSE, "g");

const XML_CDATA_SPAN = '<span class="xml_cdata">',
	XML_DOCTYPE_SPAN = '<span class="xml_doctype">';

function doXmlCData(code) {

	let output = [];

	output.push(XML_CDATA_SPAN);
	output.push(XML_CDATA_START);
	output.push(Span.CLOSE);

	for (let i = 0, len = code.length; i < len; i++) {
		doHtmlEscape(code.charAt(i), output);
	}

	output.push(XML_CDATA_SPAN);
	output.push(XML_CDATA_END);
	output.push(Span.CLOSE);

	return output.join(String.BLANK);
}

function doXmlComment(code) {
	let output = [];
	output.push(Span.COMMENT);
	output.push(XML_COMMENT_START_ENTITY);

	for (let i = 0, len = code.length; i < len; i++) {
		let at = code.charAt(i);
		if (at === Mark.NL_N) {
			doNewLineJoin(output, Span.COMMENT);
		} else {
			doHtmlEscape(at, output);
		}
	}

	output.push(XML_COMMENT_END_ENTITY);
	output.push(Span.CLOSE);

	return output.join(String.BLANK);
}

function doXmlAttibute(input) {

	let output = [];

	let isInName = true, isInVal = false;

	for (let i = 0, len = input.length; i < len; i++) {
		let at = input.charAt(i);
		if (SPACE_REGX.test(at) && isInName) {
			if (i > 0) {
				output.push(Span.CLOSE);
			}
			doHtmlEscape(at, output);
			if (i < len) {
				output.push(Span.DATA_KEY);
			}
			isInVal = true;
			isInName = false;
		} else if ((at === Mark.EQUALS) && isInVal) {
			output.push(Span.CLOSE);
			doHtmlEscape(at, output);
			output.push(Span.DATA_VAL);
			isInName = true;
			isInVal = false;
		} else {
			if (at === Mark.DQUOTE) {
				isInName = !isInName;
				isInVal = !isInVal;
			}
			doHtmlEscape(at, output);
		}
	}

	output.push(Span.CLOSE);

	output = output.join(String.BLANK);
	output = output.replace(XML_EMPTY_ATTR_REGX, String.BLANK);
	output = output.replace(XML_EMPTY_VAL_REGX, String.BLANK);

	return output;
}

// 通用于标签属性（包括普通 标签和声明标签）
function doXmlCommons(commonSpan, startVal, endVal, input) {

	let tmp = input.split(Mark.SPACE_REGX);
	/*
	 * <xxx .... /> => [xxx, .., .., .., /] => true
	 * <xxx ..../> => [xxx, .., .., ../] => true
	 * <xxx ....> => [xxx, .., .., ..] => false
	 * <xxx /> => [xxx, /] => true
	 * <xxx/> => [xxx/] => false
	 */
	let withSlash = String.endsWith(input, Mark.SLASH) && !String.endsWith(tmp[0], Mark.SLASH);

	let output = [];
	output.push(commonSpan);
	output.push(startVal);
	output.push(tmp[0]);
	output.push(Span.CLOSE);

	if (tmp.length > 1) {
		let end = input.length;
		if (withSlash) end -= 1;
		input = input.slice(tmp[0].length, end);
		output.push(doXmlAttibute(input));
	}

	output.push(commonSpan);
	if (withSlash) {
		output.push(Mark.SLASH);
	}
	output.push(endVal);
	output.push(Span.CLOSE);

	return output.join(String.BLANK);
}

function doScriptOrStyle(tag, content) {

	let output = [];
	let trimed = String.trim(content);
	let starts = 0,
		ends = content.length;

	if (String.endsWith(trimed, XML_COMMENT_END)) {
		ends = content.lastIndexOf(XML_COMMENT_END);
	}

	if (String.startsWith(trimed, XML_COMMENT_START)) {
		starts = content.indexOf(XML_COMMENT_START);

		let spaces = content.slice(0, starts);

		for (let i = 0, len = spaces.length; i < len; i++) {
			doHtmlEscape(spaces.charAt(i), output);
		}

		output.push(Span.COMMENT);
		output.push(XML_COMMENT_START_ENTITY);
		output.push(Span.CLOSE);

		starts += 4;
	}

	let tmp = content.slice(starts, ends);

	switch (tag) {
		case 'SCRIPT':
			output.push(_doJS.execute(tmp));
			break;
		case 'STYLE':
			output.push(_doCSS.execute(tmp));
			break;
		default:
			break;
	}

	if (String.endsWith(trimed, XML_COMMENT_END)) {
		let spaces = content.slice(ends + 3);
		output.push(Span.COMMENT);
		output.push(XML_COMMENT_END_ENTITY);
		output.push(Span.CLOSE);
		for (let i = 0, len = spaces.length; i < len; i++) {
			doHtmlEscape(spaces.charAt(i), output);
		}
	}

	return output.join(String.BLANK);
}

function doXml(input) {

	let xmlReplaceList = [];

	// 处理 <!DOCTYPE ...>
	if (XML_DOCTYPE_REGX.test(input)) {
		input = input.replace(XML_DOCTYPE_REGX, XML_REPLACE_PART + xmlReplaceList.length + REPLACE_END);
		let output = XML_DOCTYPE_SPAN + XmlEntity.LEFT_ANGLE + EXCALMATORY + RegExp.$1 + RegExp.$2 +
			XmlEntity.RIGHT_ANGLE + Span.CLOSE;
		xmlReplaceList.push(output);
	}

	// 处理 <!-- ... -->
	while (XML_COMMENT_REGX.test(input)) {
		let output = doXmlComment(RegExp.$1);

		input = input.replace(XML_COMMENT_REGX, XML_REPLACE_PART + xmlReplaceList.length + REPLACE_END);
		xmlReplaceList.push(output);
	}

	// 处理 <?xxx ... ?>
	while (XML_PROCESSING_REGX.test(input)) {
		let output = doXmlCommons(XMLTAG_SPAN, XML_PROCESSING_START, XML_PROCESSING_END, RegExp.$1);

		input = input.replace(XML_PROCESSING_REGX, XML_REPLACE_PART + xmlReplaceList.length + REPLACE_END);
		xmlReplaceList.push(output);
	}

	// 处理 CDATA
	while (XML_CDATA_REGX.test(input)) {
		let output = doXmlCData(RegExp.$1);

		input = input.replace(XML_CDATA_REGX, XML_REPLACE_PART + xmlReplaceList.length + REPLACE_END);
		xmlReplaceList.push(output);
	}

	// 处理</xxx>
	while (XML_END_TAG_REGX.test(input)) {
		let output = Span.XMLTAG + XmlEntity.LEFT_ANGLE + Mark.SLASH + RegExp.$1 + XmlEntity.RIGHT_ANGLE + Span.CLOSE;

		input = input.replace(XML_END_TAG_REGX, XML_REPLACE_PART + xmlReplaceList.length + REPLACE_END);
		xmlReplaceList.push(output);
	}

	// 处理 <xxx ... > / <xxx ... />
	while (XML_TAG_REGX.test(input)) {
		let output = doXmlCommons(XMLTAG_SPAN, XmlEntity.LEFT_ANGLE, XmlEntity.RIGHT_ANGLE, RegExp.$1);

		input = input.replace(XML_TAG_REGX, XML_REPLACE_PART + xmlReplaceList.length + REPLACE_END);
		xmlReplaceList.push(output);
	}

	let output = [];
	for (let i = 0, len = input.length; i < len; i++) {
		doHtmlEscape(input.charAt(i), output);
	}

	input = output.join(String.BLANK);

	// 回替
	Array.forEach(xmlReplaceList, function (i, e) {
		input = input.replace(XML_REPLACE_PART + i + REPLACE_END, e);
	});

	return input;
}

common.addLang([{ name: "XML" }], doXml);

function doHTML(input) {

	let htmlReplaceList = [];

	// 处理 <script ...><!-- ... --></script> / <style ...><!-- ... --></style>
	while (COMMENT_TAG_REGX.test(input)) {

		let tag = RegExp.$1.toUpperCase();
		let beforeTag = RegExp.$1 + RegExp.$2, // 前标签 ...
			beforeSpace = RegExp.$3; // > 和 <!-- 之间的标准空白
		let content = RegExp.$4; // 正文
		let afterSpace = RegExp.$5, // --> 和 < 之间的标准空白
			afterTag = RegExp.$6; // 后标签

		let before = [],
			after = [];
		for (let i = 0, len = beforeSpace.length; i < len; i++) {
			doHtmlEscape(beforeSpace.charAt(i), before);
		}
		for (let i = 0, len = afterSpace.length; i < len; i++) {
			doHtmlEscape(afterSpace.charAt(i), after);
		}

		let output = doXmlCommons(XMLTAG_SPAN, XmlEntity.LEFT_ANGLE, XmlEntity.RIGHT_ANGLE, beforeTag) +
			before.join(String.BLANK) +
			Span.COMMENT + XML_COMMENT_START_ENTITY + Span.CLOSE +
			doScriptOrStyle(tag, content) +
			Span.COMMENT + XML_COMMENT_END_ENTITY + Span.CLOSE +
			after.join(String.BLANK) +
			doXmlCommons(Span.XMLTAG, XmlEntity.LEFT_ANGLE + Mark.SLASH, XmlEntity.RIGHT_ANGLE, afterTag);

		input = input.replace(COMMENT_TAG_REGX, HTML_REPLACE_PART + htmlReplaceList.length + REPLACE_END);
		htmlReplaceList.push(output);
	}

	// 因为存在 <!--<script ...>...</script>-->这种模式，所以先处理注释
	while (XML_COMMENT_REGX.test(input)) {
		let output = doXmlComment(RegExp.$1);

		input = input.replace(XML_COMMENT_REGX, HTML_REPLACE_PART + htmlReplaceList.length + REPLACE_END);
		htmlReplaceList.push(output);
	}

	// 处理 <script ...> ... </script> / <style ...> ... </style>
	while (SCRIPT_STYLE_TAG_REGX.test(input)) {

		let tag = RegExp.$1.toUpperCase();
		let before = RegExp.$1 + RegExp.$2; // 前标签
		let content = RegExp.$3; // 正文
		let after = RegExp.$4; // 后标签

		let output = doXmlCommons(XMLTAG_SPAN, XmlEntity.LEFT_ANGLE, XmlEntity.RIGHT_ANGLE, before) +
			doScriptOrStyle(tag, content) +
			doXmlCommons(XMLTAG_SPAN, XmlEntity.LEFT_ANGLE + Mark.SLASH, XmlEntity.RIGHT_ANGLE, after);

		input = input.replace(SCRIPT_STYLE_TAG_REGX, HTML_REPLACE_PART + htmlReplaceList.length + REPLACE_END);
		htmlReplaceList.push(output);
	}

	// 因为注释和XML一致，HTML部分则不处理 <!-- ... -->
	// 剩下的全当 XML 进行处理
	input = doXml(input);

	// 回替
	Array.forEach(htmlReplaceList, function (i, e) {
		input = input.replace(HTML_REPLACE_PART + i + REPLACE_END, e);
	});

	return input;

}

common.addLang([{ name: "HTML" }], doHTML);