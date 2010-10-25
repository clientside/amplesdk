/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

/*
 * Globalization
 * http://github.com/nje/jquery-glob
 */

var oGlobalization = {},
	oCultures	= oGlobalization.cultures	= {},
    oLocales	= oGlobalization.locales	= {};

oGlobalization.extend = function(bDeep) {
    var oTarget = arguments[1] || {};
    for (var nIndex = 2, nLength = arguments.length; nIndex < nLength; nIndex++) {
        var oSource = arguments[nIndex];
        if (oSource) {
            for (var sKey in oSource) {
                var oSourceVal = oSource[sKey];
                if (typeof oSourceVal != "undefined") {
                    if (bDeep && (typeof oSourceVal == "object" || fGuard_instanceOf(oSourceVal, cArray))) {
                        var oTargetVal = oTarget[sKey];
                        // extend onto the existing value, or create a new one
                        oTargetVal = oTargetVal && (typeof oTargetVal == "object" || fGuard_instanceOf(oTargetVal, cArray))
                            ? oTargetVal
                            : (fGuard_instanceOf(oSourceVal, cArray) ? [] : {});
                        oTarget[sKey] = oGlobalization.extend(true, oTargetVal, oSourceVal);
                    }
                    else
                        oTarget[sKey] = oSourceVal;
                }
            }
        }
    }
    return oTarget;
};

oGlobalization.findClosestCulture = function(vName) {
    var aMatch;
    if (!vName)
        return this.culture || oCultures["default"];
    if (fGuard_instanceOf(vName, cString))
        vName = vName.split(',');
    if (fGuard_instanceOf(vName, cArray)) {
        var sLang,
            aList = vName,
            nIndex, nLength = aList.length,
            aPrioritized = [];
        for (nIndex = 0; nIndex < nLength; nIndex++) {
            vName = fString_trim(aList[nIndex]);
            var nPriority, aParts = vName.split(';'), oPriority;
            sLang = fString_trim(aParts[0]);
            if (aParts.length === 1)
                nPriority = 1;
            else {
                vName = fString_trim(aParts[1]);
                if (vName.indexOf('q=') === 0) {
                    vName = vName.substr(2);
                    nPriority = fParseFloat(vName, 10);
                    nPriority = fIsNaN(nPriority) ? 0 : nPriority;
                }
                else
                    nPriority = 1;
            }
            oPriority	= {};
            oPriority.lang	= sLang;
            oPriority.pri	= nPriority;
            aPrioritized.push(oPriority);
        }
        aPrioritized.sort(function(a, b) {
            return a.pri < b.pri ? 1 : -1;
        });
        for (nIndex = 0; nIndex < nIndex; nIndex++) {
            sLang = aPrioritized[nIndex].lang;
            aMatch = oCultures[sLang];
            // exact match?
            if (aMatch)
                return aMatch;
        }
        for (nIndex = 0; nIndex < nLength; nIndex++) {
            sLang = aPrioritized[nIndex].lang;
            // for each entry try its neutral language
            do {
                var nLastIndex = sLang.lastIndexOf('-');
                if (nLastIndex === -1)
                    break;
                // strip off the last part. e.g. en-US => en
                sLang = sLang.substr(0, nLastIndex);
                aMatch = oCultures[sLang];
                if (aMatch)
                    return aMatch;
            }
            while (1);
        }
    }
    else
    if (typeof vName == 'object')
        return vName;
    return aMatch || null;
};
/*
oGlobalization.preferCulture = function(vName) {
    this.culture = this.findClosestCulture(vName) || oCultures["default"];
};
*/
oGlobalization.localize = function(sKey, oCulture, sValue) {
    if (typeof oCulture == "string") {
    	var sCulture = oCulture || "default";
        if (oCultures[sCulture])
        	oCulture = oCultures[sCulture];
        else {
        	oCulture	= {};
        	oCulture.name	= sCulture;
        }
    }
    var oLocal = oLocales[oCulture.name];
    if (arguments.length === 3) {
        if (!oLocal)
            oLocal = oLocales[oCulture.name] = {};
        oLocal[sKey] = sValue;
    }
    else {
        if (oLocal)
        	sValue = oLocal[sKey];
        if (typeof sValue == "undefined") {
            var aLanguage = oLocales[oCulture.language];
            if (aLanguage)
            	sValue = aLanguage[sKey];
            if (typeof sValue == "undefined")
            	sValue = oLocales["default"][sKey];
        }
    }
    return typeof sValue == "undefined" ? null : sValue;
};

oGlobalization.format = function(vValue, sFormat, oCulture) {
    oCulture = this.findClosestCulture(oCulture);
    if (typeof vValue == "number")
    	vValue = fFormatNumber(vValue, sFormat, oCulture);
    else
    if (vValue instanceof cDate)
    	vValue = fFormatDate(vValue, sFormat, oCulture);
    return vValue;
};

oGlobalization.parseInt = function(vValue, nRadix, oCulture) {
    return cMath.floor(this.parseFloat(vValue, nRadix, oCulture));
};

