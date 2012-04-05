/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSMultiValueFacet	= function() {
	this.lexicalFacetValues	= new ample.classes.DOMStringList;
};

cXSMultiValueFacet.prototype	= new cXSObject;

cXSMultiValueFacet.prototype.facetKind			= null;	// Number
cXSMultiValueFacet.prototype.lexicalFacetValues	= null; // StringList
cXSMultiValueFacet.prototype.annotations		= null; // XSObjectList
