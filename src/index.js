
exports = module.exports = {};

const { Mark } = Coralian.constants;
const { getLang, getLanguagesName } = require("./common");

// 载入所有包
if (Coralian.side()) {
	const langs = require.context("./langs/.");
	langs.keys().forEach(key => {
		langs(key);
	});
} else {
	const fs = require("fs");
	const langs = fs.readdirSync(`${__dirname}/langs`);
	langs.map((file) => {
		require(`./langs/${file}`);
	});
}

const NEW_LINE_REGX = /(\r\n|\r)/ig;
const FILED_START = '<fieldset class="code"><legend>',
	FILED_LIST = '</legend><pre><ol class="code_list"><li>',
	FILED_END = '</li></ol></pre></fieldset>',
	CODE_TAG_START = "<code>",
	CODE_TAG_END = "</code>";

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
		case 'CS':
			lang = 'C#';
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

	let language = getLang(lang);
	return language.execute(input.replace(NEW_LINE_REGX, Mark.NEW_LINE));
}

const FlyHighLighter = {
	constants: {},
	components: {},
	execute: (input, lang) => {

		input = String.trim(input);
		if (!input) return String.BLANK;

		if (!String.contains(input, Mark.NEW_LINE) && !lang) {
			let output = [CODE_TAG_START];
			for (let i = 0, len = input.length; i < len; i++) {
				components.doHtmlEscape(input.charAt(i), output);
			}
			output.push(CODE_TAG_END);
			return output.join(String.BLANK);
		}

		lang = String.trim(getFullName(lang.toUpperCase()));

		return FILED_START + getLangName(lang) + FILED_LIST + parseLang(lang, input) + FILED_END;
	},
	getLangs: getLanguagesName
};
Object.addAll(require("./constants"), FlyHighLighter.constants);
Object.addAll(require("./components"), FlyHighLighter.components);

Coralian.setToGlobal("FlyHighLighter", FlyHighLighter);