oGlobalization.parseFloat = function(vValue, nRadix, oCulture) {
    oCulture = this.findClosestCulture(oCulture);
    var nReturn = nNaN,
        oNumberFormat = oCulture.numberFormat;

    // trim leading and trailing whitespace
    vValue = fString_trim(vValue);

    // allow infinity or hexidecimal
    if (rInfinity.test(vValue))
    	nReturn = fParseFloat(vValue, nRadix);
    else
    if (!nRadix && rHex.test(vValue))
    	nReturn = fParseInt(vValue, 16);
    else {
        var aSignInfo = fParseNegativePattern(vValue, oNumberFormat, oNumberFormat.pattern[0]),
            sSign = aSignInfo[0],
            sNum = aSignInfo[1];
        // determine sign and number
        if (sSign === '' && oNumberFormat.pattern[0] !== '-n') {
            aSignInfo = fParseNegativePattern(vValue, oNumberFormat, '-n');
            sSign = aSignInfo[0];
            sNum = aSignInfo[1];
        }
        sSign = sSign || '+';
        // determine exponent and number
        var nExponent,
            sIntAndFraction,
            nExponentPos = sNum.indexOf('e');
        if (nExponentPos < 0) nExponentPos = sNum.indexOf('E');
        if (nExponentPos < 0) {
            sIntAndFraction = sNum;
            nExponent = null;
        }
        else {
            sIntAndFraction = sNum.substr(0, nExponentPos);
            nExponent = sNum.substr(nExponentPos + 1);
        }
        // determine decimal position
        var sInteger,
            sFraction,
            sDecSep = oNumberFormat['.'],
            nDecimalPos = sIntAndFraction.indexOf(sDecSep);
        if (nDecimalPos < 0) {
            sInteger = sIntAndFraction;
            sFraction = null;
        }
        else {
            sInteger = sIntAndFraction.substr(0, nDecimalPos);
            sFraction = sIntAndFraction.substr(nDecimalPos + sDecSep.length);
        }
        // handle groups (e.g. 1,000,000)
        var sGroupSep = oNumberFormat[','];
        sInteger = sInteger.split(sGroupSep).join('');
        var sAltGroupSep = sGroupSep.replace(/\u00A0/g, ' ');
        if (sGroupSep !== sAltGroupSep)
            sInteger = sInteger.split(sAltGroupSep).join('');
        // build a natively parsable number string
        var sParseable = sSign + sInteger;
        if (sFraction !== null)
            sParseable += '.' + sFraction;
        if (nExponent !== null) {
            // exponent itself may have a number patternd
            var aExpSignInfo = fParseNegativePattern(nExponent, oNumberFormat, '-n');
            sParseable += 'e' + (aExpSignInfo[0] || '+') + aExpSignInfo[1];
        }
        if (rParseFloat.test(sParseable))
        	nReturn = fParseFloat(sParseable);
    }
    return nReturn;
};

oGlobalization.parseDate = function(vValue, aFormats, oCulture) {
    oCulture = this.findClosestCulture(oCulture);

    var dDate, sKey, oPatterns;
    if (aFormats) {
        if (typeof aFormats == "string")
            aFormats = [aFormats];
        if (aFormats.length) {
            for (var nIndex = 0, nLength = aFormats.length; nIndex < nLength; nIndex++) {
                var sFormat = aFormats[nIndex];
                if (sFormat) {
                    dDate = fParseExact(vValue, sFormat, oCulture);
                    if (dDate)
                        break;
                }
            }
        }
    }
    else {
        oPatterns = oCulture.calendar.patterns;
        for (sKey in oPatterns) {
            dDate = fParseExact(vValue, oPatterns[sKey], oCulture);
            if (dDate)
                break;
        }
    }
    return dDate || null;
};



var rTrim = /^\s+|\s+$/g,
    rInfinity = /^[+-]?infinity$/i,
    rHex = /^0x[a-f0-9]+$/i,
    rParseFloat = /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/;

function fString_startsWith(sValue, sPattern) {
    return sValue.indexOf(sPattern) === 0;
};

function fString_endsWith(sValue, sPattern) {
    return sValue.substr(sValue.length - sPattern.length) === sPattern;
};

function fString_trim(sValue) {
    return (sValue + '').replace(rTrim, '');
};

function fString_zeroPad(sValue, nCount, bLeft) {
    for (var nLength = sValue.length; nLength < nCount; nLength++)
    	sValue = (bLeft ? ('0' + sValue) : (sValue + '0'));
    return sValue;
};

// *************************************** Numbers ***************************************

function fNumber_expandNumber(nNumber, nPrecision, oFormatInfo) {
    var oGroupSizes = oFormatInfo.groupSizes,
        nCurSize = oGroupSizes[0],
        nCurGroupIndex = 1,
        nFactor = cMath.pow(10, nPrecision),
        nRounded = cMath.round(nNumber * nFactor) / nFactor;
    if (!fIsFinite(nRounded))
        nRounded = nNumber;
    nNumber = nRounded;

    var sNumberString = nNumber + '',
        sRight = '',
        aSplit = sNumberString.split(/e/i),
        nExponent = aSplit.length > 1 ? fParseInt(aSplit[1], 10) : 0;
    sNumberString = aSplit[0];
    aSplit = sNumberString.split('.');
    sNumberString = aSplit[0];
    sRight = aSplit.length > 1 ? aSplit[1] : '';

    if (nExponent > 0) {
        sRight = fString_zeroPad(sRight, nExponent, false);
        sNumberString += sRight.slice(0, nExponent);
        sRight = sRight.substr(nExponent);
    }
    else
    if (nExponent < 0) {
        nExponent = -nExponent;
        sNumberString = fString_zeroPad(sNumberString, nExponent + 1);
        sRight = sNumberString.slice(-nExponent, sNumberString.length) + sRight;
        sNumberString = sNumberString.slice(0, -nExponent);
    }

    if (nPrecision > 0)
        sRight = oFormatInfo['.'] +
            ((sRight.length > nPrecision) ? sRight.slice(0, nPrecision) : fString_zeroPad(sRight, nPrecision));
    else
        sRight = '';

    var nStringIndex = sNumberString.length - 1,
        sSep = oFormatInfo[','],
        sReturn = '';

    while (nStringIndex >= 0) {
        if (nCurSize === 0 || nCurSize > nStringIndex)
            return sNumberString.slice(0, nStringIndex + 1) + (sReturn.length ? (sSep + sReturn + sRight) : sRight);
        sReturn = sNumberString.slice(nStringIndex - nCurSize + 1, nStringIndex + 1) + (sReturn.length ? (sSep + sReturn) : '');

        nStringIndex -= nCurSize;

        if (nCurGroupIndex < oGroupSizes.length) {
            nCurSize = oGroupSizes[nCurGroupIndex];
            nCurGroupIndex++;
        }
    }
    return sNumberString.slice(0, nStringIndex + 1) + sSep + sReturn + sRight;
};


