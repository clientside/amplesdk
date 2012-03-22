/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cXPathNSResolver(oNode) {
	this.$node	= oNode;
};

cXPathNSResolver.prototype.lookupNamespaceURI	= function(sPrefix) {
	// validate API
	ample.guard(arguments, [
		["expression",	String]
	]);

	// Invoke implementation
	return this.$node.lookupNamespaceURI(sPrefix);
};