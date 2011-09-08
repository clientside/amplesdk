/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2011 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// JavaScript 1.5
if (!cDate.now)
	fExporter_export(function(sKey) {
		return +new cDate;
	}, "now", cDate);

// JavaScript 1.8.5
function fDate_doublizeInteger(n) {
	// Format integers to have at least two digits.
	return n < 10 ? '0' + n : n;
};

if (!cDate.prototype.toJSON)
	fExporter_export(function(sKey) {
		return this.getUTCFullYear()	+ '-' +
			fDate_doublizeInteger(this.getUTCMonth() + 1)	+ '-' +
			fDate_doublizeInteger(this.getUTCDate())		+ 'T' +
			fDate_doublizeInteger(this.getUTCHours())		+ ':' +
			fDate_doublizeInteger(this.getUTCMinutes())		+ ':' +
			fDate_doublizeInteger(this.getUTCSeconds())		+ 'Z';
	}, "toJSON", cDate.prototype);