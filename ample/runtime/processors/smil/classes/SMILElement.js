/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILElement	= function(sLocalName) {
	this.localName	= sLocalName;
};
cSMILElement.prototype	= new cElement;
cSMILElement.prototype.namespaceURI	= sNS_SMIL;
cSMILElement.prototype.localName	= "#element";

// Register Element
fAmple_extend(cSMILElement);
