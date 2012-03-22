/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSegArcAbs(nX, nY, nR1, nR2, nAngle, bLargeArcFlag, bSweepFlag) {
	this.x	= nX;
	this.y	= nY;
	this.r1	= nR1;
	this.r2	= nR2;
	this.angle	= nAngle;
	this.largeArcFlag	= bLargeArcFlag;
	this.sweepFlag		= bSweepFlag;
};

cSVGPathSegArcAbs.prototype	= new cSVGPathSeg;

//
cSVGPathSegArcAbs.prototype.pathSegType	= cSVGPathSeg.PATHSEG_ARC_ABS;
cSVGPathSegArcAbs.prototype.pathSegTypeAsLetter	= "A";

// Public Properties
cSVGPathSegArcAbs.prototype.x	= 0;
cSVGPathSegArcAbs.prototype.y	= 0;
cSVGPathSegArcAbs.prototype.r1	= 0;
cSVGPathSegArcAbs.prototype.r1	= 0;
cSVGPathSegArcAbs.prototype.angle	= 0;
cSVGPathSegArcAbs.prototype.largeArcFlag	= false;
cSVGPathSegArcAbs.prototype.sweepFlag		= false;