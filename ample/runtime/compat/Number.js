/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// JavaScript 1.5
// Adds method where it is not available or fixes existing if malfunctioning
if (!cNumber.prototype.toFixed || ((0.6).toFixed(1) != '1'))
	fExporter_export(function(nPrecision) {
		var nPower	= cMath.pow(10, nPrecision || 0),
			sValue	= cString(cMath.round(this * nPower) / nPower);
		if (nPrecision > 0) {
			// Pad decimal zeros if missing
			var aValue	= sValue.split('.');
			if (aValue.length < 2)
				sValue	+= '.' + new cArray(nPrecision + 1).join('0');
			else
			if (nPrecision > aValue[1].length)
				sValue	+= new cArray(nPrecision + 1 - aValue[1].length).join('0');
		}
		return sValue;
	}, "toFixed", cNumber.prototype);