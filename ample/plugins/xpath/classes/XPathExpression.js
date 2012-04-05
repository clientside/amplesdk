/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cXPathExpression(sExpression, oResolver) {
	this.$expression	= fXPathParser_parse(sExpression, 1, 1);
	this.$resolver		= oResolver;
};

cXPathExpression.prototype.evaluate	= function(oNode, nType, oResult) {
	// validate API
	ample.guard(arguments, [
		["context",		cNode],
		["type",		cNumber,	true,	true],
		["result",		cObject,	true,	true]
	]);

	// Invoke implementation
	return fXPathExpression_evaluate(this, oNode, nType, oResult);
};