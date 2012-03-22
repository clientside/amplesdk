/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegCurvetoQuadraticSmoothRel(nX, nY) {
	this.x	= nX;
	this.y	= nY;
};

cSVGPathSegCurvetoQuadraticSmoothRel.prototype	= new cSVGPathSeg;

//
cSVGPathSegCurvetoQuadraticSmoothRel.prototype.pathSegType	= cSVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL;
cSVGPathSegCurvetoQuadraticSmoothRel.prototype.pathSegTypeAsLetter	= "t";

// Public Properties
cSVGPathSegCurvetoQuadraticSmoothRel.prototype.x	= 0;
cSVGPathSegCurvetoQuadraticSmoothRel.prototype.y	= 0;
