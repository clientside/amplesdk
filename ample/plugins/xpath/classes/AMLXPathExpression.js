/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cAMLXPathExpression(sExpression, oResolver) {
	this.$expression	= fAMLXPathExpression_parse(this, sExpression, oResolver);
};

cAMLXPathExpression.prototype.evaluate	= function(oNode, nType, oResult) {
	// validate API
	ample.guard(arguments, [
		["context",		AMLNode],
		["type",		Number,	true,	true],
		["result",		Object, true,	true]
	]);

	// Invoke implementation
	return fAMLXPathExpression_evaluate(this, oNode, nType, oResult);
};