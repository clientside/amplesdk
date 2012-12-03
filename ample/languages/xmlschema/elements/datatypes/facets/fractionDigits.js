/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSElement_fractionDigits	= function(){};
cXSElement_fractionDigits.prototype	= new cXSElement("fractionDigits");

cXSElement_fractionDigits.handlers	= {};
cXSElement_fractionDigits.handlers.DOMNodeInsertedIntoDocument	= function(oEvent) {
	var oType	= this.parentNode.$type;
	//
	var sValue	= this.getAttribute("value");
	if (sValue) {
		var oFacet	= new cXSFacet;
		// XSFacet
		oFacet.lexicalFacetValue	= sValue;
		oFacet.fixed	= this.getAttribute("fixed") == "true";
		oFacet.facetKind= cXSSimpleTypeDefinition.FACET_FRACTIONDIGITS;

		// Add facet to type
		oType.facets.$add(oFacet);
	}
};

// Register Element
ample.extend(cXSElement_fractionDigits);