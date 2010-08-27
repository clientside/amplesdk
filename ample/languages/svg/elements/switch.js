/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_switch	= function(){};
cSVGElement_switch.prototype	= new cSVGElement("switch");

if (cSVGElement.useVML) {
	// Implementation for IE

	cSVGElement_switch.handlers	= {

	};
};

// Register Element
ample.extend(cSVGElement_switch);
