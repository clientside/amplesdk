/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

/*!
 * Globalize
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * rev: 355cf82c894d5171b0707c669f921dce08183e65
 */

var oGlobalize,
	// private variables
	rRegexHex,
	rRegexInfinity,
	rRegexParseFloat,
	rRegexTrim,
	// private JavaScript utility functions
	fArrayIndexOf,
	fEndWith,
	fExtend,
	fIsArray,
	fIsFunction,
	fIsObject,
	fStartsWith,
	fTrim,
	fTruncate,
	fZeroPad,
	// private Globalization utility functions
	fAppendPreOrPostMatch,
	fExpandFormat,
	fFormatDate,
	fFormatNumber,
	fGetDateTokenRegexp,
	fGetEra,
	fGetEraYear,
	fParseDate,
	fParseNegativePattern;
/*
// Global variable (oGlobalize) or CommonJS module (globalize)
oGlobalize = function(sCultureSelector) {
	return new oGlobalize.prototype.init(sCultureSelector);
};

if (typeof require != "undefined" &&
	typeof exports != "undefined" &&
	typeof module != "undefined") {
	// Assume CommonJS
	module.exports = oGlobalize;
} else {
	// Export as global variable
	window.oGlobalize = oGlobalize;
}
*/
oGlobalize	= {};
oGlobalize.cultures	= {};
/*
oGlobalize.prototype = {
	constructor: oGlobalize,
	init: function(sCultureSelector) {
		this.cultures = oGlobalize.cultures;
		this.cultureSelector = sCultureSelector;

		return this;
	}
};
oGlobalize.prototype.init.prototype = oGlobalize.prototype;
*/
// 1. When defining a culture, all fields are required except the ones stated as optional.
// 2. Each culture should have a ".calendars" object with at least one calendar named "standard"
//    which serves as the default calendar in use by that culture.
// 3. Each culture should have a ".calendar" object which is the current calendar being used,
//    it may be dynamically changed at any time to one of the calendars in ".calendars".
var oDefaultCulture	=
oGlobalize.cultures["default"]	= {};
	// A unique name for the culture in the form <language code>-<country/region code>
oDefaultCulture.name	= 'en';
	// the name of the culture in the english language
oDefaultCulture.englishName	=
	// the name of the culture in its own language
oDefaultCulture.nativeName	= 'English';
	// whether the culture uses right-to-left text
oDefaultCulture.isRTL	= false;
	// "language" is used for so-called "specific" cultures.
	// For example, the culture "es-CL" means "Spanish, in Chili".
	// It represents the Spanish-speaking culture as it is in Chili,
	// which might have different formatting rules or even translations
	// than Spanish in Spain. A "neutral" culture is one that is not
	// specific to a region. For example, the culture "es" is the generic
	// Spanish culture, which may be a more generalized version of the language
	// that may or may not be what a specific culture expects.
	// For a specific culture like "es-CL", the "language" field refers to the
	// neutral, generic culture information for the language it is using.
	// This is not always a simple matter of the string before the dash.
	// For example, the "zh-Hans" culture is netural (Simplified Chinese).
	// And the "zh-SG" culture is Simplified Chinese in Singapore, whose lanugage
	// field is "zh-CHS", not "zh".
	// This field should be used to navigate from a specific culture to it's
	// more general, neutral culture. If a culture is already as general as it
	// can get, the language may refer to itself.
oDefaultCulture.language	= 'en';
	// numberFormat defines general number formatting rules, like the digits in
	// each grouping, the group separator, and how sPositiveative numbers are displayed.
var oNumberFormat	=
oDefaultCulture.numberFormat	= {};
		// [negativePattern]
		// Note, numberFormat.pattern has no "positivePattern" unlike percent and currency,
		// but is still defined as an array for consistency with them.
		//   negativePattern: one of "(n)|-n|- n|n-|n -"
oNumberFormat.pattern	= ['-n'];
		// number of decimal places normally shown
oNumberFormat.decimals	= 2;
		// string that separates number groups, as in 1,000,000
oNumberFormat[',']	= ',';
		// string that separates a number from the fractional portion, as in 1.99
oNumberFormat['.']	= '.';
		// array of numbers indicating the size of each number group.
		// TODO: more detailed description and example
oNumberFormat.groupSizes	= [3];
		// symbol used for positive numbers
oNumberFormat['+']	= '+';
		// symbol used for negative numbers
oNumberFormat['-']	= '-';
		// symbol used for NaN (Not-A-Number)
oNumberFormat["NaN"]	= "NaN";
		// symbol used for Negative Infinity
oNumberFormat["negativeInfinity"]	= '-' + "Infinity";
		// symbol used for Positive Infinity
oNumberFormat["positiveInfinity"]	= "Infinity";

var oPercentFormat	=
oNumberFormat.percent	= {};
			// [negativePattern, positivePattern]
			//   negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
			//   positivePattern: one of "n %|n%|%n|% n"
oPercentFormat.pattern	= ['-n' + ' ' + '%', 'n' + ' ' + '%'];
			// number of decimal places normally shown
oPercentFormat.decimals	= 2;
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
oPercentFormat.groupSizes	= [3];
			// string that separates number groups, as in 1,000,000
oPercentFormat[',']	= ',';
			// string that separates a number from the fractional portion, as in 1.99
oPercentFormat['.']	= '.';
			// symbol used to represent a percentage
oPercentFormat.symbol	= '%';

var oCurrencyFormat	=
oNumberFormat.currency	= {};
			// [negativePattern, positivePattern]
			//   negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
			//   positivePattern: one of "$n|n$|$ n|n $"
oCurrencyFormat.pattern	= ['($n)', '$n'];
			// number of decimal places normally shown
oCurrencyFormat.decimals	= 2;
			// array of numbers indicating the size of each number group.
			// TODO: more detailed description and example
oCurrencyFormat.groupSizes	= [3];
			// string that separates number groups, as in 1,000,000
oCurrencyFormat[',']	= ',';
			// string that separates a number from the fractional portion, as in 1.99
oCurrencyFormat['.']	= '.';
			// symbol used to represent currency
oCurrencyFormat.symbol	= '$';
	// calendars defines all the possible calendars used by this culture.
	// There should be at least one defined with name "standard", and is the default
	// calendar used by the culture.
	// A calendar contains information about how dates are formatted, information about
	// the calendar's eras, a standard set of the date formats,
	// translations for day and month names, and if the calendar is not based on the Gregorian
	// calendar, conversion functions to and from the Gregorian calendar.
oDefaultCulture.calendars	= {};

var oCalendarFormat	=
oDefaultCulture.calendar	=
oDefaultCulture.calendars.standard	= {};
			// name that identifies the type of calendar this is
oCalendarFormat.name	= 'Gregorian_USEnglish';
			// separator of parts of a date (e.g. "/" in 11/05/1955)
oCalendarFormat['/']	= '/';
			// separator of parts of a time (e.g. ":" in 05:44 PM)
oCalendarFormat[':']	= ':';
			// the first day of the week (0 = Sunday, 1 = Monday, etc)
oCalendarFormat.firstDay= 0;
oCalendarFormat.days	= {};
				// full day names
