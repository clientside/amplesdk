/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXPathEvaluator	= function() {

};

var cError	= window.Error,
	oUADocument	= window.document;

// Create static context
var oXPathContext	= {};//new cStaticContext;
oXPathContext.baseURI	= oUADocument.location.href;
oXPathContext.defaultFunctionNamespace	= "http://www.w3.org/2005/xpath-functions";
oXPathContext.defaultElementNamespace	= "http://www.w3.org/1999/xhtml";

//
cXPathEvaluator.prototype.createExpression	= function(sExpression, oResolver) {
//->Guard
	ample.guard(arguments, [
		["expression",	cString],
		["resolver",	cObject,	true,	true]
	]);
//<-Guard

	oXPathContext.namespaceResolver	= oResolver;

	// Invoke implementation
	return new cXPathExpression(sExpression, oXPathContext);
};

cXPathEvaluator.prototype.createNSResolver	= function(oNode) {
//->Guard
	ample.guard(arguments, [
		["node",	ample.classes.Node]
	]);
//<-Guard

	// Invoke implementation
	return new cXPathNSResolver(oNode);
};

cXPathEvaluator.prototype.evaluate	= function(sExpression, oNode, oResolver, nType, oResult) {
//->Guard
	ample.guard(arguments, [
		["expression",	cString],
		["context",		ample.classes.Node],
		["resolver",	cObject,		true,	true],
		["type",		cNumber,		true,	true],
		["result",		cXPathResult,	true,	true]
	]);
//<-Guard

	// Invoke implementation
	return fXPathExpression_evaluate(cXPathEvaluator.prototype.createExpression.call(this, sExpression, oResolver), oNode, nType, oResult);
};

//
ample.publish(cXPathEvaluator,	"XPathEvaluator");
//
ample.extend(ample.classes.Document.prototype, cXPathEvaluator.prototype);
