/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLNamespace	= function(){
	void 0;	// This solves a JavaScript problem of Google Chrome 4
	this.attributes	= {};
	this.elements	= {};
};
cAMLNamespace.prototype.namespaceURI	= null;

cAMLNamespace.prototype.setAttribute	= function(sName, cAttribute) {
	// Validate arguments
	fAML_validate(arguments, [
		["localName",	cString],
		["attribute",	cFunction]
	], "setAttribute");
	// Additional validation
	if (!(cAttribute.prototype instanceof cAMLAttr))
		throw new cAMLException(cAMLException.TYPE_MISMATCH_ERR);

	this.attributes[sName]	= cAttribute;

	//
	cAttribute.prototype.namespaceURI	= this.namespaceURI;
	cAttribute.prototype.localName		= sName;
};

cAMLNamespace.prototype.getAttribute	= function(sName) {
	return this.attributes[sName] || null;
};

cAMLNamespace.prototype.setElement	= function(sName, cElement) {
	// Validate arguments
	fAML_validate(arguments, [
		["localName",	cString],
		["element",		cFunction]
	], "setElement");
	// Additional validation
	if (!(cElement.prototype instanceof cAMLElement))
		throw new cAMLException(cAMLException.TYPE_MISMATCH_ERR);

	this.elements[sName]	= cElement;

	//
	cElement.prototype.namespaceURI	= this.namespaceURI;
	cElement.prototype.localName	= sName;
};

cAMLNamespace.prototype.getElement	= function(sName) {
	return this.elements[sName] || null;
};
