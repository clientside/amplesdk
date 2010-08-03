/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr	= function(sLocalName) {
	this.localName	= sLocalName;
};

cAMLAttr.prototype	= new AMLAttr;
cAMLAttr.prototype.namespaceURI	= "http://www.amplesdk.com/ns/aml";
cAMLAttr.prototype.localName		= "#attribute";

// Register Attribute
ample.extend(cAMLAttr);