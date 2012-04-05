/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSObjectList	= function() {

};
// This object can also be dereferenced using square bracket notation (e.g. obj[1]).
cXSObjectList.prototype.length	= 0;

cXSObjectList.prototype.item	= function(nIndex) {
	// Validate arguments
	ample.guard(arguments, [
		["node",	Number]
	]);

	return nIndex < this.length ? this[nIndex] : null;
};

cXSObjectList.prototype.$add	= function(oValue) {
	this[this.length++]	= oValue;
};
