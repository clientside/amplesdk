/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// JavaScript 1.8.1
if (!cString.prototype.trim)
	fExporter_export(function() {
		return this.replace(/^\s+|\s+$/g, '');
	}, "trim", cString.prototype);

if (!cString.prototype.trimLeft)
	fExporter_export(function() {
		return this.replace(/^\s+/, '');
	}, "trimLeft", cString.prototype);

if (!cString.prototype.trimRight)
	fExporter_export(function() {
		return this.replace(/\s+$/, '');
	}, "trimRight", cString.prototype);

// Fixes substr function in IE not supporting negative value for the start index
if ("substring".substr(-6) != "string")
	fExporter_export(function(fFunction) {
		return function(nIndex, nLength) {
			return fFunction.call(this, nIndex + (nIndex < 0 ? this.length : 0), nLength);
		};
	}(cString.prototype.substr), "substr", cString.prototype);

// Fixes split function in IE not properly handling regular expression parameters
if ("substring".split(/(b)/)[2] != "string")
	fExporter_export(function(fFunction) {
		return function (rValue) {
			//
			if (typeof rValue == "string")
				return fFunction.call(this, rValue);
			//
			var aValue = [],
				sValue = '' + this,
				aMatch;
			while (aMatch = sValue.match(rValue)) {
				aValue[aValue.length]	= sValue.substr(0, aMatch.index);
				for (var nIndex = 1, nLength = aMatch.length; nIndex < nLength; nIndex++)
					aValue[aValue.length]	= aMatch[nIndex];
				sValue = sValue.substr(aMatch.index + aMatch[0].length);
			}
			aValue[aValue.length]	= sValue;
			return aValue;
		};
	}(cString.prototype.split), "split", cString.prototype);