/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cSVGElement_clipPath	= function(){};
cSVGElement_clipPath.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// TODO:
};

// Register Element with language
oSVGNamespace.setElement("clipPath", cSVGElement_clipPath);
