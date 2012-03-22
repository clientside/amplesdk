/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSElementDeclaration	= function() {

};

cXSElementDeclaration.prototype	= new cXSTerm;

cXSElementDeclaration.prototype.typeDefinition			= null;	// XSTypeDefinition
cXSElementDeclaration.prototype.scope					= null;	// Number
cXSElementDeclaration.prototype.enclosingCTDefinition	= null;	// XSComplexTypeDefinition
cXSElementDeclaration.prototype.constraintType			= null;	// Number
cXSElementDeclaration.prototype.constraintValue			= null;	// String
cXSElementDeclaration.prototype.actualVC				= null;	// Object
cXSElementDeclaration.prototype.actualVCType			= null;	// Number
cXSElementDeclaration.prototype.itemValueTypes			= null;	// ShortList
cXSElementDeclaration.prototype.nillable				= null;	// Boolean
cXSElementDeclaration.prototype.identityConstraints		= null;	// XSNamedMap
cXSElementDeclaration.prototype.substitutionGroupAffiliation	= null;	// XSElementDeclaration
cXSElementDeclaration.prototype.substitutionGroupExclusions		= null;	// Number
cXSElementDeclaration.prototype.disallowedSubstitutions	= null;	// Number
cXSElementDeclaration.prototype.abstract				= null;	// Boolean
cXSElementDeclaration.prototype.annotation				= null;	// XSAnnotation

/* @type	Boolean */
cXSElementDeclaration.prototype.isSubstitutionGroupExclusion	= function(nExclusion) {

};

/* @type	Boolean */
cXSElementDeclaration.prototype.isDisallowedSubstitution	= function(nDisallowed) {

};