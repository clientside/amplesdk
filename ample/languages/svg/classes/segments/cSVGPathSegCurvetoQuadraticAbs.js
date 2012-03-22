/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegCurvetoQuadraticAbs(nX, nY, nX1, nY1) {
	this.x	= nX;
	this.y	= nY;
	this.x1	= nX1;
	this.y1	= nY1;
};

cSVGPathSegCurvetoQuadraticAbs.prototype	= new cSVGPathSeg;

//
cSVGPathSegCurvetoQuadraticAbs.prototype.pathSegType	= cSVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS;
cSVGPathSegCurvetoQuadraticAbs.prototype.pathSegTypeAsLetter	= "Q";

// Public Properties
cSVGPathSegCurvetoQuadraticAbs.prototype.x	= 0;
cSVGPathSegCurvetoQuadraticAbs.prototype.y	= 0;
cSVGPathSegCurvetoQuadraticAbs.prototype.x1	= 0;
cSVGPathSegCurvetoQuadraticAbs.prototype.y1	= 0;