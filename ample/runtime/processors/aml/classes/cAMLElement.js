/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cAMLElement_prototype(sLocalName) {
	this.localName	= sLocalName;
};
cAMLElement_prototype.prototype	= new cAMLElement;
cAMLElement_prototype.prototype.namespaceURI	= "http://www.amplesdk.com/ns/aml";
cAMLElement_prototype.prototype.localName		= "#element";

//
cAMLElement_prototype.prototype.$getTag	= function() {
	return '';
};

// Register Element
fAmple_extend(cAMLElement_prototype);