oCalendarFormat.days.names	= 'Sunday;Monday;Tuesday;Wednesday;Thursday;Friday;Saturday'.split(';');
				// abbreviated day names
oCalendarFormat.days.namesAbbr	= 'Sun;Mon;Tue;Wed;Thu;Fri;Sat'.split(';');
				// shortest day names
oCalendarFormat.days.namesShort	= 'Su;Mo;Tu;We;Th;Fr;Sa'.split(';');

oCalendarFormat.months	= {};
				// full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
oCalendarFormat.months.names	= 'January;February;March;April;May;June;July;August;September;October;November;December;'.split(';');
				// abbreviated month names
oCalendarFormat.months.namesAbbr= 'Jan;Feb;Mar;Apr;May;Jun;Jul;Aug;Sep;Oct;Nov;Dec;'.split(';');

			// AM and PM designators in one of these forms:
			// The usual view, and the upper and lower case versions
			//   [standard, lowercase, uppercase]
			// The culture does not use AM or PM (likely all standard date formats use 24 hour time)
			//   null
oCalendarFormat.AM	= ['AM', 'am', 'AM'];
oCalendarFormat.PM	= ['PM', 'pm', 'PM'];

var oCalendarEra	= {};
oCalendarFormat.eras	= [oCalendarEra];
				// eras in reverse chronological order.
				// name: the name of the era in this culture (e.g. A.D., C.E.)
				// start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
				// offset: offset in years from gregorian calendar
oCalendarEra.name	= 'A.D.';
oCalendarEra.start	= null;
oCalendarEra.offset	= 0;
			// when a two digit year is given, it will never be parsed as a four digit
			// year greater than this year (in the appropriate era for the culture)
			// Set it as a full year (e.g. 2029) or use an offset format starting from
			// the current year: "+19" would correspond to 2029 if the current year 2010.
oCalendarFormat.twoDigitYearMax	= 2029;
			// set of predefined date and time patterns used by the culture
			// these represent the format someone in this culture would expect
			// to see given the portions of the date that are shown.
var oCalendarPatterns	=
oCalendarFormat.patterns	= {};
				// short date pattern
oCalendarPatterns['d']	= 'M/d/yyyy';
				// long date pattern
oCalendarPatterns['D']	= 'dddd,' + ' ' +'MMMM dd,' + ' ' + 'yyyy';
				// short time pattern
oCalendarPatterns['t']	= 'h:mm' + ' ' + 'tt';
				// long time pattern
oCalendarPatterns['T']	= 'h:mm:ss' + ' ' + 'tt';
				// long date, short time pattern
oCalendarPatterns['f']	= oCalendarPatterns['D'] + ' ' + oCalendarPatterns['t'];
				// long date, long time pattern
oCalendarPatterns['F']	= oCalendarPatterns['D'] + ' ' + oCalendarPatterns['T'];
				// month/day pattern
oCalendarPatterns['M']	= 'MMMM' + ' ' + 'dd';
				// month/year pattern
oCalendarPatterns['Y']	= 'yyyy' + ' ' + 'MMMM';
				// S is a sortable format that does not vary by culture
oCalendarPatterns['S']	= 'yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss';
			// optional fields for each calendar:
			/*
			monthsGenitive:
				Same as months but used when the day preceeds the month.
				Omit if the culture has no genitive distinction in month names.
				For an explaination of genitive months, see http://blogs.msdn.com/michkap/archive/2004/12/25/332259.aspx
			convert:
				Allows for the support of non-gregorian based calendars. This convert object is used to
				to convert a date to and from a gregorian calendar date to handle parsing and formatting.
				The two functions:
					fromGregorian(date)
						Given the date as a parameter, return an array with parts [year, month, day]
						corresponding to the non-gregorian based year, month, and day for the calendar.
					toGregorian(year, month, day)
						Given the non-gregorian year, month, and day, return a new Date() object
						set to the corresponding date in the gregorian calendar.
			*/
	// For localized strings
oDefaultCulture.messages	= {};

oGlobalize.cultures.en	= oDefaultCulture;

oGlobalize.cultureSelector	= 'en';

//
// private variables
//

rRegexHex	= /^0x[a-f0-9]+$/i;
rRegexInfinity	= /^[+\-]?infinity$/i;
rRegexParseFloat	= /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/;
rRegexTrim	= /^\s+|\s+$/g;

//
// private JavaScript utility functions
//

fArrayIndexOf	= function(aValue, vValue) {
	if (aValue.indexOf) {
		return aValue.indexOf(vValue);
	}
	for (var nIndex = 0, nLength = aValue.length; nIndex < nLength; nIndex++) {
		if (aValue[nIndex] === vValue) {
			return nIndex;
		}
	}
	return -1;
};

fEndWith	= function(sValue, sPattern) {
	return sValue.substr(sValue.length - sPattern.length) === sPattern;
};

