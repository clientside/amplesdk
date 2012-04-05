/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_desc	= function(){};
cSVGElement_desc.prototype	= new cSVGElement("desc");

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_desc.prototype.$mapAttribute	= function(sName, sValue) {
		// No implementation
	};

	// presentation
	cSVGElement_desc.prototype.$getTag	= function() {
		return '';
	};
};

// Register Element
ample.extend(cSVGElement_desc);
