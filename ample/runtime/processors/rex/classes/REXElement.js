/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cREXElement	= function(sLocalName) {
	this.localName	= sLocalName;
};
cREXElement.prototype	= new cElement;
cREXElement.prototype.namespaceURI	= "http://www.w3.org/2006/rex";
cREXElement.prototype.localName		= "#element";

//
cREXElement.prototype.$getTag	= function() {
	return '';
};

// Register Element
fAmple_extend(cREXElement);
