/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSModelGroup	= function() {

};

cXSModelGroup.prototype	= new cXSTerm;

cXSModelGroup.COMPOSITOR_SEQUENCE	= 1;
cXSModelGroup.COMPOSITOR_CHOICE		= 2;
cXSModelGroup.COMPOSITOR_ALL		= 3;

cXSModelGroup.prototype.compositor	= null;	// Number
cXSModelGroup.prototype.particles	= null;	// XSObjectList
cXSModelGroup.prototype.annotation	= null;	// XSAnnotation