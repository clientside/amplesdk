/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Events
aQuery.extend("bind", function(sType, fHandler, bCapture) {
	// Validate API call
	aQuery.guard(arguments, [
		["type",	window.String],
		["handler",	window.Function],
		["capture",	window.Boolean,	true]
	]);

	// Invoke implementation
	aQuery.each(this, function() {
		this.addEventListener(sType, fHandler, bCapture || false);
	});
	return this;
});

aQuery.extend("unbind", function(sType, fHandler, bCaprure) {
	// Validate API call
	aQuery.guard(arguments, [
		["type",	window.String],
		["handler",	window.Function],
		["capture",	window.Boolean,	true]
	]);

	// Invoke implementation
	aQuery.each(this, function() {
		this.removeEventListener(sType, fHandler, bCapture || false);
	});
	return this;
});