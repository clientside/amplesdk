/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegArcRel(nX, nY, nR1, nR2, nAngle, bLargeArcFlag, bSweepFlag) {
	this.x	= nX;
	this.y	= nY;
	this.r1	= nR1;
	this.r2	= nR2;
	this.angle	= nAngle;
	this.largeArcFlag	= bLargeArcFlag;
	this.sweepFlag		= bSweepFlag;
};

cSVGPathSegArcRel.prototype	= new cSVGPathSeg;

//
cSVGPathSegArcRel.prototype.pathSegType	= cSVGPathSeg.PATHSEG_ARC_REL;
cSVGPathSegArcRel.prototype.pathSegTypeAsLetter	= "a";

// Public Properties
cSVGPathSegArcRel.prototype.x	= 0;
cSVGPathSegArcRel.prototype.y	= 0;
cSVGPathSegArcRel.prototype.r1	= 0;
cSVGPathSegArcRel.prototype.r1	= 0;
cSVGPathSegArcRel.prototype.angle	= 0;
cSVGPathSegArcRel.prototype.largeArcFlag	= false;
cSVGPathSegArcRel.prototype.sweepFlag		= false;