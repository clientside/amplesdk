/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegCurvetoQuadraticSmoothAbs(nX, nY) {
	this.x	= nX;
	this.y	= nY;
};

cSVGPathSegCurvetoQuadraticSmoothAbs.prototype	= new cSVGPathSeg;

//
cSVGPathSegCurvetoQuadraticSmoothAbs.prototype.pathSegType	= cSVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS;
cSVGPathSegCurvetoQuadraticSmoothAbs.prototype.pathSegTypeAsLetter	= "T";

// Public Properties
cSVGPathSegCurvetoQuadraticSmoothAbs.prototype.x	= 0;
cSVGPathSegCurvetoQuadraticSmoothAbs.prototype.y	= 0;