/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// JavaScript 1.5
if (!cDate.now)
	fExporter_export(function() {
		return +new cDate;
	}, "now", cDate);

// JavaScript 1.8.5
function fDate_pad(nValue) {
	return new cArray(1 - cString(nValue).length +(arguments[1] || 2)).join('0') + nValue;
};

function fDate_toISOString(oDate) {
	return oDate.getUTCFullYear() +
		'-' + fDate_pad(oDate.getUTCMonth() + 1) +
		'-' + fDate_pad(oDate.getUTCDate()) +
		'T' + fDate_pad(oDate.getUTCHours()) +
		':' + fDate_pad(oDate.getUTCMinutes()) +
		':' + fDate_pad(oDate.getUTCSeconds()) +
		'.' + fDate_pad(oDate.getUTCMilliseconds(), 3) +
		'Z';
};

if (!cDate.prototype.toJSON)
	fExporter_export(function() {
		return fDate_toISOString(this);
	}, "toJSON", cDate.prototype);

// ECMA Script 5
if (!cDate.prototype.toISOString)
	fExporter_export(function() {
		return fDate_toISOString(this);
	}, "toISOString", cDate.prototype);
