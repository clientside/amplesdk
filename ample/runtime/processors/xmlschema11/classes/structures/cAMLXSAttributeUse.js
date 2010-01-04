/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLXSAttributeUse	= function() {

};

cAMLXSAttributeUse.prototype	= new cAMLXSObject;

cAMLXSAttributeUse.prototype.required			= null;	// Boolean
cAMLXSAttributeUse.prototype.attrDeclaration	= null;	// XSAttributeDeclaration
cAMLXSAttributeUse.prototype.constraintType		= null;	// Number
cAMLXSAttributeUse.prototype.constraintValue	= null;	// String
cAMLXSAttributeUse.prototype.actualVC			= null;	// Object
cAMLXSAttributeUse.prototype.actualVCType		= null;	// Number
cAMLXSAttributeUse.prototype.itemValueTypes		= null;	// ShortList
