/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegLinetoRel(nX, nY) {
	this.x	= nX;
	this.y	= nY;
};

cSVGPathSegLinetoRel.prototype	= new cSVGPathSeg;

//
cSVGPathSegLinetoRel.prototype.pathSegType	= cSVGPathSeg.PATHSEG_LINETO_REL;
cSVGPathSegLinetoRel.prototype.pathSegTypeAsLetter	= "l";

// Public Properties
cSVGPathSegLinetoRel.prototype.x	= 0;
cSVGPathSegLinetoRel.prototype.y	= 0;