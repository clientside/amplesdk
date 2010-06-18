/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLXSModel	= function() {
	this.namespaces		= new cAMLStringList;
	this.namespaceItems	= new cAMLXSNamespaceItemList;
};

cAMLXSModel.prototype.namespaces		= null;	// StringList
cAMLXSModel.prototype.namespaceItems	= null;	// XSNamespaceItemList
cAMLXSModel.prototype.annotations		= null;	// XSObjectList

// @type	XSNamedMap
cAMLXSModel.prototype.getComponents	= function(nObjectType) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// @type	XSNamedMap
cAMLXSModel.prototype.getComponentsByNamespace	= function(nObjectType, sNameSpaceURI) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// @type	XSElementDeclaration
cAMLXSModel.prototype.getElementDeclaration	= function(sNameSpaceURI, sLocalName) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// @type	XSAttributeDeclaration
cAMLXSModel.prototype.getAttributeDeclaration	= function(sNameSpaceURI, sLocalName) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// @type	XSTypeDefinition
cAMLXSModel.prototype.getTypeDefinition	= function(sNameSpaceURI, sLocalName) {
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString],
		["name",			cString]
	]);

	for (var nIndex = 0; nIndex < this.namespaceItems.length; nIndex++)
		if (this.namespaceItems[nIndex].schemaNamespace == sNameSpaceURI)
			return this.namespaceItems[nIndex].getTypeDefinition(sLocalName);
	return null;
};

// @type	XSAttributeGroupDefinition
cAMLXSModel.prototype.getAttributeGroup	= function(sNameSpaceURI, sLocalName) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// @type	XSModelGroupDefinition
cAMLXSModel.prototype.getModelGroupDefinition	= function(sNameSpaceURI, sLocalName) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// @type	XSNotationDeclaration
cAMLXSModel.prototype.getNotationDeclaration	= function(sNameSpaceURI, sLocalName) {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};



