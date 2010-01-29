/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_metadata	= function(){};
cSVGElement_metadata.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE

	// presentation
	cSVGElement_metadata.prototype.$getTag	= function() {
		return '';
	};
};

// Register Element with language
oSVGNamespace.setElement("metadata", cSVGElement_metadata);
