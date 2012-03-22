/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegCurvetoCubicRel(nX, nY, nX1, nY1, nX2, nY2) {
	this.x	= nX;
	this.y	= nY;
	this.x1	= nX1;
	this.y1	= nY1;
	this.x2	= nY2;
	this.y2	= nY2;
};

cSVGPathSegCurvetoCubicRel.prototype	= new cSVGPathSeg;

//
cSVGPathSegCurvetoCubicRel.prototype.pathSegType	= cSVGPathSeg.PATHSEG_CURVETO_CUBIC_REL;
cSVGPathSegCurvetoCubicRel.prototype.pathSegTypeAsLetter	= "c";

// Public Properties
cSVGPathSegCurvetoCubicRel.prototype.x	= 0;
cSVGPathSegCurvetoCubicRel.prototype.y	= 0;
cSVGPathSegCurvetoCubicRel.prototype.x1	= 0;
cSVGPathSegCurvetoCubicRel.prototype.y1	= 0;
cSVGPathSegCurvetoCubicRel.prototype.x2	= 0;
cSVGPathSegCurvetoCubicRel.prototype.y2	= 0;
