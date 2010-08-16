/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLXSNamespaceItem	= function() {
	this.$elements			= {};
	this.$attributes		= {};
	this.$attributeGroups	= {};
	this.$modelGroups		= {};
	this.$types				= {};
};

cAMLXSNamespaceItem.prototype.schemaNamespace	= null;	// String
cAMLXSNamespaceItem.prototype.annotations		= null;	// XSObjectList
cAMLXSNamespaceItem.prototype.documentLocations	= null; // StringList

// Private
cAMLXSNamespaceItem.prototype.$elements			= null;
cAMLXSNamespaceItem.prototype.$attributes		= null;
cAMLXSNamespaceItem.prototype.$attributeGroups	= null;
cAMLXSNamespaceItem.prototype.$modelGroups		= null;
cAMLXSNamespaceItem.prototype.$types			= null;

// @type	XSNamedMap
cAMLXSNamespaceItem.prototype.getComponents	= function(nObjectType) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// @type	XSElementDeclaration
cAMLXSNamespaceItem.prototype.getElementDeclaration	= function(sName) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// @type	XSAttributeDeclaration
cAMLXSNamespaceItem.prototype.getAttributeDeclaration	= function(sName) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// @type	XSTypeDefinition
cAMLXSNamespaceItem.prototype.getTypeDefinition	= function(sName) {
	// Validate arguments
	fGuard(arguments, [
		["name",		cString]
	]);

	return this.$types[sName] || null;
};

// @type	XSAttributeGroupDefinition
cAMLXSNamespaceItem.prototype.getAttributeGroup	= function(sName) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// @type	XSModelGroupDefinition
cAMLXSNamespaceItem.prototype.getModelGroupDefinition	= function(sName) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// @type	XSNotationDeclaration
cAMLXSNamespaceItem.prototype.getNotationDeclaration	= function(sName) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

