/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

function cSVGPathSegCurvetoQuadraticRel(nX, nY, nX1, nY1) {
	this.x	= nX;
	this.y	= nY;
	this.x1	= nX1;
	this.y1	= nY1;
};

cSVGPathSegCurvetoQuadraticRel.prototype	= new cSVGPathSeg;

//
cSVGPathSegCurvetoQuadraticRel.prototype.pathSegType	= cSVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL;
cSVGPathSegCurvetoQuadraticRel.prototype.pathSegTypeAsLetter	= "q";

// Public Properties
cSVGPathSegCurvetoQuadraticRel.prototype.x	= 0;
cSVGPathSegCurvetoQuadraticRel.prototype.y	= 0;
cSVGPathSegCurvetoQuadraticRel.prototype.x1	= 0;
cSVGPathSegCurvetoQuadraticRel.prototype.y1	= 0;