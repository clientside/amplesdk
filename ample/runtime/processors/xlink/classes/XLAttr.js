/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXLAttr	= function(sLocalName) {
	this.localName	= sLocalName;
};

cXLAttr.prototype	= new cAttr;
cXLAttr.prototype.namespaceURI	= sNS_XLINK;
cXLAttr.prototype.localName		= "#attribute";

// Register Attribute
fAmple_extend(cXLAttr);