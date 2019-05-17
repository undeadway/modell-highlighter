
exports = module.exports = {};

const constants = require("./constants");
const components = require("./components");
const common = require("./common");

Object.addAll(constants, exports);
Object.addAll(components, exports);

for (let langFile of require("fs").readdirSync("./src/langs")) {
	require(`./langs/${langFile}`);
}

const NEW_LINE = /(\r\n|\r)/ig;
const FILED_START = '<fieldset class="code"><legend>',
	FILED_LIST = '</legend><pre><ol class="code_list"><li>',
	FILED_END = '</li></ol></pre></fieldset>',
	CODE_TAG_START = "<code>", CODE_TAG_END = "</code>";

const langMap = {
	JAVA: 'Java',
	JAVASCRIPT: 'JavaScript',
	VBSCRIPT: 'VBScript',
};

function getFullName(lang) {
	switch (lang) {
		case 'JS':
			lang = 'JAVASCRIPT';
			break;
		case 'VBS':
			lang = 'VBSCRIPT';
		default:
			break;
	}
	return lang;
}

function getLangName(lang) {
	if (lang) {
		return (langMap[lang] || lang) + ' 代码';
	} else {
		return '伪代码';
	}
}

function parseLang(lang, input) {

	let language = common.getLang(lang);
	return language.execute(input.replace(NEW_LINE, constants.Mark.NL_N));
}

exports.execute = (input, lang) => {

	input = String.trim(input);
	if (!input) return String.BLANK;

	if (!String.contains(input, constants.Mark.NL_N) && !lang) {
		let output = [CODE_TAG_START];
		for (let i = 0, len = input.length; i < len; i++) {
			components.doHtmlEscape(input.charAt(i), output);
		}
		output.push(CODE_TAG_END);
		return output.join(String.BLANK);
	}

	lang = String.trim(getFullName(lang.toUpperCase()));

	return FILED_START + getLangName(lang) + FILED_LIST + parseLang(lang, input) + FILED_END;
}

exports.getLangs = common.getLanguagesName;