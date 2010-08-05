/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

if (!cXMLSerializer) {
	cXMLSerializer = function(){};
	cXMLSerializer.prototype.serializeToString = function(oNode) {
		// Validate arguments
		fGuard(arguments, [
			["node",	cXMLNode]
		]);

		return oNode.xml;
	};
};
