/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLXSModelGroup	= function() {

};

cAMLXSModelGroup.prototype	= new cAMLXSTerm;

cAMLXSModelGroup.COMPOSITOR_SEQUENCE	= 1;
cAMLXSModelGroup.COMPOSITOR_CHOICE		= 2;
cAMLXSModelGroup.COMPOSITOR_ALL			= 3;

cAMLXSModelGroup.prototype.compositor	= null;	// Number
cAMLXSModelGroup.prototype.particles	= null;	// XSObjectList
cAMLXSModelGroup.prototype.annotation	= null;	// XSAnnotation