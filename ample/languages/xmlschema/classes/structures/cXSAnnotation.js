/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSAnnotation	= function() {

};

cXSAnnotation.prototype	= new cXSObject;

cXSAnnotation.W3C_DOM_ELEMENT		= 1;
cXSAnnotation.SAX_CONTENTHANDLER	= 2;
cXSAnnotation.W3C_DOM_DOCUMENT		= 3;

cXSAnnotation.prototype.annotationString	= null;	// String

/* @type	Boolean */
cXSAnnotation.prototype.annotationString	= function(oTarget, nTargetType) {

};