/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXPathExpression	= function(sExpression, oStaticContext) {
	try {
		this.staticContext	= oStaticContext;
		this.expression	= new cExpression(sExpression, oStaticContext);
	}
	catch (e) {
		if (e instanceof cException)
			throw new cXPathException(cXPathException.INVALID_EXPRESSION_ERR
//->Debug
					, '[err:' + e.code + ']' + ' ' + e.message
//<-Debug
			);
		else
			throw e;
	}
};

cXPathExpression.prototype.evaluate	= function(oNode, nType, oResult) {
//->Guard
	ample.guard(arguments, [
		["context",		ample.classes.Node],
		["type",		cNumber,	true,	true],
		["result",		cObject,	true,	true]
	]);
//<-Guard

	// Invoke implementation
	return fXPathExpression_evaluate(this, oNode, nType, oResult);
};

function fXPathExpression_evaluate(oExpression, oNode, nType, oResult) {
	if (typeof oNode == "undefined")
		oNode	= null;

	var oSequence	= [];

	// Evaluate expression
	try {
		var aSequence	= oExpression.expression.evaluate(new cDynamicContext(oExpression.staticContext, oNode, null, oDOMAdapter));
		for (var nIndex = 0, nLength = aSequence.length, oItem; nIndex < nLength; nIndex++)
			oSequence[oSequence.length]	= oDOMAdapter.isNode(oItem = aSequence[nIndex]) ? oItem : cStaticContext.xs2js(oItem);
	}
	catch (e) {
		if (e instanceof cException)
			throw new cXPathException(cXPathException.TYPE_ERR
//->Debug
					,  '[err:' + e.code + ']' + ' ' + e.message
//<-Debug
			);
		else
			throw e;
	}
	// Determine type if not specified
	if (!nType) {
		nType	= 4;	// Default: XPathResult.UNORDERED_NODE_ITERATOR_TYPE
		if (oSequence.length) {
			var sType	= typeof oSequence[0];
			if (sType == "number")
				nType	= 1;	// XPathResult.NUMBER_TYPE
			else
			if (sType == "string")
				nType	= 2;	// XPathResult.STRING_TYPE
			else
			if (sType == "boolean")
				nType	= 3;	// XPathResult.BOOLEAN_TYPE
		}
	}
	return fXPathResult_init(oResult ? fXPathResult_clear(oResult) : new cXPathResult, nType, oSequence);
};

//
ample.publish(cXPathExpression,	"XPathExpression");
