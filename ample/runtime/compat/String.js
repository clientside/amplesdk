/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2011 Sergey Ilinsky
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