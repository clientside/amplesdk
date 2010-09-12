/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cAMLXPathResult() {

};

// Constants
cAMLXPathResult.ANY_TYPE		= 0;
cAMLXPathResult.NUMBER_TYPE		= 1;
cAMLXPathResult.STRING_TYPE		= 2;
cAMLXPathResult.BOOLEAN_TYPE	= 3;
cAMLXPathResult.UNORDERED_NODE_ITERATOR_TYPE	= 4;
cAMLXPathResult.ORDERED_NODE_ITERATOR_TYPE		= 5;
cAMLXPathResult.UNORDERED_NODE_SNAPSHOT_TYPE	= 6;
cAMLXPathResult.ORDERED_NODE_SNAPSHOT_TYPE 		= 7;
cAMLXPathResult.ANY_UNORDERED_NODE_TYPE 		= 8;
cAMLXPathResult.FIRST_ORDERED_NODE_TYPE			= 9;

//
cAMLXPathResult.prototype.resultType		= null;
cAMLXPathResult.prototype.snapshotLength	= 0;
cAMLXPathResult.prototype.stringValue		= null;
cAMLXPathResult.prototype.booleanValue		= null;
cAMLXPathResult.prototype.singleNodeValue	= null;
cAMLXPathResult.prototype.invalidIteratorState	= null;

//
cAMLXPathResult.prototype.iterateNext	= function() {

};

cAMLXPathResult.prototype.snapshotItem	= function(nIndex) {
	// validate API
	ample.guard(arguments, [
		["index",	Number]
	]);

	// Invoke implementation
};
