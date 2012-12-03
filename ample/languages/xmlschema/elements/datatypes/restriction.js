/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSElement_restriction	= function(){};
cXSElement_restriction.prototype	= new cXSElement("restriction");

cXSElement_restriction.handlers	= {};
cXSElement_restriction.handlers.DOMNodeInsertedIntoDocument	= function(oEvent) {
	var oType	= this.parentNode.$type;
	//
	var sBase	= this.getAttribute("base");
	if (sBase) {
		var aQName	= sBase.split(':'),
			sLocalName		= aQName[1],
			sNameSpaceURI	= this.lookupNamespaceURI(aQName[0]),
			oBaseType		= oXSModel.getTypeDefinition(sNameSpaceURI, sLocalName);

		if (oBaseType)
			oType.baseType		= oBaseType;

		oType.variety		= cXSSimpleTypeDefinition.VARIETY_ATOMIC;

		//
		this.$type	= oType;
	}
};

// Register Element
ample.extend(cXSElement_restriction);