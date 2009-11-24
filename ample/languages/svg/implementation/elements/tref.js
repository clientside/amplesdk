/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cSVGElement_tref	= function(){};
cSVGElement_tref.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// TODO: Implement
};

//Register Element with language
oSVGNamespace.setElement("tref", cSVGElement_tref);