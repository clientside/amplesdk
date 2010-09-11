/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cAMLXPathEvaluator() {

};

cAMLXPathEvaluator.prototype.createExpression	= function(sExpression, oResolver) {
	// validate API
	fGuard(arguments, [
		["expression",	String],
		["resolver",	cAMLXPathResolver,	true,	true]
	]);

	// Invoke implementation
	return new cAMLXPathExpression(sExpression, oResolver);
};

cAMLXPathEvaluator.prototype.createNSResolver	= function(oNode) {
	// validate API
	fGuard(arguments, [
		["node",	AMLNode]
	]);

	// Invoke implementation
	return new cAMLXPathResolver(oNode);
};

cAMLXPathEvaluator.prototype.evaluate	= function(sExpression, oNode, oResolver, nType, oResult) {
	// validate API
	fGuard(arguments, [
		["expression",	String],
		["context",		AMLNode],
		["resolver",	cAMLXPathResolver,	true,	true],
		["type",		Number,				true,	true],
		["result",		cAMLXPathResult,	true,	true]
	]);

	// Invoke implementation
	var oExpression	= new cAMLXPathExpression(sExpression, oResolver);
	return oExpression.evaluate(oNode, nType, oResult);
};
