/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegMovetoAbs(nX, nY) {
	this.x	= nX;
	this.y	= nY;
};

cSVGPathSegMovetoAbs.prototype	= new cSVGPathSeg;

//
cSVGPathSegMovetoAbs.prototype.pathSegType	= cSVGPathSeg.PATHSEG_MOVETO_ABS;
cSVGPathSegMovetoAbs.prototype.pathSegTypeAsLetter	= "M";

// Public Properties
cSVGPathSegMovetoAbs.prototype.x	= 0;
cSVGPathSegMovetoAbs.prototype.y	= 0;