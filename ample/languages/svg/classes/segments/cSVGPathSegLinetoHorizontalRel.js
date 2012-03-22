/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegLinetoHorizontalRel(nX) {
	this.x	= nX;
};

cSVGPathSegLinetoHorizontalRel.prototype	= new cSVGPathSeg;

//
cSVGPathSegLinetoHorizontalRel.prototype.pathSegType	= cSVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL;
cSVGPathSegLinetoHorizontalRel.prototype.pathSegTypeAsLetter	= "h";

// Public Properties
cSVGPathSegLinetoHorizontalRel.prototype.x	= 0;