/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
cAMLQuery.prototype.animate	= function(oProperties, vSpeed, sEasing, fCallback) {
	// Validate API call
	fGuard(arguments, [
		["properties",	cObject, true],
		["speed",		cObject, true],
		["easing",		cString, true],
		["callback",	cFunction, true]
	]);

	if (this.length)
		fAMLElementAnimation_play(this[0], oProperties, vSpeed, sEasing, fCallback);

	// Invoke implementation
	return this;
};

cAMLQuery.prototype.stop	= function() {
	// TODO

	return this;
};