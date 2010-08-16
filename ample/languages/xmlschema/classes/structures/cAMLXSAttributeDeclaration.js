/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLXSAttributeDeclaration	= function() {

};

cAMLXSAttributeDeclaration.prototype	= new cAMLXSObject;

cAMLXSAttributeDeclaration.prototype.typeDefinition			= null;	// XSSimpleTypeDefinition
cAMLXSAttributeDeclaration.prototype.scope					= null;	// Number
cAMLXSAttributeDeclaration.prototype.enclosingCTDefinition	= null;	// XSComplexTypeDefinition
cAMLXSAttributeDeclaration.prototype.constraintType			= null;	// Number
cAMLXSAttributeDeclaration.prototype.constraintValue		= null;	// String
cAMLXSAttributeDeclaration.prototype.actualVC				= null;	// Object
cAMLXSAttributeDeclaration.prototype.actualVCType			= null;	// Number
cAMLXSAttributeDeclaration.prototype.itemValueTypes			= null;	// ShortList
cAMLXSAttributeDeclaration.prototype.annotation				= null;	// XSAnnotation
