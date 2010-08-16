/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLXSMultiValueFacet	= function() {
	this.lexicalFacetValues	= new cAMLStringList;
};

cAMLXSMultiValueFacet.prototype	= new cAMLXSObject;

cAMLXSMultiValueFacet.prototype.facetKind			= null;	// Number
cAMLXSMultiValueFacet.prototype.lexicalFacetValues	= null; // StringList
cAMLXSMultiValueFacet.prototype.annotations			= null; // XSObjectList
