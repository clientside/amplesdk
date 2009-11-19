/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
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