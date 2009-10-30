/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cSVGElement_defs	= function(){};
cSVGElement_defs.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	cSVGElement_defs.prototype.$getTagOpen	= function() {
		return '<div style="display:none">';
	};

	cSVGElement_defs.prototype.$getTagClose	= function() {
		return '</div>';
	};
}

// Register Element with language
oSVGNamespace.setElement("defs", cSVGElement_defs);
