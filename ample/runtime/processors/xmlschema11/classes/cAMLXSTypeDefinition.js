/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLXSTypeDefinition	= function() {

};

cAMLXSTypeDefinition.prototype	= new cAMLXSObject;

cAMLXSTypeDefinition.COMPLEX_TYPE	= 15;
cAMLXSTypeDefinition.SIMPLE_TYPE	= 16;

cAMLXSTypeDefinition.prototype.typeCategory	= null;	// Number
cAMLXSTypeDefinition.prototype.baseType		= null;	// XSTypeDefinition
cAMLXSTypeDefinition.prototype.final		= null;	// Number
cAMLXSTypeDefinition.prototype.anonymous	= null;	// Boolean

// @type	Boolean
cAMLXSTypeDefinition.prototype.isFinal	= function(nRestriction) {

};

// @type	Boolean
cAMLXSTypeDefinition.prototype.derivedFromType	= function(/* XSTypeDefinition */ oAncestorType, /* Number*/ nDerivationMethod) {

};

// @type	Boolean
cAMLXSTypeDefinition.prototype.derivedFrom	= function(/* String */ sNameSpaceURI, /* String */ sLocalName, /* Number */ nDerivationName) {

};
