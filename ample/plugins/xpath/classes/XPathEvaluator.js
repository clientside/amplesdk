/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cXPathEvaluator() {

};

cXPathEvaluator.prototype.createExpression	= function(sExpression, oResolver) {
	// validate API
	ample.guard(arguments, [
		["expression",	cString],
		["resolver",	cXPathNSResolver,	true,	true]
	]);

	// Invoke implementation
	return new cXPathExpression(sExpression, oResolver);
};

cXPathEvaluator.prototype.createNSResolver	= function(oNode) {
	// validate API
	ample.guard(arguments, [
		["node",	cNode]
	]);

	// Invoke implementation
	return new cXPathNSResolver(oNode);
};

cXPathEvaluator.prototype.evaluate	= function(sExpression, oNode, oResolver, nType, oResult) {
	// validate API
	ample.guard(arguments, [
		["expression",	cString],
		["context",		cNode],
		["resolver",	cXPathNSResolver,	true,	true],
		["type",		cNumber,				true,	true],
		["result",		cXPathResult,		true,	true]
	]);

	// Invoke implementation
	var oExpression	= new cXPathExpression(sExpression, oResolver);
	return oExpression.evaluate(oNode, nType || cXPathResult.ANY_TYPE, oResult);
};
