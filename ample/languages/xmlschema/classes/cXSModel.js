/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSModel	= function() {
	this.namespaces		= new ample.classes.DOMStringList;
	this.namespaceItems	= new cXSNamespaceItemList;
};

cXSModel.prototype.namespaces		= null;	// StringList
cXSModel.prototype.namespaceItems	= null;	// XSNamespaceItemList
cXSModel.prototype.annotations		= null;	// XSObjectList

// @type	XSNamedMap
cXSModel.prototype.getComponents	= function(nObjectType) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// @type	XSNamedMap
cXSModel.prototype.getComponentsByNamespace	= function(nObjectType, sNameSpaceURI) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// @type	XSElementDeclaration
cXSModel.prototype.getElementDeclaration	= function(sNameSpaceURI, sLocalName) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// @type	XSAttributeDeclaration
cXSModel.prototype.getAttributeDeclaration	= function(sNameSpaceURI, sLocalName) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// @type	XSTypeDefinition
cXSModel.prototype.getTypeDefinition	= function(sNameSpaceURI, sLocalName) {
	// Validate arguments
	ample.guard(arguments, [
		["namespaceURI",	String],
		["name",			String]
	]);

	for (var nIndex = 0; nIndex < this.namespaceItems.length; nIndex++)
		if (this.namespaceItems[nIndex].schemaNamespace == sNameSpaceURI)
			return this.namespaceItems[nIndex].getTypeDefinition(sLocalName);
	return null;
};

// @type	XSAttributeGroupDefinition
cXSModel.prototype.getAttributeGroup	= function(sNameSpaceURI, sLocalName) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// @type	XSModelGroupDefinition
cXSModel.prototype.getModelGroupDefinition	= function(sNameSpaceURI, sLocalName) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

// @type	XSNotationDeclaration
cXSModel.prototype.getNotationDeclaration	= function(sNameSpaceURI, sLocalName) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};



