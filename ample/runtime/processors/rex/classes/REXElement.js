/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cREXElement(sLocalName) {
	this.localName	= sLocalName;
};
cREXElement.prototype	= new cAMLElement;
cREXElement.prototype.namespaceURI	= "http://www.w3.org/2006/rex";
cREXElement.prototype.localName		= "#element";

//
cREXElement.prototype.$getTag	= function() {
	return '';
};

// Register Element
fAmple_extend(cREXElement);
