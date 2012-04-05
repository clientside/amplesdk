/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSNamespaceItem	= function() {
	this.$elements			= {};
	this.$attributes		= {};
	this.$attributeGroups	= {};
	this.$modelGroups		= {};
	this.$types				= {};
};

cXSNamespaceItem.prototype.schemaNamespace	= null;	// String
cXSNamespaceItem.prototype.annotations		= null;	// XSObjectList
cXSNamespaceItem.prototype.documentLocations= null; // StringList

// Private
cXSNamespaceItem.prototype.$elements		= null;
cXSNamespaceItem.prototype.$attributes		= null;
cXSNamespaceItem.prototype.$attributeGroups	= null;
cXSNamespaceItem.prototype.$modelGroups		= null;
cXSNamespaceItem.prototype.$types			= null;

// @type	XSNamedMap
cXSNamespaceItem.prototype.getComponents	= function(nObjectType) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// @type	XSElementDeclaration
cXSNamespaceItem.prototype.getElementDeclaration	= function(sName) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// @type	XSAttributeDeclaration
cXSNamespaceItem.prototype.getAttributeDeclaration	= function(sName) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// @type	XSTypeDefinition
cXSNamespaceItem.prototype.getTypeDefinition	= function(sName) {
	// Validate arguments
	ample.guard(arguments, [
		["name",		String]
	]);

	return this.$types[sName] || null;
};

// @type	XSAttributeGroupDefinition
cXSNamespaceItem.prototype.getAttributeGroup	= function(sName) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// @type	XSModelGroupDefinition
cXSNamespaceItem.prototype.getModelGroupDefinition	= function(sName) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// @type	XSNotationDeclaration
cXSNamespaceItem.prototype.getNotationDeclaration	= function(sName) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

