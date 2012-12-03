/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSElement_pattern	= function(){};
cXSElement_pattern.prototype	= new cXSElement("pattern");

cXSElement_pattern.handlers	= {};
cXSElement_pattern.handlers.DOMNodeInsertedIntoDocument	= function(oEvent) {
	var oType	= this.parentNode.$type;
	//
	var sValue	= this.getAttribute("value"),
		nFacet	= cXSSimpleTypeDefinition.FACET_PATTERN;
	if (sValue) {
		// check if facet defined
		for (var nIndex = 0, oFacet; oFacet = oType.multiValueFacets[nIndex]; nIndex++)
			if (oFacet.facetKind == nFacet)
				break;

		// if facet not defined, create one
		if (!oFacet) {
			oFacet	= new cXSMultiValueFacet;
			// XSMultiValueFacet
			oFacet.fixed	= this.getAttribute("fixed") == "true";
			oFacet.facetKind= nFacet;

			// Add facet to type
			oType.multiValueFacets.$add(oFacet);
		}
		oFacet.lexicalFacetValues.$add(sValue);

		//
	//	oType.lexicalEnumeration.$add(sValue);
	}
};

// Register Element
ample.extend(cXSElement_pattern);