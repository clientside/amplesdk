/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function AMLXPathResult() {

};

// Constants
AMLXPathResult.ANY_TYPE			= 0;
AMLXPathResult.NUMBER_TYPE		= 1;
AMLXPathResult.STRING_TYPE		= 2;
AMLXPathResult.BOOLEAN_TYPE		= 3;
AMLXPathResult.UNORDERED_NODE_ITERATOR_TYPE	= 4;
AMLXPathResult.ORDERED_NODE_ITERATOR_TYPE	= 5;
AMLXPathResult.UNORDERED_NODE_SNAPSHOT_TYPE	= 6;
AMLXPathResult.ORDERED_NODE_SNAPSHOT_TYPE 	= 7;
AMLXPathResult.ANY_UNORDERED_NODE_TYPE 		= 8;
AMLXPathResult.FIRST_ORDERED_NODE_TYPE		= 9;

//
AMLXPathResult.prototype.resultType		= null;
AMLXPathResult.prototype.snapshotLength	= null;
AMLXPathResult.prototype.stringValue		= null;
AMLXPathResult.prototype.booleanValue		= null;
AMLXPathResult.prototype.singleNodeValue	= null;
AMLXPathResult.prototype.invalidIteratorState	= null;

//
AMLXPathResult.prototype.iterateNext	= function() {

};

AMLXPathResult.prototype.snapshotItem	= function(nIndex) {

};
