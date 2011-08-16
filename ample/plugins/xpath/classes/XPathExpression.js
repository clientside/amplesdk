/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cXPathExpression(sExpression, oResolver) {
	this.$expression	= fXPathExpression_parse(this, sExpression);
	this.$resolver		= oResolver;
};

cXPathExpression.prototype.evaluate	= function(oNode, nType, oResult) {
	// validate API
	ample.guard(arguments, [
		["context",		Node],
		["type",		Number,	true,	true],
		["result",		Object, true,	true]
	]);

	// Invoke implementation
	return fXPathExpression_evaluate(this, oNode, nType, oResult);
};