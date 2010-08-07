/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAUIElement	= function(sLocalName) {
	this.localName	= sLocalName;
};
cAUIElement.prototype	= new AMLElement;
cAUIElement.prototype.namespaceURI	= "http://www.amplesdk.com/ns/aui";
cAUIElement.prototype.localName		= "#element";

// Register Element
ample.extend(cAUIElement);
