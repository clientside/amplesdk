/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSElement_union	= function(){};
cXSElement_union.prototype	= new cXSElement("union");

cXSElement_union.handlers	= {};
cXSElement_union.handlers.DOMNodeInsertedIntoDocument	= function(oEvent) {
	var oSimpleType	= this.parentNode.$simpleType;
	//
	var sMemberTypes	= oElementDOM.getAttribute("memberTypes");
	if (sMemberTypes) {
		for (var nIndex = 0, aMemberTypes = sMemberTypes.split(' '); nIndex < aMemberTypes.length; nIndex++) {
			var aQName	= aMemberTypes[nIndex].split(':'),
				sLocalName		= aQName[1],
				sNameSpaceURI	= this.lookupNamespaceURI(aQName[0]),
				oMemberType		= oXSModel.getTypeDefinition(sNameSpaceURI, sLocalName);
			if (oMemberType)
				oSimpleType.memberTypes.$add(oMemberType);
		}
	}
	oSimpleType.variety	= cXSSimpleTypeDefinition.VARIETY_UNION;
};

// Register Element
ample.extend(cXSElement_union);