function fParseNegativePattern(sValue, oNumberFormat, sNegativePattern) {
    var sNeg = oNumberFormat['-'],
        sPos = oNumberFormat['+'],
        aReturn;
    switch (sNegativePattern) {
        case 'n -':
            sNeg = ' ' + sNeg;
            sPos = ' ' + sPos;
            // fall through
        case 'n-':
            if (fString_endsWith(sValue, sNeg))
            	aReturn = ['-', sValue.substr(0, sValue.length - sNeg.length)];
            else
            if (fString_endsWith(sValue, sPos))
            	aReturn = ['+', sValue.substr(0, sValue.length - sPos.length)];
            break;
        case '- n':
            sNeg += ' ';
            sPos += ' ';
            // fall through
        case '-n':
            if (fString_startsWith(sValue, sNeg))
            	aReturn = ['-', sValue.substr(sNeg.length)];
            else
            if (fString_startsWith(sValue, sPos))
            	aReturn = ['+', sValue.substr(sPos.length)];
            break;
        case '(n)':
            if (fString_startsWith(sValue, '(') && fString_endsWith(sValue, ')'))
            	aReturn = ['-', sValue.substr(1, sValue.length - 2)];
            break;
    }
    return aReturn || ['', sValue];
};

function fFormatNumber(sValue, sFormat, oCulture) {
    if (!sFormat || sFormat === 'i')
        return oCulture.name.length ? sValue.toLocaleString() : sValue.toString();
    sFormat = sFormat || 'D';

    var oNumberFormat = oCulture.numberFormat,
        nNumber = cMath.abs(sValue),
        nPrecision = -1,
        sPattern;
    if (sFormat.length > 1) nPrecision = fParseInt(sFormat.slice(1), 10);

    var sCurrent = sFormat.charAt(0).toUpperCase(),
        oFormatInfo;

    switch (sCurrent) {
        case 'D':
            sPattern = 'n';
            if (nPrecision !== -1) {
                nNumber = fString_zeroPad('' + nNumber, nPrecision, true);
            }
            if (sValue < 0) nNumber = -nNumber;
            break;
        case 'N':
            oFormatInfo = oNumberFormat;
            // fall through
        case 'C':
            oFormatInfo = oFormatInfo || oNumberFormat.currency;
            // fall through
        case 'P':
            oFormatInfo = oFormatInfo || oNumberFormat.percent;
            sPattern = sValue < 0 ? oFormatInfo.pattern[0] : (oFormatInfo.pattern[1] || 'n');
            if (nPrecision === -1) nPrecision = oFormatInfo.decimals;
            nNumber = fNumber_expandNumber(nNumber * (sCurrent === 'P' ? 100 : 1), nPrecision, oFormatInfo);
            break;
        default:
        	throw new cAMLException(cAMLException.AML_LOCALE_BAD_NUMBER_FORMAT, null, [sCurrent]);
    }

    var rPatternParts = /n|\$|-|%/g,
        sReturn = '';
    for (;;) {
        var nIndex = rPatternParts.lastIndex,
            aParts = rPatternParts.exec(sPattern);

        sReturn += sPattern.slice(nIndex, aParts ? aParts.index : sPattern.length);

        if (!aParts)
            break;

        switch (aParts[0]) {
            case 'n':
                sReturn += nNumber;
                break;
            case '$':
                sReturn += oNumberFormat.currency.symbol;
                break;
            case '-':
                // don't make 0 negative
                if (/[1-9]/.test(nNumber))
                    sReturn += oNumberFormat['-'];
                break;
            case '%':
                sReturn += oNumberFormat.percent.symbol;
                break;
        }
    }

    return sReturn;
};

// *************************************** Dates ***************************************

function fNumber_outOfRange(nValue, nMin, nMax) {
    return nValue < nMin || nValue > nMax;
};

function fCalendar_expandYear(oCalendar, nYear) {
    // expands 2-digit year into 4 digits.
    var dNow = new cDate(),
        nEra = fDate_getEra(dNow);
    if (nYear < 100) {
        var vTwoDigitYearMax = oCalendar.twoDigitYearMax;
        vTwoDigitYearMax = typeof vTwoDigitYearMax == "string" ? new cDate().getFullYear() % 100 + fParseInt(vTwoDigitYearMax, 10) : vTwoDigitYearMax;
        var nYearCurr = fCalendar_getEraYear(dNow, oCalendar, nEra);
        nYear += nYearCurr - (nYearCurr % 100);
        if (nYear > vTwoDigitYearMax)
            nYear -= 100;
    }
    return nYear;
};

function fDate_getEra(dDate, aEras) {
    if (!aEras) return 0;
    var nStart, nTicks = dDate.getTime();
    for (var nIndex = 0, nLength = aEras.length; nIndex < nLength; nIndex++) {
    	nStart = aEras[nIndex].start;
        if (nStart === null || nTicks >= nStart)
            return nIndex;
    }
    return 0;
};

function fToUpper(sValue) {
    // 'he-IL' has non-breaking space in weekday names.
    return sValue.split("\u00A0").join(' ').toUpperCase();
};

function fToUpperArray(aArray) {
    var aResults = [];
    for (var nIndex = 0, nLength = aArray.length; nIndex < nLength; nIndex++)
    	aResults[nIndex] = fToUpper(aArray[nIndex]);
    return aResults;
};

function fCalendar_getEraYear(dDate, oCalendar, nEra, bSortable) {
    var nYear = dDate.getFullYear();
    if (!bSortable && oCalendar.eras)
        // convert normal gregorian year to era-shifted gregorian
        // year by subtracting the era offset
        nYear -= oCalendar.eras[nEra].offset;
    return nYear;
};

function fCalendar_getDayIndex(oCalendar, sValue, bAbbr) {
    var dReturn,
        aUpperDays = oCalendar._upperDays;
    if (!aUpperDays)
        oCalendar._upperDays = aUpperDays = [
            fToUpperArray(oCalendar.days.names),
            fToUpperArray(oCalendar.days.namesAbbr),
            fToUpperArray(oCalendar.days.namesShort)
       ];
    sValue = fToUpper(sValue);
    if (bAbbr) {
    	dReturn = aUpperDays[1].indexOf(sValue);
        if (dReturn === -1)
        	dReturn = aUpperDays[2].indexOf(sValue);
    }
    else
    	dReturn = aUpperDays[0].indexOf(sValue);
    return dReturn;
};

