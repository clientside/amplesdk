/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_symbol	= function(){};
cSVGElement_symbol.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE
};

// Register Element with language
oSVGNamespace.setElement("symbol", cSVGElement_symbol);
