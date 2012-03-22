/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement	= function(sLocalName) {
	this.localName	= sLocalName;
};
cAMLElement.prototype	= new cElement;
cAMLElement.prototype.namespaceURI	= sNS_AML;
cAMLElement.prototype.localName		= "#element";

//
cAMLElement.prototype.$getTag	= function() {
	return '';
};

// Register Element
fAmple_extend(cAMLElement);
