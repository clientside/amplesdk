/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSTypeDefinition	= function() {

};

cXSTypeDefinition.prototype	= new cXSObject;

cXSTypeDefinition.COMPLEX_TYPE	= 15;
cXSTypeDefinition.SIMPLE_TYPE	= 16;

cXSTypeDefinition.prototype.typeCategory	= null;	// Number
cXSTypeDefinition.prototype.baseType		= null;	// XSTypeDefinition
cXSTypeDefinition.prototype["final"]		= null;	// Number
cXSTypeDefinition.prototype.anonymous		= null;	// Boolean

// @type	Boolean
cXSTypeDefinition.prototype.isFinal	= function(nRestriction) {

};

// @type	Boolean
cXSTypeDefinition.prototype.derivedFromType	= function(/* XSTypeDefinition */ oAncestorType, /* Number*/ nDerivationMethod) {

};

// @type	Boolean
cXSTypeDefinition.prototype.derivedFrom	= function(/* String */ sNameSpaceURI, /* String */ sLocalName, /* Number */ nDerivationName) {

};
