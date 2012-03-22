/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cSVGPathSeg() {

};

//Constants
cSVGPathSeg.PATHSEG_UNKNOWN		= 0;
cSVGPathSeg.PATHSEG_CLOSEPATH	= 1;
cSVGPathSeg.PATHSEG_MOVETO_ABS	= 2;
cSVGPathSeg.PATHSEG_MOVETO_REL	= 3;
cSVGPathSeg.PATHSEG_LINETO_ABS			= 4;
cSVGPathSeg.PATHSEG_LINETO_REL			= 5;
cSVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS	= 6;
cSVGPathSeg.PATHSEG_CURVETO_CUBIC_REL	= 7;
cSVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS	= 8;
cSVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL	= 9;
cSVGPathSeg.PATHSEG_ARC_ABS					= 10;
cSVGPathSeg.PATHSEG_ARC_REL					= 11;
cSVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS	= 12;
cSVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL	= 13;
cSVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS		= 14;
cSVGPathSeg.PATHSEG_LINETO_VERTICAL_REL		= 15;
cSVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS		= 16;
cSVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL		= 17;
cSVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS	= 18;
cSVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL	= 19;

// Public Properties
cSVGPathSeg.prototype.pathSegType	= cSVGPathSeg.PATHSEG_UNKNOWN;
cSVGPathSeg.prototype.pathSegTypeAsLetter	= "";