function fCalendar_getMonthIndex(oCalendar, sValue, bAbbr) {
    var aMonthsGen = oCalendar.monthsGenitive || oCalendar.months,
        aUpperMonths = oCalendar._upperMonths,
        aUpperMonthsGen = oCalendar._upperMonthsGen;
    if (!aUpperMonths) {
        oCalendar._upperMonths = aUpperMonths = [
            fToUpperArray(oCalendar.months.names),
            fToUpperArray(oCalendar.months.namesAbbr)
        ];
        oCalendar._upperMonthsGen = aUpperMonthsGen = [
            fToUpperArray(aMonthsGen.names),
            fToUpperArray(aMonthsGen.namesAbbr)
        ];
    }
    sValue = fToUpper(sValue);
    var nIndex = (bAbbr ? aUpperMonths[1] : aUpperMonths[0]).indexOf(sValue);
    if (nIndex < 0)
    	nIndex = (bAbbr ? aUpperMonthsGen[1] : aUpperMonthsGen[0]).indexOf(sValue);
    return nIndex;
};

function fAppendPreOrPostMatch(aPreMatch, aStrings) {
    // appends pre- and post- token match strings while removing escaped characters.
    // Returns a single quote count which is used to determine if the token occurs
    // in a string literal.
    var nQuoteCount = 0,
        bEscaped = false;
    for (var nIndex = 0, nLength = aPreMatch.length; nIndex < nLength; nIndex++) {
        var sCharacter = aPreMatch.charAt(nIndex);
        switch (sCharacter) {
            case '\'':
                if (bEscaped)
                	aStrings.push("'");
                else
                    nQuoteCount++;
                bEscaped = false;
                break;
            case '\\':
                if (bEscaped)
                	aStrings.push('\\');
                bEscaped = !bEscaped;
                break;
            default:
            	aStrings.push(sCharacter);
                bEscaped = false;
                break;
        }
    }
    return nQuoteCount;
};

function fCalendar_expandFormat(oCalendar, sFormat) {
    // expands unspecified or single character date formats into the full pattern.
	sFormat = sFormat || 'F';
    var sPattern,
        oPatterns = oCalendar.patterns,
        nLength = sFormat.length;
    if (nLength === 1) {
        sPattern = oPatterns[sFormat];
        if (!sPattern)
        	throw new cAMLException(cAMLException.AML_LOCALE_BAD_DATE_FORMAT, null, [sFormat]);
        sFormat = sPattern;
    }
    else
    if (nLength === 2  && sFormat.charAt(0) === '%')
        // %X escape format -- intended as a custom format string that is only one character, not a built-in format.
    	sFormat = sFormat.charAt(1);
    return sFormat;
};

function fCalendar_getParseRegExp(oCalendar, sFormat) {
    // converts a format string into a regular expression with groups that
    // can be used to extract date fields from a date string.
    // check for a cached parse regex.
    var oParseCache = oCalendar._parseRegExp;
    if (!oParseCache)
        oCalendar._parseRegExp = oParseCache = {};
    else {
        var rReFormat = oParseCache[sFormat];
        if (rReFormat)
            return rReFormat;
    }

    // expand single digit formats, then escape regular expression characters.
    var rExpFormat = fCalendar_expandFormat(oCalendar, sFormat).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1"),
        aRegExp = ['^'],
        aGroups = [],
        nIndex = 0,
        nQuoteCount = 0,
        rTokenRegExp = fGetTokenRegExp(),
        aMatch;

    // iterate through each date token found.
    while ((aMatch = rTokenRegExp.exec(rExpFormat)) !== null) {
        var aPreMatch = rExpFormat.slice(nIndex, aMatch.index);
        nIndex = rTokenRegExp.lastIndex;

        // don't replace any matches that occur inside a string literal.
        nQuoteCount += fAppendPreOrPostMatch(aPreMatch, aRegExp);
        if (nQuoteCount % 2) {
            aRegExp.push(aMatch[0]);
            continue;
        }

        // add a regex group for the token.
        var sGroupToken = aMatch[0],
            nLength = sGroupToken.length,
            sAdd;
        switch (sGroupToken) {
            case 'dddd': case 'ddd':
            case 'MMMM': case 'MMM':
            case 'gg': case 'g':
            	sAdd = '(\\D+)';
                break;
            case 'tt': case 't':
            	sAdd = '(\\D*)';
                break;
            case 'yyyy':
            case 'fff':
            case 'ff':
            case 'f':
            	sAdd = '(\\d{' + nLength + '})';
                break;
            case 'dd': case 'd':
            case 'MM': case 'M':
            case 'yy': case 'y':
            case 'HH': case 'H':
            case 'hh': case 'h':
            case 'mm': case 'm':
            case 'ss': case 's':
            	sAdd = '(\\d\\d?)';
                break;
            case 'zzz':
            	sAdd = '([+-]?\\d\\d?:\\d{2})';
                break;
            case 'zz': case 'z':
            	sAdd = '([+-]?\\d\\d?)';
                break;
            case '/':
            	sAdd = '(\\' + oCalendar['/'] + ')';
                break;
            default:
            	throw new cAMLException(cAMLException.AML_LOCALE_BAD_DATE_FORMAT, null, [sGroupToken]);
                break;
        }
        if (sAdd)
            aRegExp.push(sAdd);
        aGroups.push(aMatch[0]);
    }
    fAppendPreOrPostMatch(rExpFormat.slice(nIndex), aRegExp);
    aRegExp.push('$');

    // allow whitespace to differ when matching formats.
    var sRegexpStr = aRegExp.join('').replace(/\s+/g, '\\s+'),
        oParseRegExp = {};
    oParseRegExp.regExp	= sRegexpStr;
    oParseRegExp.groups	= aGroups;

    // cache the regex for this format.
    return oParseCache[sFormat] = oParseRegExp;
};

