/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLXSElementDeclaration	= function() {

};

cAMLXSElementDeclaration.prototype	= new cAMLXSTerm;

cAMLXSElementDeclaration.prototype.typeDefinition			= null;	// XSTypeDefinition
cAMLXSElementDeclaration.prototype.scope					= null;	// Number
cAMLXSElementDeclaration.prototype.enclosingCTDefinition	= null;	// XSComplexTypeDefinition
cAMLXSElementDeclaration.prototype.constraintType			= null;	// Number
cAMLXSElementDeclaration.prototype.constraintValue			= null;	// String
cAMLXSElementDeclaration.prototype.actualVC					= null;	// Object
cAMLXSElementDeclaration.prototype.actualVCType				= null;	// Number
cAMLXSElementDeclaration.prototype.itemValueTypes			= null;	// ShortList
cAMLXSElementDeclaration.prototype.nillable					= null;	// Boolean
cAMLXSElementDeclaration.prototype.identityConstraints		= null;	// XSNamedMap
cAMLXSElementDeclaration.prototype.substitutionGroupAffiliation	= null;	// XSElementDeclaration
cAMLXSElementDeclaration.prototype.substitutionGroupExclusions	= null;	// Number
cAMLXSElementDeclaration.prototype.disallowedSubstitutions	= null;	// Number
cAMLXSElementDeclaration.prototype.abstract					= null;	// Boolean
cAMLXSElementDeclaration.prototype.annotation				= null;	// XSAnnotation

/* @type	Boolean */
cAMLXSElementDeclaration.prototype.isSubstitutionGroupExclusion	= function(nExclusion) {

};

/* @type	Boolean */
cAMLXSElementDeclaration.prototype.isDisallowedSubstitution	= function(nDisallowed) {

};