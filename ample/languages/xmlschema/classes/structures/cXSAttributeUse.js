/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSAttributeUse	= function() {

};

cXSAttributeUse.prototype	= new cXSObject;

cXSAttributeUse.prototype.required			= null;	// Boolean
cXSAttributeUse.prototype.attrDeclaration	= null;	// XSAttributeDeclaration
cXSAttributeUse.prototype.constraintType	= null;	// Number
cXSAttributeUse.prototype.constraintValue	= null;	// String
cXSAttributeUse.prototype.actualVC			= null;	// Object
cXSAttributeUse.prototype.actualVCType		= null;	// Number
cXSAttributeUse.prototype.itemValueTypes	= null;	// ShortList
