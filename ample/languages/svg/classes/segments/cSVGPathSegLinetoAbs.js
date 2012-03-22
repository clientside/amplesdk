/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegLinetoAbs(nX, nY) {
	this.x	= nX;
	this.y	= nY;
};

cSVGPathSegLinetoAbs.prototype	= new cSVGPathSeg;

//
cSVGPathSegLinetoAbs.prototype.pathSegType	= cSVGPathSeg.PATHSEG_LINETO_ABS;
cSVGPathSegLinetoAbs.prototype.pathSegTypeAsLetter	= "L";

// Public Properties
cSVGPathSegLinetoAbs.prototype.x	= 0;
cSVGPathSegLinetoAbs.prototype.y	= 0;