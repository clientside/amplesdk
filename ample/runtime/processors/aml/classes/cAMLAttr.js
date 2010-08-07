/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr_prototype	= function(sLocalName) {
	this.localName	= sLocalName;
};

cAMLAttr_prototype.prototype	= new cAMLAttr;
cAMLAttr_prototype.prototype.namespaceURI	= "http://www.amplesdk.com/ns/aml";
cAMLAttr_prototype.prototype.localName		= "#attribute";

// Register Attribute
fAmple_extend(cAMLAttr_prototype);