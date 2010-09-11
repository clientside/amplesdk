/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cAMLXPathExpression(sExpression, oResolver) {
	this.$expression	= sExpression;
	this.$resolver		= oResolver;
};

cAMLXPathExpression.prototype.evaluate	= function(oNode, nType, oResult) {
	// validate API
	fGuard(arguments, [
		["context",		AMLNode],
		["type",		Number,	true,	true],
		["result",		Object, true,	true]
	]);

	var oResult	= new cAMLXPathResult;

	// Invoke implementation
	return oResult;
};