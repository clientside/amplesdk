/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr	= function(sLocalName) {
	this.localName	= sLocalName;
};

cAMLAttr.prototype	= new cAttr;
cAMLAttr.prototype.namespaceURI	= sNS_AML;
cAMLAttr.prototype.localName		= "#attribute";

// Register Attribute
fAmple_extend(cAMLAttr);