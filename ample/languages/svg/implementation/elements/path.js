/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_path	= function(){
	this.pathSegList			= new cSVGPathSegList;
/*
	// Register pathSegList changer
	var that	= this;
	this.pathSegList.$onchange	= function() {
		this.$getContainer().path	=
	};*/
//	this.normalizedPathSegList	= new cSVGPathSegList;
//	this.animatedPathSegList			= new cSVGPathSegList;
//	this.animatedNormalizedPathSegList	= new cSVGPathSegList;
};
cSVGElement_path.prototype	= new cSVGElement;

//
cSVGElement_path.prototype.pathSegList				= null;
//cSVGElement_path.prototype.normalizedPathSegList	= null;
//cSVGElement_path.prototype.animatedPathSegList				= null;
//cSVGElement_path.prototype.animatedNormalizedPathSegList	= null;

cSVGElement_path.prototype.pathLength	= 0;

cSVGElement_path.prototype.getTotalLength	= function() {
	throw new AMLException(AMLException.NOT_SUPPORTED_ERR);
};

cSVGElement_path.prototype.getPointAtLength	= function(nDistance) {
	throw new AMLException(AMLException.NOT_SUPPORTED_ERR);
};

cSVGElement_path.prototype.getPathSegAtLength	= function(nDistance) {
	throw new AMLException(AMLException.NOT_SUPPORTED_ERR);
};

cSVGElement_path.prototype.createSVGPathSegClosePath	= function() {
	return new cSVGPathSegClosePath;
};

cSVGElement_path.prototype.createSVGPathSegMovetoAbs	= function(nX, nY) {
	return new cSVGPathSegMovetoAbs(nX, nY);
};

cSVGElement_path.prototype.createSVGPathSegMovetoRel	= function(nX, nY) {
	return new cSVGPathSegMovetoRel(nX, nY);
};

cSVGElement_path.prototype.createSVGPathSegLinetoAbs	= function(nX, nY) {
	return new cSVGPathSegLinetoAbs(nX, nY);
};

cSVGElement_path.prototype.createSVGPathSegLinetoRel	= function(nX, nY) {
	return new cSVGPathSegLinetoRel(nX, nY);
};

cSVGElement_path.prototype.createSVGPathSegCurvetoCubicAbs	= function(nX, nY, nX1, nY1, nX2, nY2) {
	return new cSVGPathSegCurvetoCubicAbs(nX, nY, nX1, nY1, nX2, nY2);
};

cSVGElement_path.prototype.createSVGPathSegCurvetoCubicRel	= function(nX, nY, nX1, nY1, nX2, nY2) {
	return new cSVGPathSegCurvetoCubicRel(nX, nY, nX1, nY1, nX2, nY2);
};

cSVGElement_path.prototype.createSVGPathSegCurvetoQuadraticAbs	= function(nX, nY, nX1, nY1) {
	return new cSVGPathSegCurvetoQuadraticAbs(nX, nY, nX1, nY1);
};

cSVGElement_path.prototype.createSVGPathSegCurvetoQuadraticRel	= function(nX, nY, nX1, nY1) {
	return new cSVGPathSegCurvetoQuadraticRel(nX, nY, nX1, nY1);
};

cSVGElement_path.prototype.createSVGPathSegArcAbs	= function(nX, nY, nR1, nR2, nAngle, bLargeArc, bSweep) {
	return new cSVGPathSegArcAbs(nX, nY, nR1, nR2, nAngle, bLargeArc, bSweep);
};

cSVGElement_path.prototype.createSVGPathSegArcRel	= function(nX, nY, nR1, nR2, nAngle, bLargeArc, bSweep) {
	return new cSVGPathSegArcRel(nX, nY, nR1, nR2, nAngle, bLargeArc, bSweep);
};

cSVGElement_path.prototype.createSVGPathSegLinetoHorizontalAbs	= function(nX) {
	return new cSVGPathSegLinetoHorizontalAbs(nX);
};

