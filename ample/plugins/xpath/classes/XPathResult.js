/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXPathResult	= function() {

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
cXPathResult.prototype.numberValue		= null;
cXPathResult.prototype.stringValue		= null;
cXPathResult.prototype.booleanValue		= null;
cXPathResult.prototype.singleNodeValue	= null;
cXPathResult.prototype.invalidIteratorState	= false;
// Private
cXPathResult.prototype.current	= 0;

//
cXPathResult.prototype.iterateNext	= function() {
	// Invoke implementation
	if (this.resultType == 4 || this.resultType == 5) {
		return this.current < this.sequence.length ? this.sequence[this.current++] : null;
	}
	else
		throw new cXPathException(cXPathException.TYPE_ERR);
};

cXPathResult.prototype.snapshotItem	= function(nIndex) {
//->Guard
	ample.guard(arguments, [
		["index",	cNumber,	true,	true]
	]);
//<-Guard

	// Invoke implementation
	if (this.resultType == 6 || this.resultType == 7) {
		if (arguments.length == 0)
			nIndex	= 0;
		return nIndex < this.sequence.length && nIndex >-1 ? this.sequence[nIndex] : null;
	}
	else
		throw new cXPathException(cXPathException.TYPE_ERR);
};


function fXPathResult_init(oResult, nType, oSequence) {
	//
	if (oResult.resultType)
		fXPathResult_clear(oResult);
	//
	oResult.resultType	= nType;
	//
	switch (nType) {
		case 1:	// XPathResult.NUMBER_TYPE
			oResult.numberValue		= oSequence[0];
			break;

		case 2:	// XPathResult.STRING_TYPE
			oResult.stringValue		= oSequence[0];
			break;

		case 3:	// XPathResult.BOOLEAN_TYPE
			oResult.booleanValue	= oSequence[0];
			break;

		case 4:	// XPathResult.UNORDERED_NODE_ITERATOR_TYPE
		case 5:	// XPathResult.ORDERED_NODE_ITERATOR_TYPE
			oResult.sequence	= oSequence;
			break;

		case 6:	// XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE
		case 7:	// XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
			oResult.snapshotLength	= oSequence.length;
			oResult.sequence	= oSequence;
			break;

		case 8:	// XPathResult.ANY_UNORDERED_NODE_TYPE
		case 9:	// XPathResult.FIRST_ORDERED_NODE_TYPE
			oResult.singleNodeValue	= oSequence[0];
			break;
	}

	return oResult;
};

function fXPathResult_clear(oResult) {
	oResult.resultType		= null;
	oResult.snapshotLength	= 0;
	oResult.numberValue		= null;
	oResult.stringValue		= null;
	oResult.booleanValue	= null;
	oResult.singleNodeValue	= null;
	oResult.invalidIteratorState	= false;
	// Private
	oResult.current	= 0;
};

//
ample.publish(cXPathResult,		"XPathResult");
