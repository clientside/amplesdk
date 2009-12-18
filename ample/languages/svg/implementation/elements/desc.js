/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_desc	= function(){};
cSVGElement_desc.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// presentation
	cSVGElement_desc.prototype.$getTag	= function() {
		return '';
	};
};

// Register Element with language
oSVGNamespace.setElement("desc", cSVGElement_desc);