fExtend	= function() {
	var oOptions, sName, oSource, oCopy, bCopyIsArray, oClone,
		oTarget	= arguments[0] || {},
		nIndex	= 1,
		nLength	= arguments.length,
		bDeep	= false;

	// Handle a deep copy situation
	if (typeof oTarget == "boolean") {
		bDeep	= oTarget;
		oTarget	= arguments[1] || {};
		// skip the boolean and the target
		nIndex	= 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if (!fIsObject(oTarget) && !fIsFunction(oTarget)) {
		oTarget	= {};
	}

	for (; nIndex < nLength; nIndex++) {
		// Only deal with non-null/undefined values
		if ((oOptions = arguments[nIndex]) != null) {
			// Extend the base object
			for (sName in oOptions) {
				oSource	= oTarget[sName];
				oCopy	= oOptions[sName];

				// Prevent never-ending loop
				if (oTarget === oCopy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (bDeep && oCopy && (fIsObject(oCopy) || (bCopyIsArray = fIsArray(oCopy)))) {
					if (bCopyIsArray) {
						bCopyIsArray	= false;
						oClone	= oSource && fIsArray(oSource) ? oSource : [];

					} else {
						oClone	= oSource && fIsObject(oSource) ? oSource : {};
					}

					// Never move original objects, clone them
					oTarget[sName]	= fExtend(bDeep, oClone, oCopy);

				// Don't bring in undefined values
				} else if (typeof oCopy != "undefined") {
					oTarget[sName]	= oCopy;
				}
			}
		}
	}

	// Return the modified object
	return oTarget;
};

fIsArray	= cArray.isArray || function(vValue) {
	return cObject.prototype.toString.call(vValue) == '[' + "object" + ' ' + "Array" + ']';
};

fIsFunction	= function(vValue) {
	return cObject.prototype.toString.call(vValue) == '[' + "object" + ' ' + "Function" + ']';
};

fIsObject	= function(vValue) {
	return typeof vValue == "object";
};

fStartsWith	= function(sValue, sPattern) {
	return sValue.indexOf(sPattern) === 0;
};

fTrim	= function(sValue) {
	return (sValue + '').replace(rRegexTrim, '');
};

fTruncate	= function(nValue) {
	if (fIsNaN(nValue)) {
		return nNaN;
	}
	return cMath[nValue < 0 ? "ceil" : "floor"](nValue);
};

fZeroPad	= function(sValue, nCount, bLeft) {
	for (var nLength = sValue.length; nLength < nCount; nLength++) {
		sValue	= (bLeft ? ('0' + sValue) : (sValue + '0'));
	}
	return sValue;
};

//
// private Globalization utility functions
//

fAppendPreOrPostMatch	= function(sValue, aValue) {
	// appends pre- and post- token match strings while removing escaped characters.
	// Returns a single quote count which is used to determine if the token occurs
	// in a string literal.
	var nQuoteCount	= 0,
		bEscaped	= false;
	for (var nIndex = 0, nLength = sValue.length; nIndex < nLength; nIndex++) {
		var sChar	= sValue.charAt(nIndex);
		switch (sChar) {
			case "\'":
				if (bEscaped) {
					aValue.push("\'");
				}
				else {
					nQuoteCount++;
				}
				bEscaped	= false;
				break;
			case '\\':
				if (bEscaped) {
					aValue.push('\\');
				}
				bEscaped	= !bEscaped;
				break;
			default:
				aValue.push(sChar);
				bEscaped	= false;
				break;
		}
	}
	return nQuoteCount;
};

fExpandFormat	= function(oCalendar, sFormat) {
	// expands unspecified or single character date formats into the full pattern.
	sFormat	= sFormat || 'F';
	var sPattern,
		oPattern	= oCalendar.patterns,
		nLength	= sFormat.length;
	if (nLength === 1) {
		sPattern	= oPattern[sFormat];
		if (!sPattern) {
			throw new cDOMException(cDOMException.SYNTAX_ERR, null, [sFormat]);
		}
		sFormat	= sPattern;
	}
	else if (nLength === 2 && sFormat.charAt(0) === '%') {
		// %X escape format -- intended as a custom format string that is only one character, not a built-in format.
		sFormat	= sFormat.charAt(1);
	}
	return sFormat;
};

fFormatDate	= function(dValue, sFormat, oCulture) {
	var oCalendar	= oCulture.calendar,
		oConvert	= oCalendar.convert;

	if (!sFormat || !sFormat.length || sFormat === 'i') {
		if (oCulture && oCulture.name.length) {
			if (oConvert) {
				// non-gregorian calendar, so we cannot use built-in toLocaleString()
				return fFormatDate(dValue, oCalendar.patterns.F, oCulture);
			}
			else {
				var dEraDate	= new cDate(dValue.getTime());
				dEraDate.setFullYear(fGetEraYear(dValue, oCalendar, fGetEra(dValue, oCalendar.eras)));
				return dEraDate.toLocaleString();
			}
		}
		else {
			return dValue.toString();
		}
	}

	var bSortable	= sFormat === 's';
	sFormat	= fExpandFormat(oCalendar, sFormat);

	// Start with an empty string
	var aDate	= [];
	var aZeros	= ['0', '00', '000'],
		bDayFound,
		bDayChecked,
		rDayPartRegexp	= /([^d]|^)(d|dd)([^d]|$)/g,
		nQuoteCount	= 0,
		rDateTokenRegexp	= fGetDateTokenRegexp(),
		nPart,
		aConverted;

	function fPadZeros(nValue, nCount) {
		var sReturn, sValue	= nValue + '';
		if (nCount > 1 && sValue.length < nCount) {
			sReturn	= (aZeros[nCount - 2] + sValue);
			return sReturn.substr(sReturn.length - nCount, nCount);
		}
		else {
			sReturn	= sValue;
		}
		return sReturn;
	}

	function fHasDay() {
		if (bDayFound || bDayChecked) {
			return bDayFound;
		}
		bDayFound	= rDayPartRegexp.test(sFormat);
		bDayChecked	= true;
		return bDayFound;
	}

	function fGetPart(dValue, nIndex) {
		if (aConverted) {
			return aConverted[nIndex];
		}
		switch (nIndex) {
			case 0:
				return dValue.getFullYear();
			case 1:
				return dValue.getMonth();
			case 2:
				return dValue.getDate();
		}
	}

	if (!bSortable && oConvert) {
		aConverted	= oConvert.fromGregorian(dValue);
	}

	for (; ;) {
		// Save the current index
		var nLastIndex	= rDateTokenRegexp.lastIndex,
			// Look for the next pattern
			aFormat	= rDateTokenRegexp.exec(sFormat);

		// Append the text before the pattern (or the end of the string if not found)
		var aPreMatch	= sFormat.slice(nLastIndex, aFormat ? aFormat.index : sFormat.length);
		nQuoteCount += fAppendPreOrPostMatch(aPreMatch, aDate);

		if (!aFormat) {
			break;
		}

		// do not replace any matches that occur inside a string literal.
		if (nQuoteCount % 2) {
			aDate.push(aFormat[0]);
			continue;
		}

		var sCurrent	= aFormat[0],
			nCurrentLength	= sCurrent.length;

		switch (sCurrent) {
			case 'ddd':
				//Day of the week, as a three-letter abbreviation
			case 'dddd':
				// Day of the week, using the full name
				var aNames	= (nCurrentLength === 3) ? oCalendar.days.namesAbbr : oCalendar.days.names;
				aDate.push(aNames[dValue.getDay()]);
				break;
			case 'd':
				// Day of month, without leading zero for single-digit days
			case 'dd':
				// Day of month, with leading zero for single-digit days
				bDayFound	= true;
				aDate.push(
					fPadZeros(fGetPart(dValue, 2), nCurrentLength)
				);
				break;
			case 'MMM':
				// Month, as a three-letter abbreviation
			case 'MMMM':
				// Month, using the full name
				nPart	= fGetPart(dValue, 1);
				aDate.push(
					(oCalendar.monthsGenitive && fHasDay()) ?
					(oCalendar.monthsGenitive[nCurrentLength === 3 ? "namesAbbr" : "names"][nPart]) :
					(oCalendar.months[nCurrentLength === 3 ? "namesAbbr" : "names"][nPart])
				);
				break;
			case 'M':
				// Month, as digits, with no leading zero for single-digit months
			case 'MM':
				// Month, as digits, with leading zero for single-digit months
				aDate.push(
					fPadZeros(fGetPart(dValue, 1) + 1, nCurrentLength)
				);
				break;
			case 'y':
				// Year, as two digits, but with no leading zero for years less than 10
			case 'yy':
				// Year, as two digits, with leading zero for years less than 10
			case 'yyyy':
				// Year represented by four full digits
				nPart	= aConverted ? aConverted[0] : fGetEraYear(dValue, oCalendar, fGetEra(dValue, oCalendar.eras), bSortable);
				if (nCurrentLength < 4) {
					nPart	= nPart % 100;
				}
				aDate.push(
					fPadZeros(nPart, nCurrentLength)
				);
				break;
			case 'h':
				// Hours with no leading zero for single-digit hours, using 12-hour clock
			case 'hh':
				// Hours with leading zero for single-digit hours, using 12-hour clock
				nPart	= dValue.getHours() % 12;
				if (nPart === 0) nPart	= 12;
				aDate.push(
					fPadZeros(nPart, nCurrentLength)
				);
				break;
			case 'H':
				// Hours with no leading zero for single-digit hours, using 24-hour clock
			case 'HH':
				// Hours with leading zero for single-digit hours, using 24-hour clock
				aDate.push(
					fPadZeros(dValue.getHours(), nCurrentLength)
				);
				break;
			case 'm':
				// Minutes with no leading zero for single-digit minutes
			case 'mm':
				// Minutes with leading zero for single-digit minutes
				aDate.push(
					fPadZeros(dValue.getMinutes(), nCurrentLength)
				);
				break;
			case 's':
				// Seconds with no leading zero for single-digit seconds
			case 'ss':
				// Seconds with leading zero for single-digit seconds
				aDate.push(
					fPadZeros(dValue.getSeconds(), nCurrentLength)
				);
				break;
			case 't':
				// One character am/pm indicator ("a" or "p")
			case 'tt':
				// Multicharacter am/pm indicator
				nPart	= dValue.getHours() < 12 ? (oCalendar.AM ? oCalendar.AM[0] : ' ') : (oCalendar.PM ? oCalendar.PM[0] : ' ');
				aDate.push(nCurrentLength === 1 ? nPart.charAt(0) : nPart);
				break;
			case 'f':
				// Deciseconds
			case 'ff':
				// Centiseconds
			case 'fff':
				// Milliseconds
				aDate.push(
					fPadZeros(dValue.getMilliseconds(), 3).substr(0, nCurrentLength)
				);
				break;
			case 'z':
				// Time zone offset, no leading zero
			case 'zz':
				// Time zone offset with leading zero
				nPart	= dValue.getTimezoneOffset() / 60;
				aDate.push(
					(nPart <= 0 ? '+' : '-') + fPadZeros(cMath.floor(cMath.abs(nPart)), nCurrentLength)
				);
				break;
			case 'zzz':
				// Time zone offset with leading zero
				nPart	= dValue.getTimezoneOffset() / 60;
				aDate.push(
					(nPart <= 0 ? '+' : '-') + fPadZeros(cMath.floor(cMath.abs(nPart)), 2) +
					// Hard coded ":" separator, rather than using oCalendar.TimeSeparator
					// Repeated here for consistency, plus ":" was already assumed in date parsing.
					':' + fPadZeros(cMath.abs(dValue.getTimezoneOffset() % 60), 2)
				);
				break;
			case 'g':
			case 'gg':
				if (oCalendar.eras) {
					aDate.push(
						oCalendar.eras[fGetEra(dValue, oCalendar.eras)].name
					);
				}
				break;
			case '/':
				aDate.push(oCalendar['/']);
				break;
			default:
				throw new cDOMException(cDOMException.SYNTAX_ERR, null, [sCurrent]);
		}
	}
	return aDate.join('');
};

// fFormatNumber
(function() {
	var fExpandNumber;

	fExpandNumber	= function(nValue, nPrecision, oNumberFormat) {
		var aGroupSizes		= oNumberFormat.groupSizes,
			nCurrentSize	= aGroupSizes[0],
			nCurrentGroupIndex	= 1,
			nFactor		= cMath.pow(10, nPrecision),
			nRounded	= cMath.round(nValue * nFactor) / nFactor;

		if (!fIsFinite(nRounded)) {
			nRounded	= nValue;
		}
		nValue	= nRounded;

		var sValue	= nValue + '',
			sRight	= '',
			aSplit	= sValue.split(/e/i),
			nExponent	= aSplit.length > 1 ? fParseInt(aSplit[1], 10) : 0;
		sValue	= aSplit[0];
		aSplit	= sValue.split('.');
		sValue	= aSplit[0];
		sRight	= aSplit.length > 1 ? aSplit[1] : '';

		if (nExponent > 0) {
			sRight	= fZeroPad(sRight, nExponent, false);
			sValue += sRight.slice(0, nExponent);
			sRight	= sRight.substr(nExponent);
		}
		else if (nExponent < 0) {
			nExponent	= -nExponent;
			sValue	= fZeroPad(sValue, nExponent + 1, true);
			sRight	= sValue.slice(-nExponent, sValue.length) + sRight;
			sValue	= sValue.slice(0, -nExponent);
		}

		if (nPrecision > 0) {
			sRight	= oNumberFormat['.'] +
				((sRight.length > nPrecision) ? sRight.slice(0, nPrecision) : fZeroPad(sRight, nPrecision));
		}
		else {
			sRight	= '';
		}

		var nStringIndex	= sValue.length - 1,
			sSeparator	= oNumberFormat[','],
			sNumber	= '';

		while (nStringIndex >= 0) {
			if (nCurrentSize === 0 || nCurrentSize > nStringIndex) {
				return sValue.slice(0, nStringIndex + 1) + (sNumber.length ? (sSeparator + sNumber + sRight) : sRight);
			}
			sNumber	= sValue.slice(nStringIndex - nCurrentSize + 1, nStringIndex + 1) + (sNumber.length ? (sSeparator + sNumber) : '');

			nStringIndex -= nCurrentSize;

			if (nCurrentGroupIndex < aGroupSizes.length) {
				nCurrentSize	= aGroupSizes[nCurrentGroupIndex];
				nCurrentGroupIndex++;
			}
		}

		return sValue.slice(0, nStringIndex + 1) + sSeparator + sNumber + sRight;
	};

	fFormatNumber	= function(nValue, sFormat, oCulture) {
		if (!fIsFinite(nValue)) {
			if (nValue === nInfinity) {
				return oCulture.numberFormat.positiveInfinity;
			}
			if (nValue === -nInfinity) {
				return oCulture.numberFormat.negativeInfinity;
			}
			return oCulture.numberFormat["NaN"];
		}
		if (!sFormat || sFormat === 'i') {
			return oCulture.name.length ? nValue.toLocaleString() : nValue.toString();
		}
		sFormat	= sFormat || 'D';

		var oFormat	= oCulture.numberFormat,
			nNumber	= cMath.abs(nValue),
			nPrecision	= -1,
			sPattern;
		if (sFormat.length > 1)
			nPrecision	= fParseInt(sFormat.slice(1), 10);

		var sCurrent	= sFormat.charAt(0).toUpperCase(),
			oNumberFormat;

		switch (sCurrent) {
			case 'D':
				sPattern	= 'n';
				nNumber = fTruncate(nNumber);
				if (nPrecision !== -1) {
					nNumber	= fZeroPad('' + nNumber, nPrecision, true);
				}
				if (nValue < 0)
					nNumber	= '-' + nNumber;
				break;
			case 'N':
				oNumberFormat	= oFormat;
				/* falls through */
			case 'C':
				oNumberFormat	= oNumberFormat || oFormat.currency;
				/* falls through */
			case 'P':
				oNumberFormat	= oNumberFormat || oFormat.percent;
				sPattern	= nValue < 0 ? oNumberFormat.pattern[0] : (oNumberFormat.pattern[1] || 'n');
				if (nPrecision === -1)
					nPrecision	= oNumberFormat.decimals;
				nNumber	= fExpandNumber(nNumber * (sCurrent === 'P' ? 100 : 1), nPrecision, oNumberFormat);
				break;
			default:
				throw new cDOMException(cDOMException.SYNTAX_ERR, null, [sCurrent]);
		}

		var rPattern	= /n|\$|-|%/g,
			sNumber		= '';
		for (; ;) {
			var nLastIndex	= rPattern.lastIndex,
				aPattern	= rPattern.exec(sPattern);

			sNumber += sPattern.slice(nLastIndex, aPattern ? aPattern.index : sPattern.length);

			if (!aPattern) {
				break;
			}

			switch (aPattern[0]) {
				case 'n':
					sNumber += nNumber;
					break;
				case '$':
					sNumber += oFormat.currency.symbol;
					break;
				case '-':
					// don't make 0 negative
					if (/[1-9]/.test(nNumber)) {
						sNumber += oFormat['-'];
					}
					break;
				case '%':
					sNumber += oFormat.percent.symbol;
					break;
			}
		}

		return sNumber;
	};

}());

fGetDateTokenRegexp	= function() {
	// regular expression for matching date and time tokens in format strings.
	return (/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g);
};

fGetEra	= function(dValue, aEras) {
	if (!aEras) return 0;
	var nStart,
		nTicks	= dValue.getTime();
	for (var nIndex = 0, nLength = aEras.length; nIndex < nLength; nIndex++) {
		nStart	= aEras[nIndex].start;
		if (nStart === null || nTicks >= nStart) {
			return nIndex;
		}
	}
	return 0;
};

fGetEraYear	= function(dValue, oCalendar, nEra, bSortable) {
	var nValue	= dValue.getFullYear();
	if (!bSortable && oCalendar.eras) {
		// convert normal gregorian year to era-shifted gregorian
		// year by subtracting the era offset
		nValue -= oCalendar.eras[nEra].offset;
	}
	return nValue;
};

// parseExact
(function() {
	var fExpandYear,
		fGetDayIndex,
		fGetMonthIndex,
		fGetDateParseRegexp,
		fOutOfRange,
		fToUpper,
		fToUpperArray;

	fExpandYear	= function(oCalendar, nYear) {
		// expands 2-digit year into 4 digits.
		if (nYear < 100) {
			var dValue	= new cDate,
				nEraYear	= fGetEraYear(dValue, oCalendar, fGetEra(dValue)),
				nMaxYear	= oCalendar.twoDigitYearMax;
			nMaxYear	= typeof nMaxYear == "string" ? dValue.getFullYear() % 100 + fParseInt(nMaxYear, 10) : nMaxYear;
			nYear += nEraYear - (nEraYear % 100);
			if (nYear > nMaxYear) {
				nYear -= 100;
			}
		}
		return nYear;
	};

	fGetDayIndex	= function	(oCalendar, sValue, bAbbreviation) {
		var nValue,
			hDays	= oCalendar.days,
			aUpperDays	= oCalendar._upperDays;
		if (!aUpperDays) {
			oCalendar._upperDays	= aUpperDays	= [
				fToUpperArray(hDays.names),
				fToUpperArray(hDays.namesAbbr),
				fToUpperArray(hDays.namesShort)
			];
		}
		sValue	= fToUpper(sValue);
		if (bAbbreviation) {
			nValue	= fArrayIndexOf(aUpperDays[1], sValue);
			if (nValue === -1) {
				nValue	= fArrayIndexOf(aUpperDays[2], sValue);
			}
		}
		else {
			nValue	= fArrayIndexOf(aUpperDays[0], sValue);
		}
		return nValue;
	};

	fGetMonthIndex	= function(oCalendar, sValue, bAbbreviation) {
		var hMonths	= oCalendar.months,
			hMonthsGenitive	= oCalendar.monthsGenitive || oCalendar.months,
			aUpperMonths	= oCalendar._upperMonths,
			aUpperMonthsGenitive	= oCalendar._upperMonthsGen;
		if (!aUpperMonths) {
			oCalendar._upperMonths	= aUpperMonths	= [
				fToUpperArray(hMonths.names),
				fToUpperArray(hMonths.namesAbbr)
			];
			oCalendar._upperMonthsGen	= aUpperMonthsGenitive	= [
				fToUpperArray(hMonthsGenitive.names),
				fToUpperArray(hMonthsGenitive.namesAbbr)
			];
		}
		sValue	= fToUpper(sValue);
		var nValue	= fArrayIndexOf(bAbbreviation ? aUpperMonths[1] : aUpperMonths[0], sValue);
		if (nValue < 0) {
			nValue	= fArrayIndexOf(bAbbreviation ? aUpperMonthsGenitive[1] : aUpperMonthsGenitive[0], sValue);
		}
		return nValue;
	};

	fGetDateParseRegexp	= function(oCalendar, sFormat) {
		// converts a format string into a regular expression with groups that
		// can be used to extract date fields from a date string.
		// check for a cached parse regex.
		var hRegexpCache	= oCalendar._parseRegExp;
		if (!hRegexpCache) {
			oCalendar._parseRegExp	= hRegexpCache	= {};
		}
		else {
			var aDateParseRegexp	= hRegexpCache[sFormat];
			if (aDateParseRegexp) {
				return aDateParseRegexp;
			}
		}

		// expand single digit formats, then escape regular expression characters.
		var sExpandedFormat	= fExpandFormat(oCalendar, sFormat).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, '\\\\$1'),
			aRegexp	= ['^'],
			aGroups	= [],
			nLastIndex	= 0,
			nQuoteCount	= 0,
			rDateTokenRegexp	= fGetDateTokenRegexp(),
			aMatch;

		// iterate through each date token found.
		while ((aMatch = rDateTokenRegexp.exec(sExpandedFormat)) !== null) {
			var aPreMatch	= sExpandedFormat.slice(nLastIndex, aMatch.index);
			nLastIndex	= rDateTokenRegexp.lastIndex;

			// don't replace any matches that occur inside a string literal.
			nQuoteCount += fAppendPreOrPostMatch(aPreMatch, aRegexp);
			if (nQuoteCount % 2) {
				aRegexp.push(aMatch[0]);
				continue;
			}

			// add a regex group for the token.
			var sMatch	= aMatch[0],
				nLength	= sMatch.length,
				sAddition;
			switch (sMatch) {
				case 'dddd': case 'ddd':
				case 'MMMM': case 'MMM':
				case 'gg': case 'g':
					sAddition	= '(\\D+)';
					break;
				case 'tt': case 't':
					sAddition	= '(\\D*)';
					break;
				case 'yyyy':
				case 'fff':
				case 'ff':
				case 'f':
					sAddition	= '(\\d{' + nLength + '})';
					break;
				case 'dd': case 'd':
				case 'MM': case 'M':
				case 'yy': case 'y':
				case 'HH': case 'H':
				case 'hh': case 'h':
				case 'mm': case 'm':
				case 'ss': case 's':
					sAddition	= '(\\d\\d?)';
					break;
				case 'zzz':
					sAddition	= '([+-]?\\d\\d?:\\d{2})';
					break;
				case 'zz': case 'z':
					sAddition	= '([+-]?\\d\\d?)';
					break;
				case '/':
					sAddition	= '(\\/)';
					break;
				default:
					throw new cDOMException(cDOMException.SYNTAX_ERR, null, [sMatch]);
			}
			if (sAddition) {
				aRegexp.push(sAddition);
			}
			aGroups.push(aMatch[0]);
		}
		fAppendPreOrPostMatch(sExpandedFormat.slice(nLastIndex), aRegexp);
		aRegexp.push('$');

		// allow whitespace to differ when matching formats.
		var sRegexp	= aRegexp.join('').replace(/\s+/g, '\\s+');

		// cache the regex for this format.
		return hRegexpCache[sFormat] = [sRegexp, aGroups];
	};

	fOutOfRange	= function(nValue, nLow, nHigh) {
		return nValue < nLow || nValue > nHigh;
	};

	fToUpper	= function(sValue) {
		// "he-IL" has non-breaking space in weekday names.
		return sValue.split('\u00A0').join(' ').toUpperCase();
	};

	fToUpperArray	= function(aValue) {
		var aReturn	= [];
		for (var nIndex = 0, nLength = aValue.length; nIndex < nLength; nIndex++) {
			aReturn[nIndex]	= fToUpper(aValue[nIndex]);
		}
		return aReturn;
	};

	fParseDate	= function(sValue, sFormat, oCulture) {
		// try to parse the date string by matching against the format string
		// while using the specified culture for date field names.
		sValue	= fTrim(sValue);
		var oCalendar	= oCulture.calendar,
			// convert date formats into regular expressions with groupings.
			// use the regexp to determine the input format and extract the date fields.
			aDateParseRegexp	= fGetDateParseRegexp(oCalendar, sFormat),
			aMatch	= new cRegExp(aDateParseRegexp[0]).exec(sValue);
		if (aMatch === null) {
			return null;
		}
		// found a date format that matches the input.
		var aGroups	= aDateParseRegexp[1],
			nEra	= null, nYear	= null, nMonth	= null, nDate	= null, nWeekDay	= null,
			nHour	= 0, nHourOffset, nMin = 0, nSecond	= 0, nMilliSecond	= 0, nOffsetTimezoneMin	= null,
			bPM	= false;
		// iterate the format groups to extract and set the date fields.
		for (var nGroup = 0, nGroupLength = aGroups.length; nGroup < nGroupLength; nGroup++) {
			var sMatchGroup	= aMatch[nGroup + 1];
			if (sMatchGroup) {
				var sCurrent	= aGroups[nGroup],
					nCurrentLength	= sCurrent.length,
					nMatchInt	= fParseInt(sMatchGroup, 10);
				switch (sCurrent) {
					case 'dd': case 'd':
						// Day of month.
						nDate	= nMatchInt;
						// check that date is generally in valid range, also checking overflow below.
						if (fOutOfRange(nDate, 1, 31)) return null;
						break;
					case 'MMM': case 'MMMM':
						nMonth	= fGetMonthIndex(oCalendar, sMatchGroup, nCurrentLength === 3);
						if (fOutOfRange(nMonth, 0, 11)) return null;
						break;
					case 'M': case 'MM':
						// Month.
						nMonth	= nMatchInt - 1;
						if (fOutOfRange(nMonth, 0, 11)) return null;
						break;
					case 'y': case 'yy':
					case 'yyyy':
						nYear	= nCurrentLength < 4 ? fExpandYear(oCalendar, nMatchInt) : nMatchInt;
						if (fOutOfRange(nYear, 0, 9999)) return null;
						break;
					case 'h': case 'hh':
						// Hours (12-hour clock).
						nHour	= nMatchInt;
						if (nHour === 12) nHour	= 0;
						if (fOutOfRange(nHour, 0, 11)) return null;
						break;
					case 'H': case 'HH':
						// Hours (24-hour clock).
						nHour	= nMatchInt;
						if (fOutOfRange(nHour, 0, 23)) return null;
						break;
					case 'm': case 'mm':
						// Minutes.
						nMin	= nMatchInt;
						if (fOutOfRange(nMin, 0, 59)) return null;
						break;
					case 's': case 'ss':
						// Seconds.
						nSecond	= nMatchInt;
						if (fOutOfRange(nSecond, 0, 59)) return null;
						break;
					case 'tt': case 't':
						// AM/PM designator.
						// see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
						// the AM tokens. If not, fail the parse for this format.
						bPM	= oCalendar.PM && (sMatchGroup === oCalendar.PM[0] || sMatchGroup === oCalendar.PM[1] || sMatchGroup === oCalendar.PM[2]);
						if (!bPM && (!oCalendar.AM || (sMatchGroup !== oCalendar.AM[0] && sMatchGroup !== oCalendar.AM[1] && sMatchGroup !== oCalendar.AM[2]))) return null;
						break;
					case 'f':
						// Deciseconds.
					case 'ff':
						// Centiseconds.
					case 'fff':
						// Milliseconds.
						nMilliSecond	= nMatchInt * cMath.pow(10, 3 - nCurrentLength);
						if (fOutOfRange(nMilliSecond, 0, 999)) return null;
						break;
					case 'ddd':
						// Day of week.
					case 'dddd':
						// Day of week.
						nWeekDay	= fGetDayIndex(oCalendar, sMatchGroup, nCurrentLength === 3);
						if (fOutOfRange(nWeekDay, 0, 6)) return null;
						break;
					case 'zzz':
						// Time zone offset in +/- hours:min.
						var aOffsets	= sMatchGroup.split(/:/);
						if (aOffsets.length !== 2) return null;
						nHourOffset	= fParseInt(aOffsets[0], 10);
						if (fOutOfRange(nHourOffset, -12, 13)) return null;
						var nOffsetMin	= fParseInt(aOffsets[1], 10);
						if (fOutOfRange(nOffsetMin, 0, 59)) return null;
						nOffsetTimezoneMin	= (nHourOffset * 60) + (fStartsWith(sMatchGroup, '-') ? -nOffsetMin : nOffsetMin);
						break;
					case 'z': case 'zz':
						// Time zone offset in +/- hours.
						nHourOffset	= nMatchInt;
						if (fOutOfRange(nHourOffset, -12, 13)) return null;
						nOffsetTimezoneMin	= nHourOffset * 60;
						break;
					case 'g': case 'gg':
						var sEraName	= sMatchGroup;
						if (!sEraName || !oCalendar.eras) return null;
						sEraName	= fTrim(sEraName.toLowerCase());
						for (var nIndex = 0, nLength = oCalendar.eras.length; nIndex < nLength; nIndex++) {
							if (sEraName === oCalendar.eras[nIndex].name.toLowerCase()) {
								nEra	= nIndex;
								break;
							}
						}
						// could not find an era with that name
						if (nEra === null) return null;
						break;
				}
			}
		}
		var dValue	= new cDate,
			nDefaultYear,
			oConvert	= oCalendar.convert;
		nDefaultYear	= oConvert ? oConvert.fromGregorian(dValue)[0] : dValue.getFullYear();
		if (nYear === null) {
			nYear	= nDefaultYear;
		}
		else if (oCalendar.eras) {
			// year must be shifted to normal gregorian year
			// but not if year was not specified, its already normal gregorian
			// per the main if clause above.
			nYear += oCalendar.eras[(nEra || 0)].offset;
		}
		// set default day and month to 1 and January, so if unspecified, these are the defaults
		// instead of the current day/month.
		if (nMonth === null) {
			nMonth	= 0;
		}
		if (nDate === null) {
			nDate	= 1;
		}
		// now have year, month, and date, but in the culture's calendar.
		// convert to gregorian if necessary
		if (oConvert) {
			dValue	= oConvert.toGregorian(nYear, nMonth, nDate);
			// conversion failed, must be an invalid match
			if (dValue === null) return null;
		}
		else {
			// have to set year, month and date together to avoid overflow based on current date.
			dValue.setFullYear(nYear, nMonth, nDate);
			// check to see if date overflowed for specified month (only checked 1-31 above).
			if (dValue.getDate() !== nDate) return null;
			// invalid day of week.
			if (nWeekDay !== null && dValue.getDay() !== nWeekDay) {
				return null;
			}
		}
		// if pm designator token was found make sure the hours fit the 24-hour clock.
		if (bPM && nHour < 12) {
			nHour += 12;
		}
		dValue.setHours(nHour, nMin, nSecond, nMilliSecond);
		if (nOffsetTimezoneMin !== null) {
			// adjust timezone to utc before applying local offset.
			var nAdjustedMin	= dValue.getMinutes() - (nOffsetTimezoneMin + dValue.getTimezoneOffset());
			// Safari limits hours and minutes to the range of -127 to 127.  We need to use setHours
			// to ensure both these fields will not exceed this range.	adjustedMin will range
			// somewhere between -1440 and 1500, so we only need to split this into hours.
			dValue.setHours(dValue.getHours() + fParseInt(nAdjustedMin / 60, 10), nAdjustedMin % 60);
		}
		return dValue;
	};
}());

fParseNegativePattern	= function(sValue, oFormat, sPattern) {
	var sNegative	= oFormat['-'],
		sPositive	= oFormat['+'],
		aValue;
	switch (sPattern) {
		case 'n' + ' ' + '-':
			sNegative	= ' ' + sNegative;
			sPositive	= ' ' + sPositive;
			/* falls through */
		case 'n-':
			if (fEndWith(sValue, sNegative)) {
				aValue	= ['-', sValue.substr(0, sValue.length - sNegative.length)];
			}
			else if (fEndWith(sValue, sPositive)) {
				aValue	= ['+', sValue.substr(0, sValue.length - sPositive.length)];
			}
			break;
		case '-' + ' ' + 'n':
			sNegative += ' ';
			sPositive += ' ';
			/* falls through */
		case '-n':
			if (fStartsWith(sValue, sNegative)) {
				aValue	= ['-', sValue.substr(sNegative.length)];
			}
			else if (fStartsWith(sValue, sPositive)) {
				aValue	= ['+', sValue.substr(sPositive.length)];
			}
			break;
		case '(n)':
			if (fStartsWith(sValue, '(') && fEndWith(sValue, ')')) {
				aValue	= ['-', sValue.substr(1, sValue.length - 2)];
			}
			break;
	}
	return aValue || ['', sValue];
};
/*
//
// public instance functions
//

oGlobalize.prototype.findClosestCulture = function(sCultureSelector) {
	return oGlobalize.findClosestCulture.call(this, sCultureSelector);
};

oGlobalize.prototype.format = function(value, format, sCultureSelector) {
	return oGlobalize.format.call(this, value, format, sCultureSelector);
};

oGlobalize.prototype.localize = function(key, sCultureSelector) {
	return oGlobalize.localize.call(this, key, sCultureSelector);
};

oGlobalize.prototype.parseInt = function(value, nRadix, sCultureSelector) {
	return oGlobalize.parseInt.call(this, value, nRadix, sCultureSelector);
};

oGlobalize.prototype.parseFloat = function(value, nRadix, sCultureSelector) {
	return oGlobalize.parseFloat.call(this, value, nRadix, sCultureSelector);
};

oGlobalize.prototype.culture = function(sCultureSelector) {
	return oGlobalize.culture.call(this, sCultureSelector);
};
*/
//
// public singleton functions
//

oGlobalize.addCultureInfo = function(sCulture, sBaseCulture, oCulture) {

	var oBaseCalture	= {},
		bIsNew	= false;

	if (typeof sCulture != "string") {
		// sCulture argument is optional string. If not specified, assume oCulture is first
		// and only argument. Specified oCulture deep-extends current culture.
		oCulture	= sCulture;
		// Changed: this.culture().name to this.culture.name
		sCulture	= this.culture.name;
		oBaseCalture	= this.cultures[sCulture];
	} else if (typeof sBaseCulture != "string") {
		// sBaseCulture argument is optional string. If not specified, assume oCulture is second
		// argument. Specified oCulture deep-extends specified culture.
		// If specified culture does not exist, create by deep-extending default
		oCulture	= sBaseCulture;
		bIsNew	= (this.cultures[sCulture] == null);
		oBaseCalture	= this.cultures[sCulture] || this.cultures["default"];
	} else {
		// sCulture and sBaseCulture specified. Assume a new culture is being created
		// by deep-extending an specified base culture
		bIsNew	= true;
		oBaseCalture	= this.cultures[sBaseCulture];
	}

	this.cultures[sCulture]	= fExtend(true, {},
		oBaseCalture,
		oCulture
	);
	// Make the standard calendar the current culture if it's a new culture
	if (bIsNew) {
		this.cultures[sCulture].calendar	= this.cultures[sCulture].calendars.standard;
	}
};

oGlobalize.findClosestCulture	= function(vName) {
	var oCulture,
		hCultures	= this.cultures;
	if (!vName) {
		return this.findClosestCulture(this.cultureSelector) || hCultures["default"];
	}
	if (typeof vName == "string") {
		vName	= vName.split(',');
	}
	if (fIsArray(vName)) {
		var sLanguage, sName,
			nIndex,
			nLength	= vName.length,
			aPrioritized	= [];
		for (nIndex = 0; nIndex < nLength; nIndex++) {
			sName	= fTrim(vName[nIndex]);
			var nPriority, aName	= sName.split(';');
			sLanguage	= fTrim(aName[0]);
			if (aName.length === 1) {
				nPriority	= 1;
			}
			else {
				sName	= fTrim(aName[1]);
				if (sName.indexOf('q=') === 0) {
					sName	= sName.substr(2);
					nPriority	= fParseFloat(sName);
					nPriority	= fIsNaN(nPriority) ? 0 : nPriority;
				}
				else {
					nPriority	= 1;
				}
			}
			aPrioritized.push([sLanguage, nPriority]);
		}
		aPrioritized.sort(function(a, b) {
			if (a[1] < b[1]) {
				return 1;
			} else if (a[1] > b[1]) {
				return -1;
			}
			return 0;
		});
		// exact match
		for (nIndex = 0; nIndex < nLength; nIndex++) {
			sLanguage	= aPrioritized[nIndex][0];
			oCulture	= hCultures[sLanguage];
			if (oCulture) {
				return oCulture;
			}
		}

		// neutral language match
		for (nIndex = 0; nIndex < nLength; nIndex++) {
			sLanguage	= aPrioritized[nIndex][0];
			do {
				var nLastIndex	= sLanguage.lastIndexOf('-');
				if (nLastIndex === -1) {
					break;
				}
				// strip off the last part. e.g. en-US => en
				sLanguage	= sLanguage.substr(0, nLastIndex);
				oCulture	= hCultures[sLanguage];
				if (oCulture) {
					return oCulture;
				}
			}
			while (1);
		}

		// last resort: match first culture using that language
		for (nIndex = 0; nIndex < nLength; nIndex++) {
			sLanguage	= aPrioritized[nIndex][0];
			for (var sKey in hCultures) {
				oCulture	= hCultures[sKey];
				if (oCulture.language == sLanguage) {
					return oCulture;
				}
			}
		}
	}
	else if (fIsObject(vName)) {
		return vName;
	}
	return oCulture || null;
};

oGlobalize.format	= function(vValue, sFormat, sCultureSelector) {
	var oCulture	= this.findClosestCulture(sCultureSelector);
	if (vValue instanceof cDate) {
		vValue	= fFormatDate(vValue, sFormat, oCulture);
	}
	else if (typeof vValue == "number") {
		vValue	= fFormatNumber(vValue, sFormat, oCulture);
	}
	return vValue;
};

oGlobalize.localize	= function(sKey, sCultureSelector) {
	return this.findClosestCulture(sCultureSelector).messages[sKey] ||
		this.cultures["default"].messages[sKey];
};

oGlobalize.parseDate	= function(vValue, vFormat, sCultureSelector) {
	var oCulture	= this.findClosestCulture(sCultureSelector);

	var dValue, sKey, oPatterns;
	if (vFormat) {
		if (typeof vFormat == "string") {
			vFormat	= [vFormat];
		}
		if (vFormat.length) {
			for (var nIndex = 0, nLength = vFormat.length; nIndex < nLength; nIndex++) {
				var sFormat	= vFormat[nIndex];
				if (sFormat) {
					dValue	= fParseDate(vValue, sFormat, oCulture);
					if (dValue) {
						break;
					}
				}
			}
		}
	} else {
		oPatterns	= oCulture.calendar.patterns;
		for (sKey in oPatterns) {
			dValue	= fParseDate(vValue, oPatterns[sKey], oCulture);
			if (dValue) {
				break;
			}
		}
	}

	return dValue || null;
};

oGlobalize.parseInt	= function(vValue, nRadix, sCultureSelector) {
	return fTruncate(oGlobalize.parseFloat(vValue, nRadix, sCultureSelector));
};

oGlobalize.parseFloat	= function(vValue, nRadix, sCultureSelector) {
	// nRadix argument is optional
	if (typeof nRadix != "number") {
		sCultureSelector	= nRadix;
		nRadix	= 10;
	}

	var oCulture	= this.findClosestCulture(sCultureSelector);
	var nValue	= nNaN,
		oFormat	= oCulture.numberFormat;

	if (vValue.indexOf(oFormat.currency.symbol) > -1) {
		// remove currency symbol
		vValue	= vValue.replace(oFormat.currency.symbol, '');
		// replace decimal seperator
		vValue	= vValue.replace(oFormat.currency['.'], oFormat['.']);
	}

	// trim leading and trailing whitespace
	vValue	= fTrim(vValue);

	// allow infinity or hexidecimal
	if (rRegexInfinity.test(vValue)) {
		nValue	= fParseFloat(vValue);
	}
	else if (!nRadix && rRegexHex.test(vValue)) {
		nValue	= fParseInt(vValue, 16);
	}
	else {
		// determine sign and number
		var aSignInfo	= fParseNegativePattern(vValue, oFormat, oFormat.pattern[0]),
			sSign	= aSignInfo[0],
			sValue	= aSignInfo[1];

		// #44 - try parsing as "(n)"
		if (sSign === '' && oFormat.pattern[0] !== '(n)') {
			aSignInfo	= fParseNegativePattern(vValue, oFormat, '(n)');
			sSign	= aSignInfo[0];
			sValue	= aSignInfo[1];
		}

		// try parsing as "-n"
		if (sSign === '' && oFormat.pattern[0] !== '-n') {
			aSignInfo	= fParseNegativePattern(vValue, oFormat, '-n');
			sSign	= aSignInfo[0];
			sValue	= aSignInfo[1];
		}

		sSign	= sSign || '+';

		// determine exponent and number
		var sExponent,
			sNumber,
			nExponentPosition	= sValue.indexOf('e');
		if (nExponentPosition < 0)
			nExponentPosition	= sValue.indexOf('E');
		if (nExponentPosition < 0) {
			sNumber		= sValue;
			sExponent	= null;
		}
		else {
			sNumber		= sValue.substr(0, nExponentPosition);
			sExponent	= sValue.substr(nExponentPosition + 1);
		}
		// determine decimal position
		var sInteger,
			sFraction,
			sDecimalSeparator	= oFormat['.'],
			nDecimalPosition	= sNumber.indexOf(sDecimalSeparator);
		if (nDecimalPosition < 0) {
			sInteger	= sNumber;
			sFraction	= null;
		}
		else {
			sInteger	= sNumber.substr(0, nDecimalPosition);
			sFraction	= sNumber.substr(nDecimalPosition + sDecimalSeparator.length);
		}
		// handle groups (e.g. 1,000,000)
		var sGroupSeparator	= oFormat[','];
		sInteger	= sInteger.split(sGroupSeparator).join('');
		var sAltGroupSeparator	= sGroupSeparator.replace(/\u00A0/g, ' ');
		if (sGroupSeparator !== sAltGroupSeparator) {
			sInteger	= sInteger.split(sAltGroupSeparator).join('');
		}
		// build a natively parsable number string
		var sResult	= sSign + sInteger;
		if (sFraction !== null) {
			sResult += '.' + sFraction;
		}
		if (sExponent !== null) {
			// exponent itself may have a number patternd
			var aExponentSignInfo	= fParseNegativePattern(sExponent, oFormat, '-n');
			sResult += 'e' + (aExponentSignInfo[0] || '+') + aExponentSignInfo[1];
		}
		if (rRegexParseFloat.test(sResult)) {
			nValue	= fParseFloat(sResult);
		}
	}
	return nValue;
};
/*
oGlobalize.culture = function(sCultureSelector) {
	// setter
	if (typeof sCultureSelector != "undefined") {
		this.cultureSelector = sCultureSelector;
	}
	// getter
	return this.findClosestCulture(sCultureSelector) || this.cultures["default"];
};
*/
oAmple.locale	= oGlobalize;
oGlobalize.culture	= oGlobalize.cultures["default"];

// Attaching to runtime
fEventTarget_addEventListener(oAmple_document, "configchange",	function(oEvent) {
	if (oEvent.detail == "locale") {
		var sLocale	= fDOMConfiguration_getParameter(oAmple_document.domConfig, "ample-locale");
		if (sLocale in oGlobalize.cultures) {
			oGlobalize.cultureSelector	= sLocale;
			oGlobalize.culture	= oGlobalize.findClosestCulture(sLocale) || oGlobalize.cultures["default"];
			// Dispatch localechange event to every element
			for (var sId in oDocument_all)
				if (oDocument_all.hasOwnProperty(sId)) {
					var oChangeEvent	= new cCustomEvent;
					oChangeEvent.initCustomEvent("localechange", false, false, sLocale);
					fEventTarget_dispatchEvent(oDocument_all[sId], oChangeEvent);
				}
			// Dispatch localechange event to document
			fQuery_trigger(oAmple_document, "localechange", sLocale);
		}
//->Debug
		else
			fUtilities_warn(sGUARD_NOT_FOUND_LOCALE_WRN, [sLocale]);
//<-Debug
	}
}, false);