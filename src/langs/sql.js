/**
 * SQL
 */
const { Char } = JsConst;
const { Span } = require("./../constants");
const { doBlockComment4CLike, doLineComment4CLike, doHtmlEscape, doNewLineJoin, append } = require("./../components");
const common = require("./../common");


common.addLang([{ name: "SQL" }], null, {
	doComment: function (code, index, len, at, output) {
		let next = code.charAt(index + 1);
		if (at === Char.SLASH && next === Char.ASTERISK) {
			index = doBlockComment4CLike(code, index, len, output);
		} else if (at == Char.HYPHEN && next === Char.HYPHEN) {
			index = doLineComment4CLike(code, index, len, at, output);
		} else {
			doHtmlEscape(at, output);
		}
		return index;
	},
	judgeComment: function (at) {
		return at === Char.SLASH || at === Char.HYPHEN;
	},
	charSpan: Span.STRING,
	doChar: function (code, index, len, output, escaper, end, span) {

		append(output, span + code.charAt(index++));
		let next = code.charAt(index + 1);

		for (; index < len; index++) {
			let at = code.charAt(index);

			if (at === Char.Space.LF) {
				doNewLineJoin(output, span);
			} else {
				doHtmlEscape(at, output);
				if (at === end) {
					next = code.charAt(index + 1);
					if (next === end) { // 转义符号
						doHtmlEscape(next, output);
						index++;
					} else { // 字符串结束
						break;
					}
				}
			}
		}
		append(output, Span.CLOSE);
		doHtmlEscape(next, output);

		return index;
	},
	escaper: Char.QUOTE,
	charCaseMethod: "toUpperCase"
}, [
"ABS","ALL","ALLOCATE","ALTER","AND","ANY","ARE","ARRAY","ARRAY_AGG","ARRAY_MAX_CARDINALITY","AS","ASENSITIVE","ASYMMETRIC","AT","ATOMIC","ATTRIBUTES","AUTHORIZATION","AVG","BEGIN","BEGIN_FRAME","BEGIN_PARTITION","BETWEEN","BIGINT","BINARY","BLOB","BOOLEAN","BOTH","BY","CALL","CALLED","CARDINALITY","CASCADED","CASE","CAST","CEIL","CEILING","CHAR","CHARACTER","CHARACTER_LENGTH","CHAR_LENGTH","CHECK","CLOB","CLOSE","COALESCE","COLLATE","COLLECT","COLUMN","COMMIT","CONDITION","CONNECT","CONSTRAINT","CONTAINS","CONVERT","CORR","CORRESPONDING","COUNT","COVAR_POP","COVAR_SAMP","CREATE","CROSS","CUBE","CUME_DIST","CURRENT","CURRENT_CATALOG","CURRENT_DATE","CURRENT_DEFAULT_TRANSFORM_GROUP","CURRENT_PATH","CURRENT_ROLE","CURRENT_ROW","CURRENT_SCHEMA","CURRENT_TIME","CURRENT_TIMESTAMP","CURRENT_TRANSFORM_GROUP_FOR_TYPE","CURRENT_USER","CURSOR","CYCLE","DATALINK","DATE","DAY","DEALLOCATE","DEC","DECIMAL","DECLARE","DEFAULT","DELETE","DENSE_RANK","DEREF","DESCRIBE","DETERMINISTIC","DISCONNECT","DISTINCT","DLNEWCOPY","DLPREVIOUSCOPY","DLURLCOMPLETE","DLURLCOMPLETEONLY","DLURLCOMPLETEWRITE","DLURLPATH","DLURLPATHONLY","DLURLPATHWRITE","DLURLSCHEME","DLURLSERVER","DLVALUE","DOUBLE","DROP","DYNAMIC","EACH","ELEMENT","ELSE","END","END-EXEC","END_FRAME","END_PARTITION","EQUALS","ESCAPE","EVERY","EXCEPT","EXEC","EXECUTE","EXISTS","EXTERNAL","EXTRACT","FALSE","FETCH","FILTER","FIRST_VALUE","FLOAT","FLOOR","FOR","FOREIGN","FRAME_ROW","FREE","FROM","FULL","FUNCTION","FUSION","GET","GLOBAL","GRANT","GROUP","GROUPING","GROUPS","HAVING","HOLD","HOUR","IDENTITY","IMPORT","IN","INDICATOR","INNER","INOUT","INSENSITIVE","INSERT","INT","INTEGER","INTERSECT","INTERSECTION","INTERVAL","INTO","IS","JOIN","LAG","LANGUAGE","LARGE","LAST_VALUE","LATERAL","LEAD","LEADING","LEFT","LIKE","LIKE_REGEX","LN","LOCAL","LOCALTIME","LOCALTIMESTAMP","LOWER","MATCH","MAX","MEMBER","MERGE","METHOD","MIN","MINUTE","MOD","MODIFIES","MODULE","MONTH","MULTISET","NATIONAL","NATURAL","NCHAR","NCLOB","NEW","NO","NONE","NORMALIZE","NOT","NTH_VALUE","NTILE","NULL","NULLIF","NUMERIC","OCCURRENCES_REGEX","OCTET_LENGTH","OF","OFFSET","OLD","ON","ONLY","OPEN","OR","ORDER","OUT","OUTER","OVER","OVERLAPS","OVERLAY","PARAMETER","PARTITION","PERCENT","PERCENTILE_CONT","PERCENTILE_DISC","PERCENT_RANK","PERIOD","PORTION","POSITION","POSITION_REGEX","POWER","PRECEDES","PRECISION","PREPARE","PRIMARY","PROCEDURE","RANGE","RANK","READS","REAL","RECURSIVE","REF","REFERENCES","REFERENCING","REGR_AVGX","REGR_AVGY","REGR_COUNT","REGR_INTERCEPT","REGR_R2","REGR_SLOPE","REGR_SXX","REGR_SXY","REGR_SYY","RELEASE","RESULT","RETURN","RETURNED_CARDINALITY","RETURNS","REVOKE","RIGHT","ROLLBACK","ROLLUP","ROW","ROWS","ROW_NUMBER","SAVEPOINT","SCOPE","SCROLL","SEARCH","SECOND","SELECT","SENSITIVE","SESSION_USER","SET","SIMILAR","SMALLINT","SOME","SPECIFIC","SPECIFICTYPE","SQL","SQLEXCEPTION","SQLSTATE","SQLWARNING","SQRT","START","STATIC","STDDEV_POP","STDDEV_SAMP","SUBMULTISET","SUBSTRING","SUBSTRING_REGEX","SUCCEEDS","SUM","SYMMETRIC","SYSTEM","SYSTEM_TIME","SYSTEM_USER","TABLE","TABLESAMPLE","THEN","TIME","TIMESTAMP","TIMEZONE_HOUR","TIMEZONE_MINUTE","TO","TRAILING","TRANSLATE","TRANSLATE_REGEX","TRANSLATION","TREAT","TRIGGER","TRIM","TRIM_ARRAY","TRUE","TRUNCATE","UESCAPE","UNION","UNIQUE","UNKNOWN","UNNEST","UPDATE","UPPER","USER","USING","VALUE","VALUES","VALUE_OF","VARBINARY","VARCHAR","VARYING","VAR_POP","VAR_SAMP","VERSIONING","WHEN","WHENEVER","WHERE","WIDTH_BUCKET","WINDOW","WITH","WITHIN","WITHOUT","XML","XMLAGG","XMLATTRIBUTES","XMLBINARY","XMLCAST","XMLCOMMENT","XMLCONCAT","XMLDOCUMENT","XMLELEMENT","XMLEXISTS","XMLFOREST","XMLITERATE","XMLNAMESPACES","XMLPARSE","XMLPI","XMLQUERY","XMLSERIALIZE","XMLTABLE","XMLTEXT","XMLVALIDATE","YEAR"
]);