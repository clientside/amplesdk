/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXBLElement	= function(sLocalName) {
	this.localName	= sLocalName;
};
cXBLElement.prototype	= new cElement;
cXBLElement.prototype.namespaceURI	= "http://www.w3.org/ns/xbl";
cXBLElement.prototype.localName		= "#element";

//
cXBLElement.prototype.$getTag	= function() {
	return '';
};

// Register Element
fAmple_extend(cXBLElement);

// Attaching to Ample SDK
// Document
cDocument.prototype.bindingDocuments	= null;

cDocument.prototype.loadBindingDocument	= function(sDocumentUri) {
//->Guard
	fGuard(arguments, [
		["documentURI",	cString]
	]);
//<-Guard

};

//Element
cElement.prototype.xblImplementations	= null;

cElement.prototype.addBinding	= function(sBindingUri) {
//->Guard
	fGuard(arguments, [
		["bindingURI",	cString]
	]);
//<-Guard

};

cElement.prototype.removeBinding	= function(sBindingUri) {
//->Guard
	fGuard(arguments, [
		["bindingURI",	cString]
	]);
//<-Guard

};

cElement.prototype.hasBinding	= function(sBindingUri) {
//->Guard
	fGuard(arguments, [
		["bindingURI",	cString]
	]);
//<-Guard

};
