/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegCurvetoCubicSmoothAbs(nX, nY, nX2, nY2) {
	this.x	= nX;
	this.y	= nY;
	this.x2	= nY2;
	this.y2	= nY2;
};

cSVGPathSegCurvetoCubicSmoothAbs.prototype	= new cSVGPathSeg;

//
cSVGPathSegCurvetoCubicSmoothAbs.prototype.pathSegType	= cSVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS;
cSVGPathSegCurvetoCubicSmoothAbs.prototype.pathSegTypeAsLetter	= "S";

// Public Properties
cSVGPathSegCurvetoCubicSmoothAbs.prototype.x	= 0;
cSVGPathSegCurvetoCubicSmoothAbs.prototype.y	= 0;
cSVGPathSegCurvetoCubicSmoothAbs.prototype.x2	= 0;
cSVGPathSegCurvetoCubicSmoothAbs.prototype.y2	= 0;