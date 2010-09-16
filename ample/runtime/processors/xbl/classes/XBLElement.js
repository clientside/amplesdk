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
	// Validate arguments
	fGuard(arguments, [
		["documentURI",	cString]
	]);

	//
};

//AMLElement
cAMLElement.prototype.xblImplementations	= null;

cAMLElement.prototype.addBinding	= function(sBindingUri) {
	// Validate arguments
	fGuard(arguments, [
		["bindingURI",	cString]
	]);

	//
};

cAMLElement.prototype.removeBinding	= function(sBindingUri) {
	// Validate arguments
	fGuard(arguments, [
		["bindingURI",	cString]
	]);

	//
};

cAMLElement.prototype.hasBinding	= function(sBindingUri) {
	// Validate arguments
	fGuard(arguments, [
		["bindingURI",	cString]
	]);

	//
};