cSVGElement_path.prototype.createSVGPathSegLinetoHorizontalRel	= function(nX) {
	return new cSVGPathSegLinetoHorizontalRel(nX);
};

cSVGElement_path.prototype.createSVGPathSegLinetoVerticalAbs	= function(nY) {
	return new cSVGPathSegLinetoVerticalAbs(nY);
};

cSVGElement_path.prototype.createSVGPathSegLinetoVerticalRel	= function(nY) {
	return new cSVGPathSegLinetoVerticalRel(nY);
};

cSVGElement_path.prototype.createSVGPathSegCurvetoCubicSmoothAbs	= function(nX, nY, nX2, nY2) {
	return new cSVGPathSegCurvetoCubicSmoothAbs(nX, nY, nX2, nY2);
};

cSVGElement_path.prototype.createSVGPathSegCurvetoCubicSmoothRel	= function(nX, nY, nX2, nY2) {
	return new cSVGPathSegCurvetoCubicSmoothRel(nX, nY, nX2, nY2);
};

cSVGElement_path.prototype.createSVGPathSegCurvetoQuadraticSmoothAbs	= function(nX, nY) {
	return new cSVGPathSegCurvetoQuadraticSmoothAbs(nX, nY);
};

cSVGElement_path.prototype.createSVGPathSegCurvetoQuadraticSmoothRel	= function(nX, nY) {
	return new cSVGPathSegCurvetoQuadraticSmoothRel(nX, nY);
};

// Static Methods
cSVGElement_path.d2PathSegList	= function(oInstance) {

};

