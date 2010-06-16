/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_marker	= function(){};
cSVGElement_marker.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE

	// presentation
	cSVGElement_marker.prototype.$getTagOpen	= function() {
		return '';
	};

	cSVGElement_marker.prototype.$getTagClose	= function() {
		return '';
	};
};

// Register Element with language
oSVGNamespace.setElement("marker", cSVGElement_marker);
