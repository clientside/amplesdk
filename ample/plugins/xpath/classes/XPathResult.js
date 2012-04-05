/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cXPathResult() {

};

// Constants
cXPathResult.ANY_TYPE		= 0;
cXPathResult.NUMBER_TYPE	= 1;
cXPathResult.STRING_TYPE	= 2;
cXPathResult.BOOLEAN_TYPE	= 3;
cXPathResult.UNORDERED_NODE_ITERATOR_TYPE	= 4;
cXPathResult.ORDERED_NODE_ITERATOR_TYPE		= 5;
cXPathResult.UNORDERED_NODE_SNAPSHOT_TYPE	= 6;
cXPathResult.ORDERED_NODE_SNAPSHOT_TYPE		= 7;
cXPathResult.ANY_UNORDERED_NODE_TYPE		= 8;
cXPathResult.FIRST_ORDERED_NODE_TYPE		= 9;

//
cXPathResult.prototype.resultType		= null;
cXPathResult.prototype.snapshotLength	= 0;
cXPathResult.prototype.stringValue		= null;
cXPathResult.prototype.booleanValue		= null;
cXPathResult.prototype.singleNodeValue	= null;
cXPathResult.prototype.invalidIteratorState	= null;

//
cXPathResult.prototype.iterateNext	= function() {

};

cXPathResult.prototype.snapshotItem	= function(nIndex) {
	// validate API
	ample.guard(arguments, [
		["index",	Number]
	]);

	// Invoke implementation
};
