/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_defs	= function(){};
cSVGElement_defs.prototype	= new cSVGElement("defs");

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_defs.prototype.$mapAttribute	= function(sName, sValue) {
		// No implementation
	};

	cSVGElement_defs.prototype.$getTagOpen	= function() {
		return '<svg2vml:group style="top:0;left:0;width:100%;height:100%;display:none">';
	};

	cSVGElement_defs.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
}

// Register Element
ample.extend(cSVGElement_defs);
