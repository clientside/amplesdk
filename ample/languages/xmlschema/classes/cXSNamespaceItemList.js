/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSNamespaceItemList	= function() {

};

cXSNamespaceItemList.prototype.length	= 0;

cXSNamespaceItemList.prototype.item	= function(nIndex) {
	// Validate arguments
	ample.guard(arguments, [
		["index",	Number]
	]);

	return nIndex < this.length ? this[nIndex] : null;
};

cXSNamespaceItemList.prototype.$add	= function(oValue) {
	this[this.length++]	= oValue;
};
