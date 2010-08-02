/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
aQuery.extend("animate", function(oBag, nSpeed, fEasing, fCallback) {
	// Validate API call
	aQuery.guard(arguments, [
		["bag",		window.Object, true],
		["speend",	window.Object, true],
		["easing",		window.Function, true],
		["callback",	window.Function, true]
	]);

	// Invoke implementation
	return this;
});
