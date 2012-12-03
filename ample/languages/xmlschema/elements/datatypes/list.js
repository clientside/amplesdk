/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSElement_list	= function(){};
cXSElement_list.prototype	= new cXSElement("list");

cXSElement_list.handlers	= {};
cXSElement_list.handlers.DOMNodeInsertedIntoDocument	= function(oEvent) {
	var oType	= this.parentNode.$type;
	//
	var sItemType	= this.getAttribute("itemType");
	if (sItemType) {
		var aQName	= sItemType.split(':'),
			sLocalName		= aQName[1],
			sNameSpaceURI	= this.lookupNamespaceURI(aQName[0]),
			oItemType		= oXSModel.getTypeDefinition(sNameSpaceURI, sLocalName);
		if (oItemType)
			oType.itemType	= oItemType;
	}
	//
	oType.variety	= cXSSimpleTypeDefinition.VARIETY_LIST;
};

// Register Element
ample.extend(cXSElement_list);