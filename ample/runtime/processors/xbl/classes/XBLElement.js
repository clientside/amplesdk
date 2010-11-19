/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXBLElement	= function(sLocalName) {
	this.localName	= sLocalName;
};
cXBLElement.prototype	= new cAMLElement;
cXBLElement.prototype.namespaceURI	= "http://www.w3.org/ns/xbl";
cXBLElement.prototype.localName		= "#element";

//
cXBLElement.prototype.$getTag	= function() {
	return '';
};

// Register Element
fAmple_extend(cXBLElement);

// Attaching to Ample SDK
// AMLDocument
cAMLDocument.prototype.bindingDocuments	= null;

cAMLDocument.prototype.loadBindingDocument	= function(sDocumentUri) {
//->Guard
	fGuard(arguments, [
		["documentURI",	cString]
	]);
//<-Guard

};

//AMLElement
cAMLElement.prototype.xblImplementations	= null;

cAMLElement.prototype.addBinding	= function(sBindingUri) {
//->Guard
	fGuard(arguments, [
		["bindingURI",	cString]
	]);
//<-Guard

};

cAMLElement.prototype.removeBinding	= function(sBindingUri) {
//->Guard
	fGuard(arguments, [
		["bindingURI",	cString]
	]);
//<-Guard

};

cAMLElement.prototype.hasBinding	= function(sBindingUri) {
//->Guard
	fGuard(arguments, [
		["bindingURI",	cString]
	]);
//<-Guard

};