function fGetTokenRegExp() {
    // regular expression for matching date and time tokens in format strings.
    return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
};

function fParseExact(sValue, sFormat, oCulture) {
    // try to parse the date string by matching against the format string
    // while using the specified culture for date field names.
    sValue = fString_trim(sValue);
    var oCalendar = oCulture.calendar,
        // convert date formats into regular expressions with groupings.
        // use the regexp to determine the input format and extract the date fields.
        oParseInfo = fCalendar_getParseRegExp(oCalendar, sFormat),
        aMatch = new cRegExp(oParseInfo.regExp).exec(sValue);
    if (aMatch === null)
        return null;
    // found a date format that matches the input.
    var aGroups = oParseInfo.groups,
        nEra = null, nYear = null, nMonth = null, nDay = null, nWeekDay = null,
        nHour = 0, nHourOffset, nMin = 0, nSec = 0, nMSec = 0, nTZMinOffset = null,
        bPMHour = false;
    // iterate the format groups to extract and set the date fields.
    for (var nGroup = 0, nLength2 = aGroups.length; nGroup < nLength2; nGroup++) {
        var oMatchGroup = aMatch[nGroup + 1];
        if (oMatchGroup) {
            var sCurrent = aGroups[nGroup],
                nCLength = sCurrent.length,
                nMatchInt = fParseInt(oMatchGroup, 10);
            switch (sCurrent) {
                case 'dd': case 'd':
                    // Day of month.
                    nDay = nMatchInt;
                    // check that date is generally in valid range, also checking overflow below.
                    if (fNumber_outOfRange(nDay, 1, 31)) return null;
                    break;
                case 'MMM':
                case 'MMMM':
                    nMonth = fCalendar_getMonthIndex(oCalendar, oMatchGroup, nCLength === 3);
                    if (fNumber_outOfRange(nMonth, 0, 11)) return null;
                    break;
                case 'M': case 'MM':
                    // Month.
                    nMonth = nMatchInt - 1;
                    if (fNumber_outOfRange(nMonth, 0, 11)) return null;
                    break;
                case 'y': case 'yy':
                case 'yyyy':
                    nYear = nCLength < 4 ? fCalendar_expandYear(oCalendar, nMatchInt) : nMatchInt;
                    if (fNumber_outOfRange(nYear, 0, 9999)) return null;
                    break;
                case 'h': case 'hh':
                    // Hours (12-hour clock).
                    nHour = nMatchInt;
                    if (nHour === 12) nHour = 0;
                    if (fNumber_outOfRange(nHour, 0, 11)) return null;
                    break;
                case 'H': case 'HH':
                    // Hours (24-hour clock).
                    nHour = nMatchInt;
                    if (fNumber_outOfRange(nHour, 0, 23)) return null;
                    break;
                case 'm': case 'mm':
                    // Minutes.
                    nMin = nMatchInt;
                    if (fNumber_outOfRange(nMin, 0, 59)) return null;
                    break;
                case 's': case 'ss':
                    // Seconds.
                    nSec = nMatchInt;
                    if (fNumber_outOfRange(nSec, 0, 59)) return null;
                    break;
                case 'tt': case 't':
                    // AM/PM designator.
                    // see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
                    // the AM tokens. If not, fail the parse for this format.
                    bPMHour = oCalendar.PM && (oMatchGroup === oCalendar.PM[0] || oMatchGroup === oCalendar.PM[1] || oMatchGroup === oCalendar.PM[2]);
                    if (!bPMHour && (!oCalendar.AM || (oMatchGroup !== oCalendar.AM[0] && oMatchGroup !== oCalendar.AM[1] && oMatchGroup !== oCalendar.AM[2]))) return null;
                    break;
                case 'f':
                    // Deciseconds.
                case 'ff':
                    // Centiseconds.
                case 'fff':
                    // Milliseconds.
                    nMSec = nMatchInt * cMath.pow(10, 3-nCLength);
                    if (fNumber_outOfRange(nMSec, 0, 999)) return null;
                    break;
                case 'ddd':
                    // Day of week.
                case 'dddd':
                    // Day of week.
                    nWeekDay = fCalendar_getDayIndex(oCalendar, oMatchGroup, nCLength === 3);
                    if (fNumber_outOfRange(nWeekDay, 0, 6)) return null;
                    break;
                case 'zzz':
                    // Time zone offset in +/- hours:min.
                    var aOffsets = oMatchGroup.split(/:/);
                    if (aOffsets.length !== 2) return null;
                    nHourOffset = fParseInt(aOffsets[0], 10);
                    if (fNumber_outOfRange(nHourOffset, -12, 13)) return null;
                    var nMinOffset = fParseInt(aOffsets[1], 10);
                    if (fNumber_outOfRange(nMinOffset, 0, 59)) return null;
                    nTZMinOffset = (nHourOffset * 60) + (fString_startsWith(oMatchGroup, '-') ? -nMinOffset : nMinOffset);
                    break;
                case 'z': case 'zz':
                    // Time zone offset in +/- hours.
                    nHourOffset = nMatchInt;
                    if (fNumber_outOfRange(nHourOffset, -12, 13)) return null;
                    nTZMinOffset = nHourOffset * 60;
                    break;
                case 'g': case 'gg':
                    var sEraName = oMatchGroup;
                    if (!sEraName || !oCalendar.eras) return null;
                    sEraName = fString_trim(sEraName.toLowerCase());
                    for (var nIndex = 0, nLength = oCalendar.eras.length; nIndex < nLength; i++) {
                        if (sEraName === oCalendar.eras[nIndex].name.toLowerCase()) {
                            nEra = nIndex;
                            break;
                        }
                    }
                    // could not find an era with that name
                    if (nEra === null) return null;
                    break;
            }
        }
    }
    var dResult = new cDate(), nDefaultYear, oConvert = oCalendar.convert;
    nDefaultYear = oConvert ? oConvert.fromGregorian(dResult)[0] : dResult.getFullYear();
    if (nYear === null)
        nYear = nDefaultYear;
    else
    if (oCalendar.eras)
        // year must be shifted to normal gregorian year
        // but not if year was not specified, its already normal gregorian
        // per the main if clause above.
        nYear += oCalendar.eras[(nEra || 0)].offset;
    // set default day and month to 1 and January, so if unspecified, these are the defaults
    // instead of the current day/month.
    if (nMonth === null)
        nMonth = 0;
    if (nDay === null)
        nDay = 1;
    // now have year, month, and date, but in the culture's calendar.
    // coConvertto gregorian if necessary
    if (oConvert) {
        dResult = oConvert.toGregorian(nYear, nMonth, nDay);
        // conversion failed, must be an invalid match
        if (dResult === null) return null;
    }
    else {
        // have to set year, month and date together to avoid overflow based on current date.
        dResult.setFullYear(nYear, nMonth, nDay);
        // check to see if date overflowed for specified month (only checked 1-31 above).
        if (dResult.getDate() !== nDay) return null;
        // invalid day of week.
        if (nWeekDay !== null && dResult.getDay() !== nWeekDay) return null;
    }
    // if pm designator token was found make sure the hours fit the 24-hour clock.
    if (bPMHour && nHour < 12)
        nHour += 12;
    dResult.setHours(nHour, nMin, nSec, nMSec);
    if (nTZMinOffset !== null) {
        // adjust timezone to utc before applying local offset.
        var nAdjustedMin = dResult.getMinutes() - (nTZMinOffset + dResult.getTimezoneOffset());
        // Safari limits hours and minutes to the range of -127 to 127.  We need to use setHours
        // to ensure both these fields will not exceed this range.  nAdjustedMin will range
        // somewhere between -1440 and 1500, so we only need to split this into hours.
        dResult.setHours(dResult.getHours() + fParseInt(nAdjustedMin / 60, 10), nAdjustedMin % 60);
    }
    return dResult;
};

