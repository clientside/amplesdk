/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */
var cXPathNSResolver	= function(oNode) {
	this.node	= oNode;
};

cXPathNSResolver.prototype.lookupNamespaceURI	= function(sPrefix) {
	// validate API
//	fGuard(arguments, [
//		["expression",	cString,	true,	true]
//	]);

	// Invoke implementation
	return this.node.lookupNamespaceURI(sPrefix);
};

//
ample.publish(cXPathNSResolver,	"XPathNSResolver");
