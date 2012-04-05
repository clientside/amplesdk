/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSElement_schema	= function(){};
cXSElement_schema.prototype	= new cXSElement("schema");

cXSElement_schema.handlers	= {};
cXSElement_schema.handlers.DOMNodeInsertedIntoDocument	= function(oEvent) {
	var sNameSpaceURI	= this.attributes["targetNamespace"];
	if (sNameSpaceURI) {
		// Create new namespace item
		var oNamespaceItem	= new cXSNamespaceItem;
		oNamespaceItem.schemaNamespace	= sNameSpaceURI;
		// Register new namespace item
		oXSModel.namespaces.$add(sNameSpaceURI);
		oXSModel.namespaceItems.$add(oNamespaceItem);

		//
		this.$namespaceItem	= oNamespaceItem;
	}
};

// Register Element
ample.extend(cXSElement_schema);