function fFormatDate(dValue, sFormat, oCulture) {
    var oCalendar = oCulture.calendar,
        oConvert = oCalendar.convert;
    if (!sFormat || !sFormat.length || sFormat === 'i') {
        var sReturn;
        if (oCulture && oCulture.name.length) {
            if (oConvert)
                // non-gregorian calendar, so we cannot use built-in toLocaleString()
            	sReturn = fFormatDate(dValue, oCalendar.patterns.F, oCulture);
            else {
                var dEraDate = new cDate(dValue.getTime()),
                    nEra = fDate_getEra(dValue, oCalendar.eras);
                dEraDate.setFullYear(fCalendar_getEraYear(dValue, oCalendar, nEra));
                sReturn = dEraDate.toLocaleString();
            }
        }
        else
        	sReturn = dValue.toString();
        return sReturn;
    }

    var aEras = oCalendar.eras,
        bSortable = sFormat === 's';
    sFormat = fCalendar_expandFormat(oCalendar, sFormat);

    // Start with an empty string
    var aReturn = [];
    var nHour,
        aZerros = ['0','00','000'],
        bFoundDay,
        bCheckedDay,
        rDayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
        nQuoteCount = 0,
        rTokenRegExp = fGetTokenRegExp(),
        aConverted;

    function fPadZeros(nValue, nCount) {
        var sReturn, sValue = nValue + '';
        if (nCount > 1 && sValue.length < nCount) {
        	sReturn = (aZerros[nCount - 2] + sValue);
            return sReturn.substr(sReturn.length - nCount, nCount);
        }
        else
        	sReturn = sValue;
        return sReturn;
    };

    function fHasDay() {
        if (bFoundDay || bCheckedDay)
            return bFoundDay;
        bFoundDay = rDayPartRegExp.test(sFormat);
        bCheckedDay = true;
        return bFoundDay;
    };

    function fGetPart(dDate, nPart) {
        if (aConverted)
            return aConverted[nPart];
        switch (nPart) {
            case 0: return dDate.getFullYear();
            case 1: return dDate.getMonth();
            case 2: return dDate.getDate();
        }
    };

    if (!bSortable && oConvert)
        aConverted = oConvert.fromGregorian(dValue);

    for (;;) {
        // Save the current index
        var nIndex = rTokenRegExp.lastIndex,
            // Look for the next pattern
            aArray = rTokenRegExp.exec(sFormat);

        // Append the text before the pattern (or the end of the string if not found)
        var aPreMatch = sFormat.slice(nIndex, aArray ? aArray.index : sFormat.length);
        nQuoteCount += fAppendPreOrPostMatch(aPreMatch, aReturn);

        if (!aArray)
            break;

        // do not replace any matches that occur inside a string literal.
        if (nQuoteCount % 2) {
        	aReturn.push(aArray[0]);
            continue;
        }

        var sCurrent = aArray[0],
            nCLength = sCurrent.length;

        switch (sCurrent) {
            case 'ddd':
                //Day of the week, as a three-letter abbreviation
            case 'dddd':
                // Day of the week, using the full name
                var aNames = (nCLength === 3) ? oCalendar.days.namesAbbr : oCalendar.days.names;
                aReturn.push(aNames[dValue.getDay()]);
                break;
            case 'd':
                // Day of month, without leading zero for single-digit days
            case 'dd':
                // Day of month, with leading zero for single-digit days
                bFoundDay = true;
                aReturn.push(fPadZeros(fGetPart(dValue, 2), nCLength));
                break;
            case 'MMM':
                // Month, as a three-letter abbreviation
            case 'MMMM':
                // Month, using the full name
                var nPart = fGetPart(dValue, 1);
                aReturn.push((oCalendar.monthsGenitive && fHasDay())
                    ? oCalendar.monthsGenitive[nCLength === 3 ? "namesAbbr" : "names"][nPart]
                    : oCalendar.months[nCLength === 3 ? "namesAbbr" : "names"][nPart]);
                break;
            case 'M':
                // Month, as digits, with no leading zero for single-digit months
            case 'MM':
                // Month, as digits, with leading zero for single-digit months
            	aReturn.push(fPadZeros(fGetPart(dValue, 1) + 1, nCLength));
                break;
            case 'y':
                // Year, as two digits, but with no leading zero for years less than 10
            case 'yy':
                // Year, as two digits, with leading zero for years less than 10
            case 'yyyy':
                // Year represented by four full digits
                nPart = aConverted ? aConverted[0] : fCalendar_getEraYear(dValue, oCalendar, fDate_getEra(dValue, aEras), bSortable);
                if (nCLength < 4)
                    nPart = nPart % 100;
                aReturn.push(fPadZeros(nPart, nCLength));
                break;
            case 'h':
                // Hours with no leading zero for single-digit hours, using 12-hour clock
            case 'hh':
                // Hours with leading zero for single-digit hours, using 12-hour clock
                nHour = dValue.getHours() % 12;
                if (nHour === 0) nHour = 12;
                aReturn.push(fPadZeros(nHour, nCLength));
                break;
            case 'H':
                // Hours with no leading zero for single-digit hours, using 24-hour clock
            case 'HH':
                // Hours with leading zero for single-digit hours, using 24-hour clock
            	aReturn.push(fPadZeros(dValue.getHours(), nCLength));
                break;
            case 'm':
                // Minutes with no leading zero  for single-digit minutes
            case 'mm':
                // Minutes with leading zero  for single-digit minutes
            	aReturn.push(fPadZeros(dValue.getMinutes(), nCLength));
                break;
            case 's':
                // Seconds with no leading zero for single-digit seconds
            case 'ss':
                // Seconds with leading zero for single-digit seconds
            	aReturn.push(fPadZeros(dValue.getSeconds(), nCLength));
                break;
            case 't':
                // One character am/pm indicator ("a" or "p")
            case 'tt':
                // Multicharacter am/pm indicator
                nPart = dValue.getHours() < 12 ? (oCalendar.AM ? oCalendar.AM[0] : ' ') : (oCalendar.PM ? oCalendar.PM[0] : ' ');
                aReturn.push(nCLength === 1 ? nPart.charAt(0) : nPart);
                break;
            case 'f':
                // Deciseconds
            case 'ff':
                // Centiseconds
            case 'fff':
                // Milliseconds
            	aReturn.push(fPadZeros(dValue.getMilliseconds(), 3).substr(0, nCLength));
                break;
            case 'z':
                // Time zone offset, no leading zero
            case 'zz':
                // Time zone offset with leading zero
                nHour = dValue.getTimezoneOffset() / 60;
                aReturn.push((nHour <= 0 ? '+' : '-') + fPadZeros(cMath.floor(cMath.abs(nHour)), nCLength));
                break;
            case 'zzz':
                // Time zone offset with leading zero
                nHour = dValue.getTimezoneOffset() / 60;
                aReturn.push((nHour <= 0 ? '+' : '-') + fPadZeros(cMath.floor(cMath.abs(nHour)), 2) +
                    // Hard coded ":" separator, rather than using oCalendar.TimeSeparator
                    // Repeated here for consistency, plus ":" was already assumed in date parsing.
                    ':' + fPadZeros(cMath.abs(dValue.getTimezoneOffset() % 60), 2));
                break;
            case 'g':
            case 'gg':
                if (oCalendar.eras)
                	aReturn.push(oCalendar.eras[fDate_getEra(dValue, aEras)].name);
                break;
	        case '/':
	        	aReturn.push(oCalendar['/']);
	            break;
	        default:
	        	throw new cAMLException(cAMLException.AML_LOCALE_BAD_DATE_FORMAT, null, [sCurrent]);
	            break;
        }
    }
    return aReturn.join('');
};

