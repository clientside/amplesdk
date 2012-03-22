/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSAttributeDeclaration	= function() {

};

cXSAttributeDeclaration.prototype	= new cXSObject;

cXSAttributeDeclaration.prototype.typeDefinition		= null;	// XSSimpleTypeDefinition
cXSAttributeDeclaration.prototype.scope					= null;	// Number
cXSAttributeDeclaration.prototype.enclosingCTDefinition	= null;	// XSComplexTypeDefinition
cXSAttributeDeclaration.prototype.constraintType		= null;	// Number
cXSAttributeDeclaration.prototype.constraintValue		= null;	// String
cXSAttributeDeclaration.prototype.actualVC				= null;	// Object
cXSAttributeDeclaration.prototype.actualVCType			= null;	// Number
cXSAttributeDeclaration.prototype.itemValueTypes		= null;	// ShortList
cXSAttributeDeclaration.prototype.annotation			= null;	// XSAnnotation
