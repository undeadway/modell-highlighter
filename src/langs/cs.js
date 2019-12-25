
const { Span, Mark, CLike } = require("./../constants");
const { addLang } = require("./../common");
const { append } = require("./../components");

const dftBuiltInVar = ["System", "IO", "Windows", "Forms", "List"];
const JUGDE_PLUGIN_KW = [Mark.LEFT_SQUARE_BRACKET, Mark.SHARP];

function doDescription(code, index, len, output) {

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
			 * 其他 Description 的形式未总结，或者只要是空白，就可以写 
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
						 * 因为存在 “// aaa // bbb” 这种形式的注释
						 * 所以不能直接判断第一个遇到的 // 之前是否有非空白，而只能以换行符为准
						 */
						if (at2 === Mark.NEW_LINE) { // 遇到换行符之后取整段字符，看是否以 // 开头
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

	append(output, Span.BRACKET + Mark.LEFT_SQUARE_BRACKET + Span.CLOSE);
	let word = String.BLANK;
	for (; index < len; index++) {
		let at = code.charAt(index);
		if (at === Mark.RIGHT_SQUARE_BRACKET || at === Mark.LEFT_PARENTHE || Mark.SPACE_REGX.test(at) || at === Mark.POINT) break;
		word += at;
	}

	append(output, Span.DESCRIPTION + word + Span.CLOSE);

	return --index;
}

function doRegion(code, index, len, output) {

	append(output, Span.DEFINE);

	let word = "";

	for (index; index < len; index++) {
		let at = code.charAt(index);
		if (at === Mark.NEW_LINE) {
			break;
		}

		word += at;
	}

	append(output, word);
	append(output, Span.CLOSE);

	return --index;
}

addLang([{ name: "C#" }], null, {
	judgeExe: function (at) {
		// return at === Mark.LEFT_SQUARE_BRACKET;
		return Array.has(JUGDE_PLUGIN_KW, at);
	},
	isBuiltInVar: function (word) {
		return Array.has(dftBuiltInVar, word);
	},
	execute: function (code, index, len, output) {
		let at = code.charAt(index);

		switch (at) {
			case Mark.LEFT_SQUARE_BRACKET:
				return doDescription(code, index, len, output);
			case Mark.SHARP:
				return doRegion(code, index, len, output);
			default:
				return index;
		}
	}
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