/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSElement_simpleType	= function(){};
cXSElement_simpleType.prototype	= new cXSElement("simpleType");

cXSElement_simpleType.handlers	= {};
cXSElement_simpleType.handlers.DOMNodeInsertedIntoDocument	= function(oEvent) {
	if (this.parentNode instanceof cXSElement_schema) {
		var oNamespaceItem	= this.parentNode.$namespaceItem;
		//
		var sName	= this.getAttribute("name");
		if (sName) {
			var oType	= new cXSSimpleTypeDefinition;
			// XSObject
	//		oType.type		= cXSConstants.TYPE_DEFINITION;
			oType.name		= sName;
			oType.namespace	= oNamespaceItem.schemaNamespace;
			oType.namespaceItem	= oNamespaceItem;
			// XSTypeDefinition interface
			oType.typeCategory	= cXSTypeDefinition.SIMPLE_TYPE;
			oType.anonymous		= false;
			// XSSimpleTypeDefinition interface
			oType.variety		= cXSSimpleTypeDefinition.VARIETY_ABSENT;

			// Register type
			oNamespaceItem.$types[sName]	= oType;

			//
			this.$type	= oType;
		}
	}
	else
	if (this.parentNode instanceof cXSElement_list) {
		var oType	= this.parentNode.$type;

		var oItemType	= new cXSSimpleTypeDefinition;
		// XSObject
//		oItemType.type		= cXSConstants.TYPE_DEFINITION;
//		oItemType.name		= null;	// no neeed to set
//		oItemType.namespace	= null;	// no neeed to set
//		oItemType.namespaceItem	= oType.namespaceItem;
		// XSTypeDefinition interface
		oItemType.typeCategory	= cXSTypeDefinition.SIMPLE_TYPE;
		oItemType.anonymous		= true;
		// XSSimpleTypeDefinition interface
		oItemType.variety		= cXSSimpleTypeDefinition.VARIETY_ATOMIC;

		// TODO: Check if there is itemType specified in attribute
		oType.itemType	= oItemType;

		//
		this.$type	= oItemType;
	}
	else
	if (this.parentNode instanceof cXSElement_union) {
		var oType	= this.parentNode.$type;

		var oMemberType	= new cXSSimpleTypeDefinition;
//		oMemberType.type		= cXSConstants.TYPE_DEFINITION;
//		oMemberType.name		= null;	// no neeed to set
//		oMemberType.namespace	= null;	// no neeed to set
//		oMemberType.namespaceItem	= oType.namespaceItem;
		// XSTypeDefinition interface
		oMemberType.typeCategory	= cXSTypeDefinition.SIMPLE_TYPE;
		oMemberType.anonymous		= true;
//		oMemberType.baseType		=
		// XSSimpleTypeDefinition interface
		oMemberType.variety		= cXSSimpleTypeDefinition.VARIETY_ATOMIC;

		// TODO: Check if there is memberTypes specified in attribute
		oType.memberTypes.$add(oMemberType);

		//
		this.$type	= oMemberType;
	}
};

// Register Element
ample.extend(cXSElement_simpleType);