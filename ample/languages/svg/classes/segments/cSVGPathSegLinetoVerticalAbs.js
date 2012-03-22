/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegLinetoVerticalAbs(nY) {
	this.y	= nY;
};

cSVGPathSegLinetoVerticalAbs.prototype	= new cSVGPathSeg;

//
cSVGPathSegLinetoVerticalAbs.prototype.pathSegType	= cSVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS;
cSVGPathSegLinetoVerticalAbs.prototype.pathSegTypeAsLetter	= "V";

// Public Properties
cSVGPathSegLinetoVerticalAbs.prototype.y	= 0;