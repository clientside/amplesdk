/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLXSComplexTypeDefinition	= function() {

};

cAMLXSComplexTypeDefinition.prototype	= new cAMLXSTypeDefinition;

// Constants
cAMLXSComplexTypeDefinition.CONTENTTYPE_EMPTY	= 0;
cAMLXSComplexTypeDefinition.CONTENTTYPE_SIMPLE	= 1;
cAMLXSComplexTypeDefinition.CONTENTTYPE_ELEMENT	= 2;
cAMLXSComplexTypeDefinition.CONTENTTYPE_MIXED	= 3;

cAMLXSComplexTypeDefinition.prototype.derivationMethod	= null;	// Number
cAMLXSComplexTypeDefinition.prototype.abstract			= null;	// Boolean
cAMLXSComplexTypeDefinition.prototype.attributeUses		= null;	// XSObjectList
cAMLXSComplexTypeDefinition.prototype.attributeWildcard	= null;	// XSWildcard
cAMLXSComplexTypeDefinition.prototype.contentType		= null;	// Number
cAMLXSComplexTypeDefinition.prototype.simpleType		= null;	// XSSimpleTypeDefinition
cAMLXSComplexTypeDefinition.prototype.particle			= null;	// XSParticle
cAMLXSComplexTypeDefinition.prototype.prohibitedSubstitutions	= null;	// Number
cAMLXSComplexTypeDefinition.prototype.annotations		= null;	// XSObjectList

/* @type	Boolean */
cAMLXSComplexTypeDefinition.prototype.isProhibitedSubstitution	= function(nRestriction) {

};
