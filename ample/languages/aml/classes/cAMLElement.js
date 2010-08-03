/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement	= function(sLocalName) {
	this.localName	= sLocalName;
};
cAMLElement.prototype	= new AMLElement;
cAMLElement.prototype.namespaceURI	= "http://www.amplesdk.com/ns/aml";
cAMLElement.prototype.localName		= "#element";

cAMLElement.prototype.AMLElement	= new AMLElement;

// Register Element
ample.extend(cAMLElement);
