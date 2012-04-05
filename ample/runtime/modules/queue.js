/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

oAmple.queue	= function(oElement, sType, vData) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

oAmple.dequeue	= function(oElement, sType) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.queue	= function(sType, vData) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.dequeue	= function(sType) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cQuery.prototype.delay	= function(nDelay, sType) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};