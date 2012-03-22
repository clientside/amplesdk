/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// XBLImplementationsList
var cXBLImplementationsList	= function(){};
cXBLImplementationsList.prototype.length	= 0;
cXBLImplementationsList.prototype.item	= function(nIndex) {
//->Guard
	fGuard(arguments, [
		["index",	cNumber]
	]);
//<-Guard

	if (nIndex <= this.length)
		return this[nIndex];
	else
		throw new cDOMException(cDOMException.INDEX_SIZE_ERR);
};