/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegLinetoHorizontalAbs(nX) {
	this.x	= nX;
};

cSVGPathSegLinetoHorizontalAbs.prototype	= new cSVGPathSeg;

//
cSVGPathSegLinetoHorizontalAbs.prototype.pathSegType	= cSVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS;
cSVGPathSegLinetoHorizontalAbs.prototype.pathSegTypeAsLetter	= "H";

// Public Properties
cSVGPathSegLinetoHorizontalAbs.prototype.x	= 0;