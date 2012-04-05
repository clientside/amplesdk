/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_pattern	= function(){};
cSVGElement_pattern.prototype	= new cSVGElement("pattern");

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_pattern.prototype.$mapAttribute	= function(sName, sValue) {
		// No implementation
	};
};

// Register Element
ample.extend(cSVGElement_pattern);
