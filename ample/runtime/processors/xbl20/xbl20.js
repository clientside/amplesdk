/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var oXBL20_implementation	= {},
	sXBL20_namespaceURI		= "http://www.w3.org/ns/xbl";

// XBLImplementation
var cXBLImplementation	= function(){};

cXBLImplementation.prototype.xblBindingAttached	= function(){};
cXBLImplementation.prototype.xblEnteredDocument	= function(){};
cXBLImplementation.prototype.xblLeftDocument	= function(){};

// XBLImplementationsList
var cXBLImplementationsList	= function(){};
cXBLImplementationsList.prototype.length	= 0;
cXBLImplementationsList.prototype.item	= function(nIndex) {
	// Validate arguments
	fAML_validate(arguments, [
		["index",	cNumber]
	], "item");

	if (nIndex <= this.length)
		return this[nIndex];
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
};

// AMLDocument
cAMLDocument.prototype.bindingDocuments	= null;

cAMLDocument.prototype.loadBindingDocument	= function(sDocumentUri) {
	// Validate arguments
	fAML_validate(arguments, [
		["documentURI",	cString]
	], "loadBindingDocument");

	//
};

// AMLElement
cAMLElement.prototype.xblImplementations	= null;

cAMLElement.prototype.addBinding	= function(sBindingUri) {
	// Validate arguments
	fAML_validate(arguments, [
		["bindingURI",	cString]
	], "addBinding");

	//
};

cAMLElement.prototype.removeBinding	= function(sBindingUri) {
	// Validate arguments
	fAML_validate(arguments, [
		["bindingURI",	cString]
	], "removeBinding");

	//
};

cAMLElement.prototype.hasBinding	= function(sBindingUri) {
	// Validate arguments
	fAML_validate(arguments, [
		["bindingURI",	cString]
	], "hasBinding");

	//
};

// register processor
oAML_processors[sXBL20_namespaceURI]	= oXBL20_implementation;