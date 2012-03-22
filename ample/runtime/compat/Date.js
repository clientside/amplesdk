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

if (!cDate.prototype.toJSON)
	fExporter_export(function() {
		return this.getUTCFullYear()	+ '-' +
			fDate_pad(this.getUTCMonth() + 1)	+ '-' +
			fDate_pad(this.getUTCDate())		+ 'T' +
			fDate_pad(this.getUTCHours())		+ ':' +
			fDate_pad(this.getUTCMinutes())		+ ':' +
			fDate_pad(this.getUTCSeconds())		+ '.' +
			fDate_pad(this.getUTCMilliseconds(), 3)	+ 'Z';
	}, "toJSON", cDate.prototype);
