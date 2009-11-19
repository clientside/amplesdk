/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

function cSVGPathSegLinetoVerticalRel(nY) {
	this.y	= nY;
};

cSVGPathSegLinetoVerticalRel.prototype	= new cSVGPathSeg;

//
cSVGPathSegLinetoVerticalRel.prototype.pathSegType	= cSVGPathSeg.PATHSEG_LINETO_VERTICAL_REL;
cSVGPathSegLinetoVerticalRel.prototype.pathSegTypeAsLetter	= "v";

// Public Properties
cSVGPathSegLinetoVerticalRel.prototype.y	= 0;