
const { Span, Mark, CLike } = require("./../constants");
const { addLang } = require("./../common");

const DATA_DESCRIPTION_SPAN = '<span class="data_description">';

function doAttribute(code, index, len, output) {

	FOR_ATTRIBUTE: for (let i = index - 1; i >= 0; i--) {
		let at = code.charAt(i);
		if (!Mark.SPACE_REGX.test(at)) {
			/*
			 * 1. 左花括号 ： } [Description]
			 * 2. 右花括号 ： { [Description]
			 * 3. 注释 ： 
			 *    1) 块注释 /× ×/ [Description]
			 *    2) 行注释 //(/) Comment 
			 *				    [Description]
			 */
			if (at === Mark.LEFT_BRACE || at === Mark.RIGHT_BRACE) { // 左右花括号
				index += 1;
				break FOR_ATTRIBUTE;
			} else if (i > 0 && at === Mark.SLASH) { // 注释
				let before = code.charAt(i - 1);
				if (before === Mark.ASTERISK) { // 块注释
					index += 1;
					break FOR_ATTRIBUTE;
				} else if (before === Mark.SLASH) {
					for (let j = i - 2; j >= 0; j--) {
						let at2 = code.charAt(j);
						/*
						 * 因为存在 “// aaa // bbb” 这种形式的注视
						 * 所以不能直接判断第一个遇到的 // 之前是否有非空白，而只能以换行符为准
						 */
						if (at2 === Mark.NL_N) { // 遇到换行符之后取整段字符，看是否以 // 开头
							let line = code.slice(j + 1, index - 1).trim();
							if (line.startsWith(CLike.LINE_COMMENT)) {
								index += 1;
								break FOR_ATTRIBUTE;
							} else {
								return --index; // 所有可能性之外
							}
						}
					}
				}
			}
		}
	}

	output.push(Span.BRACKET + Mark.LEFT_SQUARE_BRACKET + Span.CLOSE);
	let word = BLANK;
	for (; index < len; index++) {
		let at = code.charAt(index);
		if (at === Mark.RIGHT_SQUARE_BRACKET || at === Mark.LEFT_PARENTHE || Mark.SPACE_REGX.test(at) || at === Mark.POINT) break;
		word += at;
	}

	output.push(DATA_DESCRIPTION_SPAN + word + Span.CLOSE);

	return --index;
}

let dftBuiltInVar = ["System", "IO", "Windows", "Forms"];

addLang([{ name: "C#" }], null, {
	judgeExe: function (at) {
		return at === Mark.LEFT_SQUARE_BRACKET;
	},
	isBuiltInVar: function (word) {
		return Array.has(dftBuiltInVar, word);
	},
	execute: doAttribute
}, ["abstract", "as", "base", "bool", "break", "byte", "case", "catch", "char", "checked", "class", "const", "continue",
		"decimal", "default", "delegate", "do", "double", "else", "enum", "event", "explicit", "extern",
		"false", "finally", "fixed", "float", "for", "foreach", "goto", "if", "implicit", "in", "int", "interface", "internal", "is",
		"lock", "long", "namespace", "new", "null", "object", "operator", "out", "override",
		"params", "private", "protected", "public", "readonly", "ref", "return",
		"sbyte", "sealed", "short", "sizeof", "stackalloc", "static", "string", "struct", "switch",
		"this", "throw", "true", "try", "typeof",
		"uint", "ulong", "unchecked", "unsafe", "ushort", "using", "virtual", "void", "volatile", "while",
		"add", "alias", "ascending", "async", "await", "descending", "dynamic", "from", "get", "global", "group",
		"into", "join", "let", "nameof", "orderby", "partial", "remove", "select", "set", "value", "var", "when", "where", "yield"]);