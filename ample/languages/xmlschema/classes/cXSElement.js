/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSElement	= function(sLocalName) {
	this.localName	= sLocalName;
};

cXSElement.prototype	= new ample.classes.Element;
cXSElement.prototype.namespaceURI	= "http://www.w3.org/2001/XMLSchema";
cXSElement.prototype.localName		= "#element";

//Register Element
ample.extend(cXSElement);