/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Private members
function fAmple_transform(oXml, oXsl, fCallback, aParameters) {

};

// Extend ample object
ample.extend({
	xslt:	function(vXml, vXsl, fCallback) {
		// validate API
		ample.guard(arguments, [
			["xml", 		Object],
			["xsl", 		Object],
			["callback",	Function,	true],
			["parameters",	Array,		true,	true]
		]);

		// Invoke Implementation
		var oXSLTProcessor	= new XSLTProcessor;

		//
		return oXSLTProcessor;
	}
});

// Extend collection object
ample.extend({
	xslt:	function(vXml, vXsl) {
		// validate API
		ample.guard(arguments, [
			["xml", 		Object],
			["xsl", 		Object],
			["callback",	Function,	true],
			["parameters",	Array,		true,	true]
		]);

		// Invoke Implementation
		var oXSLTProcessor	= new XSLTProcessor;

		//
		return this;
	}
}, AMLQuery.prototype);
