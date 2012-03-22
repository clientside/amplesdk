/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSComplexTypeDefinition	= function() {

};

cXSComplexTypeDefinition.prototype	= new cXSTypeDefinition;

// Constants
cXSComplexTypeDefinition.CONTENTTYPE_EMPTY		= 0;
cXSComplexTypeDefinition.CONTENTTYPE_SIMPLE		= 1;
cXSComplexTypeDefinition.CONTENTTYPE_ELEMENT	= 2;
cXSComplexTypeDefinition.CONTENTTYPE_MIXED		= 3;

cXSComplexTypeDefinition.prototype.derivationMethod	= null;	// Number
cXSComplexTypeDefinition.prototype.abstract			= null;	// Boolean
cXSComplexTypeDefinition.prototype.attributeUses	= null;	// XSObjectList
cXSComplexTypeDefinition.prototype.attributeWildcard= null;	// XSWildcard
cXSComplexTypeDefinition.prototype.contentType		= null;	// Number
cXSComplexTypeDefinition.prototype.simpleType		= null;	// XSSimpleTypeDefinition
cXSComplexTypeDefinition.prototype.particle			= null;	// XSParticle
cXSComplexTypeDefinition.prototype.prohibitedSubstitutions	= null;	// Number
cXSComplexTypeDefinition.prototype.annotations		= null;	// XSObjectList

/* @type	Boolean */
cXSComplexTypeDefinition.prototype.isProhibitedSubstitution	= function(nRestriction) {

};

cXSComplexTypeDefinition.prototype.$validate	= function(vValue) {
	// Validate arguments
	ample.guard(arguments, [
		["value",		cNode]
	]);

	return fXSComplexTypeDefinition_validate(this, vValue);
};

function fXSComplexTypeDefinition_validate(oType, vValue) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};