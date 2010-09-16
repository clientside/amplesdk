/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cXLAttr(sLocalName) {
	this.localName	= sLocalName;
};

cXLAttr.prototype	= new cAMLAttr;
cXLAttr.prototype.namespaceURI	= "http://www.w3.org/1999/xlink";
cXLAttr.prototype.localName		= "#attribute";

// Register Attribute
fAmple_extend(cXLAttr);