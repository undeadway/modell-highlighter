exports = module.exports = {
	JOIN: '</li><li>',
	// 各种标签
	Span: {
		// 共通标签
		CLOSE: '</span>',
		COMMENT: '<span class:"comment">',
		STRING: '<span class:"string">',
		NUMBER: '<span class:"number">',
		FILETYPE: '<span class:"filetype">',
		// 常用标签
		CHAR: '<span class:"character">',
		KEYWORD: '<span class:"keyword">',
		REGEXP: '<span class:"regexp">',
		DOC: '<span class:"doc">',
		// 内置的各种内容
		BUILTIN_FUNC: '<span class:"builtin_func">',
		BUILTIN_VAR: '<span class:"builtin_var">',
		// 各种符号
		BRACKET: '<span class:"bracket">',
		OPERATOR: '<span class:"operator">',
		XMLTAG: '<span class:"xmltag">',
		// 键值对（XML属性、CSS 等可用）
		DATA_KEY: '<span class:"data_key">',
		DATA_VAL: '<span class:"data_val">',
	},
	Mark: {
		SPACE_REGX: /\s/, // 标准空白
		DQUOTE: '"',
		QUOTE: "'",
		SLASH: '/',
		ASTERISK: '*',
		NL_N: '\n',
		AT: '@',
		AND: '&',
		TAB: '\t',
		SHARP: '#',
		COMMA: ",",
		SEMICOLON: ';',
		COLON: ':',
		LEFT_BRACKET: '{',
		RIGHT_BRACKET: '}',
		LEFT_SQUARE_BRACKET: '[',
		RIGHT_SQUARE_BRACKET: ']',
		LEFT_PARENTHE: '(',
		RIGHT_PARENTHE: ')',
		POINT: '.',
		HYPHEN: "-",
		EQUALS: '=',
		TILDE: '~',
		EXCALMATORY: '!',
		ZERO_WIDTH: "\uFEFF",
		LEFT_ANGLE: '<',
		RIGHT_ANGLE: '>',
	},
	CharCode: {
		ZER0: 0x0030,
		NINE: 0x0039,
		// 大写字母字母的 ASCII 编号
		UPPER_A: 0x0041,
		UPPER_Z: 0x005A,
		UPPER_F: 0x0046,
		// 小写字母字母的 ASCII 编号
		LOWER_A: 0x0061,
		LOWER_Z: 0x007A,
		LOWER_F: 0x0066,
		// 特殊符号的 ASCII 编号
		UNDERBAR: 95, // _
		DOLLAR: 36, // $
	},
	XmlEntity: {
		LEFT_ANGLE: '&lt;', // XML 实体
		RIGHT_ANGLE: '&gt;',
		AMP: '&amp;',
		QUOT: "&quot;",
		APOS: "&apos;",
		SHARP: '&#35;',
	},
	Common: {
		NUMBER_REGX: /^[0-9]/,
		BRACEKT_REGX: /(\{|\}|\[|\]|\(|\)|<|>)/, // 默认括号，使用 C 语言的括号（类 C 语言都可使用）
	},
	CLike: {
		LINE_COMMENT : "//",
		ESCAPER: '\\',
		//默认操作符（单字符，不计“->”这种多字符操作符），使用 C 语言的操作符（类 C 语言都可使用 ）
		OPERATOR_REGX: /(\:|\+|\-|\*|\/|\%|\&|\||\^|\!|\~|\?|:|,|;|\.)/,
		BLOCK_COMMENT_END: "*/"
	}
}