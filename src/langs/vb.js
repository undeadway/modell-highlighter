/**
 * VB、VB.NET、VBA
 */
const { Char } = JsConst;
const { doLineComment4Like, canInWord } = require("./../components");
const { addLang } = require("./../common");

const dftBuiltInFunc = ["CDate", "Date", "DateAdd", "DateDiff", "DatePart", "DateSerial", "DateValue", "Day",
	"FormatDateTime", "Hour", "IsDate", "Minute", "Month", "MonthName", "Now", "Second", "Time", "Timer",
	"TimeSerial", "TimeValue", "Weekday", "WeekdayName", "Year", "Asc", "CBool", "CByte", "CCur", "CDate",
	"CDbl", "Chr", "CInt", "CLng", "CSng", "CStr", "Hex", "Oct", "FormatCurrency", "FormatDateTime", "Sgn",
	"FormatNumber", "FormatPercent", "Abs", "Atn", "Cos", "Exp", "Hex", "Int", "Fix", "Log", "Oct", "Rnd",
	"Sin", "Sqr", "Tan", "Array", "Filter", "IsArray", "Join", "LBound", "Split", "UBound", "InStr", "InStrRev",
	"LCase", "Left", "Len", "LTrim", "RTrim", "Trim", "Mid", "Replace", "Right", "Space", "StrComp", "String",
	"StrReverse", "UCase", "CreateObject", "Eval", "GetLocale", "GetObject", "GetRef", "InputBox", "IsEmpty",
	"IsNull", "IsNumeric", "IsObject", "LoadPicture", "MsgBox", "RGB", "Round", "ScriptEngine", "VarType",
	"ScriptEngineBuildVersion", "ScriptEngineMajorVersion", "ScriptEngineMinorVersion", "SetLocale", "TypeName"
];

const plugIn = {
	judgeComment: function (at) {
		return at === Char.QUOTE;
	},
	isBuiltInFunc: function (word) {

		let result = false;
		
		for (let funName of dftBuiltInFunc) {
			if (String.equalsIgnoreCase(word, funName)) {
				result = true;
				break;
			}
		}

		return result;
	},
	doComment: doLineComment4Like,
	escaper: Char.DQUOTE,
	doKeyword: function (kws, word, next) {

		let result = false;

		for (let kw of kws) {
			if (String.equalsIgnoreCase(word, kw)) {
				result = true;
				break;
			}
		}

		return result && !canInWord(next);
	}
};

addLang([{ name: "VB" }, { name: "VBA" }, { name: "VBSCRIPT" }], null, plugIn,
	["AddHandler", "AddressOf", "Alias", "And", "AndAlso", "Ansi", "As", "Assembly", "Auto", "Boolean",
		"ByRef", "Byte", "ByVal", "Call", "Case", "Catch", "CBool", "CByte", "CChar", "CDate", "CDec", "CDbl",
		"Char", "CInt", "Class", "CLng", "CObj", "Const", "CShort", "CSng", "CStr", "CType", "Date", "Decimal",
		"Declare", "Default", "Delegate", "Dim", "DirectCast", "Do", "Double", "Each", "Else", "ElseIf", "End",
		"Enum", "Erase", "Error", "Event", "Exit", "#ExternalSource", "False", "Finally", "For", "Friend",
		"Function", "Get", "GetType", "GoTo", "Handles", "If", "Implements", "Imports", "In", "Inherits",
		"Integer", "Interface", "Is", "Let", "Lib", "Like", "Long", "Loop", "Me", "Mod", "Module",
		"MustInherit", "MustOverride", "MyBase", "MyClass", "Namespace", "New", "Next", "Not", "Nothing",
		"NotInheritable", "NotOverridable", "Object", "On", "Option", "Optional", "Or", "OrElse", "Overloads",
		"Overridable", "Overrides", "ParamArray", "Preserve", "Private", "Property", "Protected", "Public",
		"RaiseEvent", "ReadOnly", "ReDim", "#Region", "REM", "RemoveHandler", "Resume", "Return", "Select",
		"Set", "Shadows", "Shared", "Short", "Single", "Static", "Step", "Stop", "String", "Structure", "Sub",
		"SyncLock", "Then", "Throw", "To", "True", "Try", "TypeOf", "Unicode", "Until", "Variant", "When",
		"While", "With", "WithEvents", "WriteOnly", "Xor", "#Const", "#ExternalSource", "#Region"
	]);

// VB6和VB.NET 应该不一样，但现在看起来似乎一样，原因待查
addLang([{ name: "VB.NET" }], null, plugIn
	/*
	 * 所列的关键字全部来自 MSND （https://msdn.microsoft.com/zh-cn/library/ksh7h19t(v=vs.90).aspx）
	 * 但MSDN 上写的是 Visual Basic 的关键字，而不是 .NET，所以暂时存疑
	 * 单纯VB6 的关键字是什么，也存疑
	 */, ["AddHandler", "AddressOf", "Alias", "And", "AndAlso", "Ansi", "As", "Assembly", "Auto", "Boolean",
		"ByRef", "Byte", "ByVal", "Call", "Case", "Catch", "CBool", "CByte", "CChar", "CDate", "CDec", "CDbl",
		"Char", "CInt", "Class", "CLng", "CObj", "Const", "CShort", "CSng", "CStr", "CType", "Date", "Decimal",
		"Declare", "Default", "Delegate", "Dim", "DirectCast", "Do", "Double", "Each", "Else", "ElseIf", "End",
		"Enum", "Erase", "Error", "Event", "Exit", "#ExternalSource", "False", "Finally", "For", "Friend",
		"Function", "Get", "GetType", "GoTo", "Handles", "If", "Implements", "Imports", "In", "Inherits",
		"Integer", "Interface", "Is", "Let", "Lib", "Like", "Long", "Loop", "Me", "Mod", "Module",
		"MustInherit", "MustOverride", "MyBase", "MyClass", "Namespace", "New", "Next", "Not", "Nothing",
		"NotInheritable", "NotOverridable", "Object", "On", "Option", "Optional", "Or", "OrElse", "Overloads",
		"Overridable", "Overrides", "ParamArray", "Preserve", "Private", "Property", "Protected", "Public",
		"RaiseEvent", "ReadOnly", "ReDim", "#Region", "REM", "RemoveHandler", "Resume", "Return", "Select",
		"Set", "Shadows", "Shared", "Short", "Single", "Static", "Step", "Stop", "String", "Structure", "Sub",
		"SyncLock", "Then", "Throw", "To", "True", "Try", "TypeOf", "Unicode", "Until", "Variant", "When",
		"While", "With", "WithEvents", "WriteOnly", "Xor", "#Const", "#ExternalSource", "#Region"
	]);