/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSElement_minInclusive	= function(){};
cXSElement_minInclusive.prototype	= new cXSElement("minInclusive");

cXSElement_minInclusive.handlers	= {};
cXSElement_minInclusive.handlers.DOMNodeInsertedIntoDocument	= function(oEvent) {
	var oType	= this.parentNode.$type;
	//
	var sValue	= this.getAttribute("value");
	if (sValue) {
		var oFacet	= new cXSFacet;
		// XSFacet
		oFacet.lexicalFacetValue	= sValue;
		oFacet.fixed	= this.getAttribute("fixed") == "true";
		oFacet.facetKind= cXSSimpleTypeDefinition.FACET_MININCLUSIVE;

		// Add facet to type
		oType.facets.$add(oFacet);
	}
};

// Register Element
ample.extend(cXSElement_minInclusive);