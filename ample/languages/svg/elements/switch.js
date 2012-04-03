/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_switch	= function(){};
cSVGElement_switch.prototype	= new cSVGElement("switch");

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_switch.prototype.$mapAttribute	= function(sName, sValue) {
		// No implementation
	};
};

// Register Element
ample.extend(cSVGElement_switch);