// 1.    When defining a culture, all fields are required except the ones stated as optional.
// 2.    You can use Globalization.extend to copy an existing culture and provide only the differing values,
//       a good practice since most cultures do not differ too much from the 'default' culture.
//       DO use the 'default' culture if you do this, as it is the only one that definitely
//       exists.
// 3.    Other plugins may add to the culture information provided by extending it. However,
//       that plugin may extend it prior to the culture being defined, or after. Therefore,
//       do not overwrite values that already exist when defining the baseline for a culture,
//       by extending your culture object with the existing one.
// 4.    Each culture should have a ".calendars" object with at least one calendar named "standard"
//       which serves as the default calendar in use by that culture.
// 5.    Each culture should have a ".calendar" object which is the current calendar being used,
//       it may be dynamically changed at any time to one of the calendars in ".calendars".

// To define a culture, use the following pattern, which handles defining the culture based
// on the 'default culture, extending it with the existing culture if it exists, and defining
// it if it does not exist.
// Globalization.cultures.foo = Globalization.extend(true, Globalization.extend(true, {}, Globalization.cultures['default'], fooCulture), Globalization.cultures.foo)

var oDefaultCulture = {};
    // A unique name for the culture in the form <language code>-<country/region code>
oDefaultCulture.name	= 'en';
    // the name of the culture in the english language
oDefaultCulture.englishName	= 'English';
    // the name of the culture in its own language
oDefaultCulture.nativeName	= 'English';
    // whether the culture uses right-to-left text
oDefaultCulture.isRTL	= false;
    // 'language' is used for so-called "specific" cultures.
    // For example, the culture "es-CL" means "Spanish, in Chili".
    // It represents the Spanish-speaking culture as it is in Chili,
    // which might have different formatting rules or even translations
    // than Spanish in Spain. A "neutral" culture is one that is not
    // specific to a region. For example, the culture "es" is the generic
    // Spanish culture, which may be a more generalized version of the language
    // that may or may not be what a specific culture expects.
    // For a specific culture like "es-CL", the 'language' field refers to the
    // neutral, generic culture information for the language it is using.
    // This is not always a simple matter of the string before the dash.
    // For example, the "zh-Hans" culture is netural (Simplified Chinese).
    // And the 'zh-SG' culture is Simplified Chinese in Singapore, whose lanugage
    // field is "zh-CHS", not "zh".
    // This field should be used to navigate from a specific culture to it's
    // more general, neutral culture. If a culture is already as general as it
    // can get, the language may refer to itself.
