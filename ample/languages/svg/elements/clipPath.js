/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_clipPath	= function(){};
cSVGElement_clipPath.prototype	= new cSVGElement("clipPath");

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_clipPath.prototype.$mapAttribute	= function(sName, sValue) {
		// No implementation
	};

	cSVGElement_clipPath.prototype.$getTagOpen	= function() {
		return '<svg2vml:group style="top:0;left:0;width:100%;height:100%;display:none">';
	};

	cSVGElement_clipPath.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

// Register Element
ample.extend(cSVGElement_clipPath);
