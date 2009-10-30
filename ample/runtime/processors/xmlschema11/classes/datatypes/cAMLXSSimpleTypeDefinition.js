/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLXSSimpleTypeDefinition	= function() {
	this.memberTypes		= new cAMLXSObjectList;
	this.lexicalEnumeration	= new cAMLStringList;
	this.lexicalPattern		= new cAMLStringList;
	this.facets				= new cAMLXSObjectList;
	this.multiValueFacets	= new cAMLXSObjectList;
};

cAMLXSSimpleTypeDefinition.prototype	= new cAMLXSTypeDefinition;

// Constants
cAMLXSSimpleTypeDefinition.VARIETY_ABSENT	= 0;
cAMLXSSimpleTypeDefinition.VARIETY_ATOMIC	= 1;
cAMLXSSimpleTypeDefinition.VARIETY_LIST		= 2;
cAMLXSSimpleTypeDefinition.VARIETY_UNION	= 3;

// XML Schema 1.0
cAMLXSSimpleTypeDefinition.FACET_NONE		= 0;
cAMLXSSimpleTypeDefinition.FACET_LENGTH		= 1;
cAMLXSSimpleTypeDefinition.FACET_MINLENGTH	= 2;
cAMLXSSimpleTypeDefinition.FACET_MAXLENGTH	= 4;
cAMLXSSimpleTypeDefinition.FACET_PATTERN	= 8;
cAMLXSSimpleTypeDefinition.FACET_WHITESPACE	= 16;
cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE	= 32;
cAMLXSSimpleTypeDefinition.FACET_MAXEXCLUSIVE	= 64;
cAMLXSSimpleTypeDefinition.FACET_MINEXCLUSIVE	= 128;
cAMLXSSimpleTypeDefinition.FACET_MININCLUSIVE	= 256;
cAMLXSSimpleTypeDefinition.FACET_TOTALDIGITS	= 512;
cAMLXSSimpleTypeDefinition.FACET_FRACTIONDIGITS	= 1024;
cAMLXSSimpleTypeDefinition.FACET_ENUMERATION	= 2048;
// XML Schema 1.1
cAMLXSSimpleTypeDefinition.FACET_ASSERTION		= 4096;
cAMLXSSimpleTypeDefinition.FACET_MINSCALE		= 8192;
cAMLXSSimpleTypeDefinition.FACET_MAXSCALE		= 16384;

//->Source
cAMLXSSimpleTypeDefinition.FACET_NONE		= "none";
cAMLXSSimpleTypeDefinition.FACET_LENGTH		= "length";
cAMLXSSimpleTypeDefinition.FACET_MINLENGTH	= "minLength";
cAMLXSSimpleTypeDefinition.FACET_MAXLENGTH	= "maxLength";
cAMLXSSimpleTypeDefinition.FACET_PATTERN	= "pattern";
cAMLXSSimpleTypeDefinition.FACET_WHITESPACE	= "whiteSpace";
cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE	= "maxInclusive";
cAMLXSSimpleTypeDefinition.FACET_MAXEXCLUSIVE	= "maxExclusive";
cAMLXSSimpleTypeDefinition.FACET_MINEXCLUSIVE	= "minExclusive";
cAMLXSSimpleTypeDefinition.FACET_MININCLUSIVE	= "minInclulsive";
cAMLXSSimpleTypeDefinition.FACET_TOTALDIGITS	= "totalDigits";
cAMLXSSimpleTypeDefinition.FACET_FRACTIONDIGITS	= "fractionDigits";
cAMLXSSimpleTypeDefinition.FACET_ENUMERATION	= "enumeration";
// XML Schema 1.1
cAMLXSSimpleTypeDefinition.FACET_ASSERTION		= "assertion";
cAMLXSSimpleTypeDefinition.FACET_MINSCALE		= "minScale";
cAMLXSSimpleTypeDefinition.FACET_MAXSCALE		= "maxScale";
//<-Source

cAMLXSSimpleTypeDefinition.ORDERED_FALSE	= 0;
cAMLXSSimpleTypeDefinition.ORDERED_PARTIAL	= 1;
cAMLXSSimpleTypeDefinition.ORDERED_TOTAL	= 2;

// XML Schema 1.1
cAMLXSSimpleTypeDefinition.CARDINALITY_FINITE				= 0;
cAMLXSSimpleTypeDefinition.CARDINALITY_COUNTABLY_INFINITE	= 1;

cAMLXSSimpleTypeDefinition.prototype.variety			= null;	// Number
cAMLXSSimpleTypeDefinition.prototype.primitiveType		= null;	// XSSimpleTypeDefinition
cAMLXSSimpleTypeDefinition.prototype.builtInKind		= null;	// Number
cAMLXSSimpleTypeDefinition.prototype.itemType			= null;	// XSSimpleTypeDefinition
cAMLXSSimpleTypeDefinition.prototype.memberTypes		= null;	// XSObjectList
cAMLXSSimpleTypeDefinition.prototype.definedFacets		= null;	// Number
cAMLXSSimpleTypeDefinition.prototype.fixedFacets		= null;	// Number
cAMLXSSimpleTypeDefinition.prototype.lexicalEnumeration	= null;	// StringList
cAMLXSSimpleTypeDefinition.prototype.lexicalPattern		= null;	// StringList
cAMLXSSimpleTypeDefinition.prototype.ordered			= null;	// Number
cAMLXSSimpleTypeDefinition.prototype.finite				= null;	// Boolean
cAMLXSSimpleTypeDefinition.prototype.bounded			= null;	// Boolean
cAMLXSSimpleTypeDefinition.prototype.numeric			= null;	// Boolean
cAMLXSSimpleTypeDefinition.prototype.facets				= null;	// XSObjectList
cAMLXSSimpleTypeDefinition.prototype.multiValueFacets	= null;	// XSObjectList
cAMLXSSimpleTypeDefinition.prototype.annotations		= null;	// XSObjectList
// XML Schema 1.1
cAMLXSSimpleTypeDefinition.prototype.cardinality		= null;	// Number


/* @type	Boolean */
cAMLXSSimpleTypeDefinition.prototype.isDefinedFacet	= function(nFacetName) {

};

/* @type	Boolean */
cAMLXSSimpleTypeDefinition.prototype.isFixedFacet	= function(nFacetName) {

};

/* @type	String */
cAMLXSSimpleTypeDefinition.prototype.getLexicalFacetValue	= function(nFacetName) {

};
