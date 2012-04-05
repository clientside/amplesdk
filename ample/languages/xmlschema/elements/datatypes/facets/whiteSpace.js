/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSElement_whiteSpace	= function(){};
cXSElement_whiteSpace.prototype	= new cXSElement("whiteSpace");

cXSElement_whiteSpace.handlers	= {};
cXSElement_whiteSpace.handlers.DOMNodeInsertedIntoDocument	= function(oEvent) {
	var oType	= this.parentNode.$type;
	//
	var sValue	= this.attributes["value"];
	if (sValue) {
		var oFacet	= new cXSFacet;
		// XSFacet
		oFacet.lexicalFacetValue	= sValue;
		oFacet.fixed	= this.attributes["fixed"] == "true";
		oFacet.facetKind= cXSSimpleTypeDefinition.FACET_WHITESPACE;

		// Add facet to type
		oType.facets.$add(oFacet);
	}
};

// Register Element
ample.extend(cXSElement_whiteSpace);