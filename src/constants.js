/**
 * ModellHighLighter 用到的所有常量
 */

exports = module.exports = {
	JOIN: "</li><li>",
	// 各种标签
	Span: {
		// 共通标签
		CLOSE: "</span>",
		COMMENT: "<span class=\"comment\">",
		STRING: "<span class=\"string\">",
		NUMBER: "<span class=\"number\">",
		FILETYPE: "<span class=\"filetype\">",
		// 常用标签
		CHAR: "<span class=\"character\">",
		KEYWORD: "<span class=\"keyword\">",
		REGEXP: "<span class=\"regexp\">",
		DOC: "<span class=\"doc\">",
		DESCRIPTION: "<span class=\"description\">",
		DEFINE: "<span class=\"define\">",
		// 内置的各种内容
		BUILTIN_FUNC: "<span class=\"builtin_func\">",
		BUILTIN_VAR: "<span class=\"builtin_var\">",
		// 各种符号
		BRACKET: "<span class=\"bracket\">",
		OPERATOR: "<span class=\"operator\">",
		XMLTAG: "<span class=\"xmltag\">",
		// 键值对标签（XML属性、CSS 等可用）
		DATA_KEY: "<span class=\"data_key\">",
		DATA_VAL: "<span class=\"data_val\">"
	},
	Common: {
		NUMBER_REGX: /^[0-9]/,
		BRACEKT_REGX: /(\{|\}|\[|\]|\(|\)|<|>)/, // 默认括号，使用 C 语言的括号（类 C 语言都可使用）
	},
	CLike: {
		LINE_COMMENT: "//",
		ESCAPER: "\\",
		//默认操作符（单字符，不计“->”这种多字符操作符），使用 C 语言的操作符（类 C 语言都可使用 ）
		OPERATOR_REGX: /(\:|\+|\-|\*|\/|\%|\&|\||\^|\!|\~|\?|:|,|;|\.)/,
		BLOCK_COMMENT_END: "*/"
	}
}