cSVGElement_path.pathSegList2d	= function(oInstance) {

};

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
	cSVGElement_path.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "d":
						this.$getContainer().path	= cSVGElement_path.convert(oEvent.newValue);
						break;
					//
					case "transform":
						cSVGElement.applyTransform(this);
						break;
					//
					default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

			// Apply gradients
			if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

			// Apply transformation
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_path.pathSegList2Path	= function(oPathSegList) {
		var aPath	= [];
		for (var nIndex = 0; nIndex < this.pathSeqList.numberOfItems; nIndex++) {
			switch (this.pathSeqList[nIndex].pathSegType) {
				case cSVGPathSeg.PATHSEG_CLOSEPATH:
					break;

				case cSVGPathSeg.PATHSEG_MOVETO_ABS:
					break;

				case cSVGPathSeg.PATHSEG_MOVETO_REL:
					break;

				case cSVGPathSeg.PATHSEG_LINETO_ABS:
					break;

				case cSVGPathSeg.PATHSEG_LINETO_REL:
					break;

				case cSVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
					break;

				case cSVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
					break;

				case cSVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
					break;

				case cSVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
					break;

				case cSVGPathSeg.PATHSEG_ARC_ABS:
					break;

				case cSVGPathSeg.PATHSEG_ARC_REL:
					break;

				case cSVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
					break;

				case cSVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
					break;

				case cSVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
					break;

				case cSVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
					break;

				case cSVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
					break;

				case cSVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
					break;

				case cSVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
					break;

				case cSVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
					break;
			}
		}
	};

	cSVGElement_path.hQuadratic	= {"Q":true, "q":true, "T":true, "t":true};
	cSVGElement_path.hCubic		= {"C":true, "c":true, "S":true, "s":true};

	cSVGElement_path.convert	= function(sValue) {
		var aCommands	= sValue.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/ig),
			iStartX		= 0,
			iStartY		= 0,
			iCurrentX	= 0,
			iCurrentY	= 0,
			aCubic		= null,
			aQuadratic	= null,
			iControlY	= 0,
			aPath		= [];

		if (!aCommands)
			return '';

		for (var i = 0, aCommand, sCommand; i < aCommands.length; i++) {
			sCommand	= aCommands[i].substr(0, 1);
			aParameters	= aCommands[i].substr(1).
								replace(/(\d)-/g, '$1,-').
								replace(/^\s+|\s+$/g, '').
								split(/[,\s]/).map(function(nValue) {
									return nValue * 1;
								});

			switch (sCommand) {
				// moveto (x y)+
				case "M":
					iCurrentX	= aParameters[0];
					iCurrentY	= aParameters[1];
					iStartX		= iCurrentX;
					iStartY		= iCurrentY;
					aPath.push("m" + aParameters.slice(0, 2).map(Math.round) + " ");

					// If there are more that 2 parameters, draw line out of the rest of parameters
					if (aParameters.length == 2)
						break;
					else
						aParameters	= aParameters.slice(2);

				// lineto (x y)+
				case "L":
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					aPath.push("l" + aParameters.map(Math.round) + " ");
					break;

				case "m":
					iCurrentX	+= aParameters[0];
					iCurrentY	+= aParameters[1];
					iStartX		= iCurrentX;
					iStartY		= iCurrentY;

					aPath.push("t" + aParameters.slice(0, 2).map(Math.round) + " ");

					// If there are more that 2 parameters, draw line out of the rest of parameters
					if (aParameters.length == 2)
						break;
					else
						aParameters	= aParameters.slice(2);

				case "l":
					for (var j = 0; j < aParameters.length; j+= 2) {
						iCurrentX	+= aParameters[j];
						iCurrentY	+= aParameters[j + 1];
					}
					aPath.push("r" + aParameters.map(Math.round) + " ");
					break;

				// horizontal lineto x+
				case "H":
					iCurrentX	= aParameters[0];
					aPath.push("l" + [iCurrentX, iCurrentY].map(Math.round) + " ");
					break;

				case "h":
					iCurrentX	+= aParameters[0];
					aPath.push("r" + [aParameters[0], 0].map(Math.round) + " ");
					break;

				// vertical lineto y+
				case "V":
					iCurrentY	= aParameters[0];
					aPath.push("l" + [iCurrentX, iCurrentY].map(Math.round) + " ");
					break;

				case "v":
					iCurrentY	+= aParameters[0];
					aPath.push("r" + [0, aParameters[0]].map(Math.round) + " ");
					break;

				// curveto (x1 y1 x2 y2 x y)+
				case "C":
					aPath.push("c" + aParameters.map(Math.round) + " ");
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					aCubic	= [aParameters[aParameters.length - 4], aParameters[aParameters.length - 3]];
					break;

				case "c":
					aPath.push("v" + aParameters.map(Math.round) + " ");
					iCurrentX	+= aParameters[aParameters.length - 2];
					iCurrentY	+= aParameters[aParameters.length - 1];
					aCubic	= [aParameters[aParameters.length - 4], aParameters[aParameters.length - 3]];
					break;

				// shorthand/smooth curveto (x2 y2 x y)+
				case "S":
					aPath.push("c" + [iCurrentX + (aCubic ? iCurrentX - aCubic[0] : 0), iCurrentY + (aCubic ? iCurrentY - aCubic[1] : 0)].map(Math.round) + "," + aParameters.map(Math.round) + " ");
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					break;

				case "s":
					aPath.push("v" + [(aCubic ? aParameters[2] - aCubic[0] : 0), (aCubic ? aParameters[3] - aCubic[1] : 0)].map(Math.round) + "," + aParameters.map(Math.round) + " ");
					iCurrentX	+= aParameters[2];
					iCurrentY	+= aParameters[3];
					break;

				// quadratic Bézier curveto (x1 y1 x y)+
				case "Q":	// Using Cubic Bezier in IE
					aPath.push("c" + [iCurrentX, iCurrentY].map(Math.round) + "," + aParameters.map(Math.round) + " ");
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					aQuadratic	= [aParameters[aParameters.length - 4], aParameters[aParameters.length - 3]];
					break;

				case "q":	// Using Cubic Bezier in IE
					aPath.push("v0,0" + "," + aParameters.map(Math.round) + " ");
					iCurrentX	+= aParameters[aParameters.length - 2];
					iCurrentY	+= aParameters[aParameters.length - 1];
					aQuadratic	= [aParameters[aParameters.length - 4], aParameters[aParameters.length - 3]];
					break;

				// Shorthand/smooth quadratic Bézier curveto (x y)+
				case "T":	// Using Cubic Bezier in IE
					aPath.push("c" + [iCurrentX, iCurrentY].map(Math.round) + "," + [iCurrentX + (aQuadratic ? iCurrentX - aQuadratic[0] : 0), iCurrentY + (aQuadratic ? iCurrentY - aQuadratic[1] : 0)].map(Math.round) + "," + aParameters.map(Math.round) + " ");
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					break;

				case "t":	// Using Cubic Bezier in IE
					aPath.push("v0,0" + "," + [(aQuadratic ? aParameters[aParameters.length - 2] - aQuadratic[0] : 0), (aQuadratic ? aParameters[aParameters.length - 1] - aQuadratic[1] : 0)].map(Math.round) + "," + aParameters.map(Math.round) + " ");
					iCurrentX	+= aParameters[aParameters.length - 2];
					iCurrentY	+= aParameters[aParameters.length - 1];
					break;

				// elliptical arc (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
				case "A":	// TODO
				case "a":
					var iRadiusX	= aParameters[0],
						iRadiusY	= aParameters[1],
						iRotation	= aParameters[2],
						bLargeArc	= aParameters[3] == "1",
						bSweep		= aParameters[4] == "1",
						iToX		= aParameters[5] + (sCommand == "A" ? 0 : iCurrentX),
						iToY		= aParameters[6] + (sCommand == "A" ? 0 : iCurrentY);

	                var a = (iToX - iCurrentX) / (2 * iRadiusX),
	                    b = (iToY - iCurrentY) / (2 * iRadiusY),
	                    c = Math.sqrt(Math.abs(1 - 1 / (a * a + b * b))) * (bLargeArc == bSweep ? -1 : 1),
	                    iCenterX = iCurrentX + iRadiusX * (a - c * b),
	                    iCenterY = iCurrentY + iRadiusY * (b + c * a);
	                aPath.push((bSweep ? "wa" : "at") + [iCenterX - iRadiusX, iCenterY - iRadiusY, iCenterX + iRadiusX, iCenterY + iRadiusY, iCurrentX, iCurrentY, iToX, iToY].map(Math.round) + " ");

					if (sCommand == "A") {
						iCurrentX	= aParameters[5];
						iCurrentY	= aParameters[6];
					}
					else {
						iCurrentX	+= aParameters[5];
						iCurrentY	+= aParameters[6];
					}
					break;

				// closepath (none)
				case "Z":
				case "z":
					aPath.push("x");
					iCurrentX	= iStartX;
					iCurrentY	= iStartY;
					break;
			}

			// Reset shorthands
			if (!cSVGElement_path.hQuadratic[sCommand])
				aQuadratic	= null;
			else
			if (!cSVGElement_path.hCubic[sCommand])
				aCubic		= null;
		}

		return aPath.join('') + "e";
	};

	// presentation
	cSVGElement_path.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-path' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
						style="top:0;left:0;height:100%;width:100%;"\
						path="' + cSVGElement_path.convert(this.getAttribute("d")) + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_path.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
}
else {
	cSVGElement_path.handlers	= {
		"DOMAttrModified":	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "d":
//						this.pathSegList.$items	=
						break;
				}
			}
		},
		"DOMNodeInsertedIntoDocument":	function(oEvent) {
			this.pathSegList	= this.$getContainer().pathSegList;
		}
	};
};

// Register Element with language
oSVGNamespace.setElement("path", cSVGElement_path);
