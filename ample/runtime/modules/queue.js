/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Implementation
function fQuery_queue(oQuery, sType, vData) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

function fQuery_dequeue(oQuery, sType) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

function fQuery_delay(oQuery, sType) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// Public functions
oAmple.queue	= function(oElement, sType, vData) {
	return fQuery_queue.apply(new cQuery(oElement), arguments);
};

oAmple.dequeue	= function(oElement, sType) {
	return fQuery_dequeue.apply(new cQuery(oElement), arguments);
};

cQuery.prototype.queue	= function(sType, vData) {
	return fQuery_queue.apply(this, arguments);
};

cQuery.prototype.dequeue	= function(sType) {
	return fQuery_dequeue.apply(this, arguments);
};

cQuery.prototype.delay	= function(nDelay, sType) {
	return fQuery_delay.apply(this, arguments);
};
