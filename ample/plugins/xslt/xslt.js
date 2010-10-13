/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Private members
function fAmple_transform(oXml, oXsl) {

};

// Extend ample object
ample.extend({
	xslt:	function(vXml, vXsl, fCallback) {
		// validate API
		ample.guard(arguments, [
			["xml", 	Object],
			["xsl", 	Object],
			["callback",Function,	true]
		]);

		// Invoke Implementation
	}
});

// Extend collection object
ample.extend({
	xslt:	function(vXml, vXsl) {
		// validate API
		ample.guard(arguments, [
			["xml", 	Object],
			["xsl", 	Object]
		]);

		// Invoke Implementation
	}
}, AMLQuery.prototype);
