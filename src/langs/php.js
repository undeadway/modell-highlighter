
const { Span } = require("./../constants");
const components = require("./../components");
const common = require("./../common");

const dftBuiltInFunc = ['eval'];

const PHP_START = "<?php",
	PHP_END = "?>";
const PHP_START_LEN = PHP_START.length,
	PHP_END_LEN = PHP_END.length;

const html = common.getLang("HTML").HTML;

const php = common.initLangObject(null, {
	charSpan: Span.STRING,
	isBuiltInFunc: function (word) {
		return Array.has(dftBuiltInFunc, word);
	}
},
	['and', 'or', 'xor', 'exception', 'as', 'break', 'case', 'class', 'const', 'continue ', 'declare',
		'default', 'do', 'echo', 'else', 'elseif', 'enddeclare', 'endfor', 'endforeach', 'endif', 'endswitch',
		'endwhile', 'extends', 'for', 'foreach', 'function', 'global', 'if', 'include', 'include_once', 'new',
		'print', 'require', 'require_once', 'return', 'static', 'switch', 'use', 'var', 'while', 'final',
		'php_user_filter', 'interface', 'implements', 'public', 'private', 'protected', 'abstract', 'clone ',
		'try', 'catch', 'throw', 'cfunction', 'this', '__LINE__', '__FUNCTION__', '__CLASS__', '__METHOD__']
);

function doPHP(input) {

	let phpStart = input.indexOf(PHP_START);

	if (phpStart < 0) {
		return php.execute(input);
	}

	phpStart += PHP_START_LEN;

	let phpEnd = input.indexOf(PHP_END);

	let output = html.execute(input.slice(0, phpStart)) +
		php.execute(input.slice(phpStart, phpEnd)) + html.execute(PHP_END) +
		doPHP(input.slice(phpEnd + PHP_END_LEN));

	return output;
}

common.addLang([{ name: "PHP" }], doPHP);