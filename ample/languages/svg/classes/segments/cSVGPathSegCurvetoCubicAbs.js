/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegCurvetoCubicAbs(nX, nY, nX1, nY1, nX2, nY2) {
	this.x	= nX;
	this.y	= nY;
	this.x1	= nX1;
	this.y1	= nY1;
	this.x2	= nY2;
	this.y2	= nY2;
};

cSVGPathSegCurvetoCubicAbs.prototype	= new cSVGPathSeg;

//
cSVGPathSegCurvetoCubicAbs.prototype.pathSegType	= cSVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS;
cSVGPathSegCurvetoCubicAbs.prototype.pathSegTypeAsLetter	= "C";

// Public Properties
cSVGPathSegCurvetoCubicAbs.prototype.x	= 0;
cSVGPathSegCurvetoCubicAbs.prototype.y	= 0;
cSVGPathSegCurvetoCubicAbs.prototype.x1	= 0;
cSVGPathSegCurvetoCubicAbs.prototype.y1	= 0;
cSVGPathSegCurvetoCubicAbs.prototype.x2	= 0;
cSVGPathSegCurvetoCubicAbs.prototype.y2	= 0;