oDefaultCulture.language	= 'en';
    // numberFormat defines general number formatting rules, like the digits in
    // each grouping, the group separator, and how negative numbers are displayed.

var oNumberFormat	=
oDefaultCulture.numberFormat	= {};
        // [negativePattern]
        // Note, numberFormat.pattern has no 'positivePattern' unlike percent and currency,
        // but is still defined as an array for consistency with them.
        //  negativePattern: one of "(n)|-n|- n|n-|n -"
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

var oPercentFormat	=
oNumberFormat.percent	= {};
            // [negativePattern, positivePattern]
            //     negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
            //     positivePattern: one of "n %|n%|%n|% n"
oPercentFormat.pattern	= ['-n ' + '%','n ' + '%'];
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
            //     negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
            //     positivePattern: one of "$n|n$|$ n|n $"
oCurrencyFormat.pattern	= ['($n)','$n'];
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
    // There should be at least one defined with name 'standard', and is the default
    // calendar used by the culture.
    // A calendar contains information about how dates are formatted, information about
    // the calendar's eras, a standard set of the date formats,
    // translations for day and month names, and if the calendar is not based on the Gregorian
    // calendar, conversion functions to and from the Gregorian calendar.
oDefaultCulture.calendars	= {};

var oCalendarFormat	=
oDefaultCulture.calendar =
oDefaultCulture.calendars.standard	= {};
            // name that identifies the type of calendar this is
oCalendarFormat.name	= 'Gregorian_USEnglish';
            // separator of parts of a date (e.g. '/' in 11/05/1955)
oCalendarFormat['/']	= '/';
            // separator of parts of a time (e.g. ':' in 05:44 PM)
oCalendarFormat[':']	= ':';
            // the first day of the week (0 = Sunday, 1 = Monday, etc)
oCalendarFormat.firstDay= 0;
oCalendarFormat.days	= {};
           // full day names
oCalendarFormat.days.names		= "Sunday;Monday;Tuesday;Wednesday;Thursday;Friday;Saturday".split(';');
                // abbreviated day names
oCalendarFormat.days.namesAbbr	= "Sun;Mon;Tue;Wed;Thu;Fri;Sat".split(';');
                // shortest day names
oCalendarFormat.days.namesShort	= "Su;Mo;Tu;We;Th;Fr;Sa".split(';');

oCalendarFormat.months	= {};
                // full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
oCalendarFormat.months.names	= "January;February;March;April;May;June;July;August;September;October;November;December;".split(';');
                // abbreviated month names
oCalendarFormat.months.namesAbbr= "Jan;Feb;Mar;Apr;May;Jun;Jul;Aug;Sep;Oct;Nov;Dec;".split(';');
            // AM and PM designators in one of these forms:
            // The usual view, and the upper and lower case versions
            //      [standard,lowercase,uppercase]
            // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
            //      null
oCalendarFormat.AM	= 'AM;am;AM'.split(';');
oCalendarFormat.PM	= 'PM;pm;PM'.split(';');
                // eras in reverse chronological order.
                // name: the name of the era in this culture (e.g. A.D., C.E.)
                // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
                // offset: offset in years from gregorian calendar
var oCalendarEra	= {};
oCalendarEra.name	= 'A.D.';
oCalendarEra.start	= null;
oCalendarEra.offset	= 0;
oCalendarFormat.eras= [oCalendarEra];
            // when a two digit year is given, it will never be parsed as a four digit
            // year greater than this year (in the appropriate era for the culture)
            // Set it as a full year (e.g. 2029) or use an offset format starting from
            // the current year: "+19" would correspond to 2029 if the current year 2010.
oCalendarFormat.twoDigitYearMax	= 2029;
            // set of predefined date and time patterns used by the culture
            // these represent the format someone in this culture would expect
            // to see given the portions of the date that are shown.
var oCalendarPatterns =
oCalendarFormat.patterns	= {};
                // short date pattern
oCalendarPatterns['d']	= 'M/d/yyyy';
                // long date pattern
oCalendarPatterns['D']	= 'dddd,' + ' MMMM dd,' + ' yyyy';
                // short time pattern
oCalendarPatterns['t']	= 'h:mm tt';
                // long time pattern
oCalendarPatterns['T']	= 'h:mm:ss tt';
                // long date, short time pattern
oCalendarPatterns['f']	= oCalendarPatterns['D'] + ' ' + oCalendarPatterns['t'];
                // long date, long time pattern
oCalendarPatterns['F']	= oCalendarPatterns['D'] + ' ' + oCalendarPatterns['T'];
                // month/day pattern
oCalendarPatterns['M']	= 'MMMM dd';
                // month/year pattern
oCalendarPatterns['Y']	= 'yyyy MMMM';
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

oLocales['en']	=
oLocales["default"] = {};

oCultures['en'] =
oCultures["default"] = oDefaultCulture;

// Extend ample object
oAmple.locale	= oGlobalization;

// Find Ample SDK location
var aElements	= oUADocument.getElementsByTagName("script"),
	sAMLQuery_baseURI	= aElements[aElements.length - 1].src;

fAMLEventTarget_addEventListener(oAmple_document, "configchange",	function(oEvent) {
	if (oEvent.detail == "locale") {
		var sCulture	= fAMLConfiguration_getParameter(oAmple_document.domConfig, "ample-locale");
		function fChangeCulture(oCulture) {
			// Set prefer culture
			oGlobalization.culture	= oCulture;
			// Dispatch localechange event
			fAMLQuery_trigger(oAmple_document, "localechange", sCulture);
		};
		var oCulture	= oCultures[sCulture];
		if (oCulture)
			fSetTimeout(function() {
				fChangeCulture(oCulture);
			}, 0);
		else {
			var oSettings	= {};
			oSettings.url	= fUtilities_resolveUri("cultures" + '/' + sCulture + ".js", sAMLQuery_baseURI);
			oSettings.success	= function(sScript) {
				// Execute locale code
				new cFunction(sScript)();
				//
				fChangeCulture(oCultures[sCulture]);
			};
			//
			fAMLQuery_ajax(oSettings);
		}
	}
}, false);