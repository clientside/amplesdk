/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cAMLXPathNSResolver(oNode) {
	this.$node	= oNode;
};

cAMLXPathNSResolver.prototype.lookupNamespaceURI	= function(sPrefix) {
	// validate API
	ample.guard(arguments, [
		["expression",	String]
	]);

	// Invoke implementation
	return this.$node.lookupNamespaceURI(sPrefix);
};