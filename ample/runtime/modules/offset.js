/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
cAMLQuery.prototype.offset	= function(oOffset) {
	// Validate API call
	fGuard(arguments, [
		["offset",	cObject, true]
	]);

	if (arguments.length) {
		//
		return this;
	}
	else
		return;
};

cAMLQuery.prototype.offsetParent	= function() {

};

cAMLQuery.prototype.position	= function() {

};

cAMLQuery.prototype.scrollTop	= function(nValue) {
	// Validate API call
	fGuard(arguments, [
		["value",	cNumber, true]
	]);
};

cAMLQuery.prototype.scrollLeft	= function(nValue) {
	// Validate API call
	fGuard(arguments, [
		["value",	cNumber, true]
	]);
};