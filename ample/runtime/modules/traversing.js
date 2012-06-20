/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
cQuery.prototype.children	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.closest		= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.find		= function(sQuery) {
//->Guard
	fGuard(arguments, [
		["query",	cString]
	]);
//<-Guard

	var oQuery	= new cQuery,
		aResult = fNodeSelector_query(this, sQuery);
	for (var nIndex = 0; nIndex < aResult.length; nIndex++)
		oQuery[nIndex]	= aResult[nIndex];
	oQuery.length	= aResult.length;

	return oQuery;
};

cQuery.prototype.next		= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.nextAll		= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.nextUntil	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.parent		= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.parents		= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.parentsUntil= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.prev		= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.prevAll		= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.prevUntil	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.siblings	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.contents	= function() {
	// Not to be supported
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};
