/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_marker	= function(){};
cSVGElement_marker.prototype	= new cSVGElement("marker");

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_marker.prototype.$mapAttribute	= function(sName, sValue) {
		// No implementation
	};

	// presentation
	cSVGElement_marker.prototype.$getTagOpen	= function() {
		return '<svg2vml:group style="top:0;left:0;width:100%;height:100%;display:none">';
	};

	cSVGElement_marker.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

// Register Element
ample.extend(cSVGElement_marker);
