/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLNamespace	= function() {
	this.attributes	= {};
	this.elements	= {};
};
cAMLNamespace.prototype.namespaceURI	= null;

cAMLNamespace.prototype.setAttribute	= function(sName, cAttribute) {
	// Validate arguments
	fGuard(arguments, [
		["localName",	cString],
		["attribute",	cFunction]
	]);
	// Additional validation
	if (!(cAttribute.prototype instanceof cAMLAttr))
		throw new cAMLException(cAMLException.TYPE_MISMATCH_ERR);

	oAMLImplementation_attributes[this.namespaceURI + '#' + sName]	= cAttribute;

	//
	cAttribute.prototype.namespaceURI	= this.namespaceURI;
	cAttribute.prototype.localName		= sName;
};

cAMLNamespace.prototype.getAttribute	= function(sName) {
	return oAMLImplementation_attributes[this.namespaceURI + '#' + sName] || null;
};

cAMLNamespace.prototype.setElement	= function(sName, cElement) {
	// Validate arguments
	fGuard(arguments, [
		["localName",	cString],
		["element",		cFunction]
	]);
	// Additional validation
	if (!(cElement.prototype instanceof cAMLElement))
		throw new cAMLException(cAMLException.TYPE_MISMATCH_ERR);

	oAMLImplementation_elements[this.namespaceURI + '#' + sName]	= cElement;

	//
	cElement.prototype.namespaceURI	= this.namespaceURI;
	cElement.prototype.localName	= sName;
};

cAMLNamespace.prototype.getElement	= function(sName) {
	return oAMLImplementation_elements[this.namespaceURI + '#' + sName] || null;
};
