/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function AMLXPathExpression() {

};

AMLXPathExpression.prototype.evaluate	= function(oNode, nType, oResult) {
	// validate API
	fGuard(arguments, [
		["context",		AMLNode],
		["type",		Number],
		["result",		Object, false, true]
	]);

	// Invoke implementation
};