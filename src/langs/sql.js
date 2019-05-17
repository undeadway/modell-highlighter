
const { Span, Mark } = require("./../constants");
const components = require("./../components");
const common = require("./../common");


common.addLang([{ name: "SQL" }], null, {
	doComment: function (code, index, len, at, output) {
		let next = code.charAt(index + 1);
		if (at === Mark.SLASH && next === Mark.ASTERISK) {
			index = components.doBlockComment4CLike(code, index, len, output);
		} else if (at == Mark.HYPHEN && next === Mark.HYPHEN) {
			index = components.doLineComment4Like(code, index, len, at, output);
		} else {
			components.doHtmlEscape(at, output);
		}
		return index;
	},
	judgeComment: function (at) {
		return at === Mark.SLASH || at === Mark.HYPHEN;
	},
	charSpan: Span.STRING,
	doChar: function (code, index, len, output, escaper, end, span) {

		output.push(span + code.charAt(index++));

		for (; index < len; index++) {
			let at = code.charAt(index);

			if (at === Mark.NL_N) {
				components.doNewLineJoin(output, span);
			} else {
				components.doHtmlEscape(at, output);
				if (at === end) {
					let next = code.charAt(index + 1);
					if (next === end) { // 转义符号
						components.doHtmlEscape(next, output);
						index++;
					} else { // 字符串结束
						break;
					}
				}
			}
		}
		output.push(Span.CLOSE);
		components.doHtmlEscape(next, output);

		return index;
	},
	escaper: Mark.QUOTE,
	charCaseMethod: 'toUpperCase'
}, ["ABORT", "ACTION", "ADD", "AFTER", "ALL", "ALTER", "ANALYZE", "AND", "AS", "ASC", "ATTACH", "AUTOINCREMENT",
		"BEFORE", "BEGIN", "BETWEEN", "BY", "CASCADE", "CASE", "CAST", "CHECK", "COLLATE", "COLUMN", "COMMIT",
		"CONFLICT", "CONSTRAINT", "CREATE", "CROSS", "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP",
		"DATABASE", "DECLARE", "DEFAULT", "DEFERRABLE", "DEFERRED", "DELETE", "DESC", "DETACH", "DISTINCT", "DROP", "EACH",
		"ELSE", "END", "ESCAPE", "EXCEPT", "EXCLUSIVE", "EXISTS", "EXPLAIN", "FAIL", "FOR", "FOREIGN", "FROM",
		"FULL", "GLOB", "GROUP", "HAVING", "IF", "IGNORE", "IMMEDIATE", "IN", "INDEX", "INDEXED", "INITIALLY",
		"INNER", "INSERT", "INSTEAD", "INTEGER", "INTERSECT", "INTO", "IS", "ISNULL", "JOIN", "KEY", "LEFT",
		"LIKE", "LIMIT", "MATCH", "NATURAL", "NO", "NOT", "NOTNULL", "NULL", "OF", "OFFSET", "ON", "OR", "ORDER",
		"OUTER", "PLAN", "PRAGMA", "PRIMARY", "QUERY", "RAISE", "REFERENCES", "REGEXP", "REINDEX", "RELEASE",
		"RENAME", "REPLACE", "RESTRICT", "RIGHT", "ROLLBACK", "ROW", "SAVEPOINT", "SELECT", "SET", "TABLE", "TEMP",
		"TEMPORARY", "TEXT", "THEN", "TO", "TRANSACTION", "TRIGGER", "UNION", "UNIQUE", "UPDATE", "USING",
		"VACUUM", "VALUES", "VARCHAR", "VIEW", "VIRTUAL", "WHEN", "WHERE"
	]);