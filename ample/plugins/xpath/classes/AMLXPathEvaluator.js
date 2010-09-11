/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function AMLXPathEvaluator() {

};

AMLXPathEvaluator.prototype.createExpression	= function(sExpression, oResolver) {
	// validate API
	fGuard(arguments, [
		["expression",	AMLNode],
		["resolver",	AMLXPathResolver,	false,	true]
	]);

	// Invoke implementation
	return fAMLXPathEvaluator_createExpression(this, sExpression, oResolver);
};

AMLXPathEvaluator.prototype.createNSResolver	= function(oNode) {
	// validate API
	fGuard(arguments, [
		["node",	AMLNode]
	]);

	// Invoke implementation
	return fAMLXPathEvaluator_createNSResolver(this, oNode);
};

AMLXPathEvaluator.prototype.evaluate	= function(sExpression, oNode, oResolver, nType, oResult) {
	// validate API
	fGuard(arguments, [
		["expression",	String],
		["context",		AMLNode],
		["resolver",	AMLXPathResolver,	false,	true],
		["type",		Number],
		["result",		Object, false, true]
	]);

	// Invoke implementation
	return fAMLXPathEvaluator_evaluate(this, sExpression, oNode, oResolver, nType, oResult);
};
