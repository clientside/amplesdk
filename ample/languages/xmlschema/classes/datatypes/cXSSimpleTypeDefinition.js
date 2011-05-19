/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSSimpleTypeDefinition	= function() {
	this.memberTypes		= new cXSObjectList;
	this.lexicalEnumeration	= new cDOMStringList;
	this.lexicalPattern		= new cDOMStringList;
	this.facets				= new cXSObjectList;
	this.multiValueFacets	= new cXSObjectList;
};

cXSSimpleTypeDefinition.prototype	= new cXSTypeDefinition;

// Constants
cXSSimpleTypeDefinition.VARIETY_ABSENT	= 0;
cXSSimpleTypeDefinition.VARIETY_ATOMIC	= 1;
cXSSimpleTypeDefinition.VARIETY_LIST	= 2;
cXSSimpleTypeDefinition.VARIETY_UNION	= 3;

// XML Schema 1.0
cXSSimpleTypeDefinition.FACET_NONE		= 0;
cXSSimpleTypeDefinition.FACET_LENGTH	= 1;
cXSSimpleTypeDefinition.FACET_MINLENGTH	= 2;
cXSSimpleTypeDefinition.FACET_MAXLENGTH	= 4;
cXSSimpleTypeDefinition.FACET_PATTERN	= 8;
cXSSimpleTypeDefinition.FACET_WHITESPACE	= 16;
cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE	= 32;
cXSSimpleTypeDefinition.FACET_MAXEXCLUSIVE	= 64;
cXSSimpleTypeDefinition.FACET_MINEXCLUSIVE	= 128;
cXSSimpleTypeDefinition.FACET_MININCLUSIVE	= 256;
cXSSimpleTypeDefinition.FACET_TOTALDIGITS	= 512;
cXSSimpleTypeDefinition.FACET_FRACTIONDIGITS= 1024;
cXSSimpleTypeDefinition.FACET_ENUMERATION	= 2048;
// XML Schema 1.1
cXSSimpleTypeDefinition.FACET_ASSERTION		= 4096;
cXSSimpleTypeDefinition.FACET_MINSCALE		= 8192;
cXSSimpleTypeDefinition.FACET_MAXSCALE		= 16384;

//->Source
cXSSimpleTypeDefinition.FACET_NONE			= "none";
cXSSimpleTypeDefinition.FACET_LENGTH		= "length";
cXSSimpleTypeDefinition.FACET_MINLENGTH		= "minLength";
cXSSimpleTypeDefinition.FACET_MAXLENGTH		= "maxLength";
cXSSimpleTypeDefinition.FACET_PATTERN		= "pattern";
cXSSimpleTypeDefinition.FACET_WHITESPACE	= "whiteSpace";
cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE	= "maxInclusive";
cXSSimpleTypeDefinition.FACET_MAXEXCLUSIVE	= "maxExclusive";
cXSSimpleTypeDefinition.FACET_MINEXCLUSIVE	= "minExclusive";
cXSSimpleTypeDefinition.FACET_MININCLUSIVE	= "minInclulsive";
cXSSimpleTypeDefinition.FACET_TOTALDIGITS	= "totalDigits";
cXSSimpleTypeDefinition.FACET_FRACTIONDIGITS= "fractionDigits";
cXSSimpleTypeDefinition.FACET_ENUMERATION	= "enumeration";
// XML Schema 1.1
cXSSimpleTypeDefinition.FACET_ASSERTION		= "assertion";
cXSSimpleTypeDefinition.FACET_MINSCALE		= "minScale";
cXSSimpleTypeDefinition.FACET_MAXSCALE		= "maxScale";
//<-Source

cXSSimpleTypeDefinition.ORDERED_FALSE	= 0;
cXSSimpleTypeDefinition.ORDERED_PARTIAL	= 1;
cXSSimpleTypeDefinition.ORDERED_TOTAL	= 2;

// XML Schema 1.1
cXSSimpleTypeDefinition.CARDINALITY_FINITE				= 0;
cXSSimpleTypeDefinition.CARDINALITY_COUNTABLY_INFINITE	= 1;

cXSSimpleTypeDefinition.prototype.variety			= null;	// Number
cXSSimpleTypeDefinition.prototype.primitiveType		= null;	// XSSimpleTypeDefinition
cXSSimpleTypeDefinition.prototype.builtInKind		= null;	// Number
cXSSimpleTypeDefinition.prototype.itemType			= null;	// XSSimpleTypeDefinition
cXSSimpleTypeDefinition.prototype.memberTypes		= null;	// XSObjectList
cXSSimpleTypeDefinition.prototype.definedFacets		= null;	// Number
cXSSimpleTypeDefinition.prototype.fixedFacets		= null;	// Number
cXSSimpleTypeDefinition.prototype.lexicalEnumeration= null;	// StringList
cXSSimpleTypeDefinition.prototype.lexicalPattern	= null;	// StringList
cXSSimpleTypeDefinition.prototype.ordered			= null;	// Number
cXSSimpleTypeDefinition.prototype.finite			= null;	// Boolean
cXSSimpleTypeDefinition.prototype.bounded			= null;	// Boolean
cXSSimpleTypeDefinition.prototype.numeric			= null;	// Boolean
cXSSimpleTypeDefinition.prototype.facets			= null;	// XSObjectList
cXSSimpleTypeDefinition.prototype.multiValueFacets	= null;	// XSObjectList
cXSSimpleTypeDefinition.prototype.annotations		= null;	// XSObjectList
// XML Schema 1.1
cXSSimpleTypeDefinition.prototype.cardinality		= null;	// Number


/* @type	Boolean */
cXSSimpleTypeDefinition.prototype.isDefinedFacet	= function(nFacetName) {

};

/* @type	Boolean */
cXSSimpleTypeDefinition.prototype.isFixedFacet	= function(nFacetName) {

};

/* @type	String */
cXSSimpleTypeDefinition.prototype.getLexicalFacetValue	= function(nFacetName) {

};
