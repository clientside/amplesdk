/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegCurvetoCubicSmoothRel(nX, nY, nX2, nY2) {
	this.x	= nX;
	this.y	= nY;
	this.x2	= nY2;
	this.y2	= nY2;
};

cSVGPathSegCurvetoCubicSmoothRel.prototype	= new cSVGPathSeg;

//
cSVGPathSegCurvetoCubicSmoothRel.prototype.pathSegType	= cSVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL;
cSVGPathSegCurvetoCubicSmoothRel.prototype.pathSegTypeAsLetter	= "s";

// Public Properties
cSVGPathSegCurvetoCubicSmoothRel.prototype.x	= 0;
cSVGPathSegCurvetoCubicSmoothRel.prototype.y	= 0;
cSVGPathSegCurvetoCubicSmoothRel.prototype.x2	= 0;
cSVGPathSegCurvetoCubicSmoothRel.prototype.y2	= 0;