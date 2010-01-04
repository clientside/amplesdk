/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLXSAnnotation	= function() {

};

cAMLXSAnnotation.prototype	= new cAMLXSObject;

cAMLXSAnnotation.W3C_DOM_ELEMENT	= 1;
cAMLXSAnnotation.SAX_CONTENTHANDLER	= 2;
cAMLXSAnnotation.W3C_DOM_DOCUMENT	= 3;

cAMLXSAnnotation.prototype.annotationString	= null;	// String

/* @type	Boolean */
cAMLXSAnnotation.prototype.annotationString	= function(oTarget, nTargetType) {

};