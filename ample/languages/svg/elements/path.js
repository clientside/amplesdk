/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
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
cSVGElement_path.prototype	= new cSVGElement("path");

//
cSVGElement_path.prototype.pathSegList				= null;
//cSVGElement_path.prototype.normalizedPathSegList	= null;
//cSVGElement_path.prototype.animatedPathSegList				= null;
//cSVGElement_path.prototype.animatedNormalizedPathSegList	= null;

cSVGElement_path.prototype.pathLength	= 0;

cSVGElement_path.prototype.getTotalLength	= function() {
	throw new ample.classes.DOMException(DOMException.NOT_SUPPORTED_ERR);
};

cSVGElement_path.prototype.getPointAtLength	= function(nDistance) {
	throw new ample.classes.DOMException(DOMException.NOT_SUPPORTED_ERR);
};

cSVGElement_path.prototype.getPathSegAtLength	= function(nDistance) {
	throw new ample.classes.DOMException(DOMException.NOT_SUPPORTED_ERR);
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
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

			// Apply gradients
			if ((sValue = this.$getStyleComputed("fill")) && sValue.substr(0, 3) == "url")
				this.$setStyle("fill", sValue);

			// Apply transformation
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_path.prototype.$mapAttribute	= function(sName, sValue) {
		if (sName == "d")
			this.$getContainer().path	= cSVGElement_path.convert(sValue);
		else
			cSVGElement.prototype.$mapAttribute.call(this, sName, sValue);
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
			aPath		= [];

		if (!aCommands)
			return '';

		for (var i = 0, sCommand, aParameters, nParameters, nCommands = aCommands.length; i < nCommands; i++) {
			sCommand	= aCommands[i].substr(0, 1);
			aParameters	= aCommands[i].substr(1).
								replace(/(\d)-/g, '$1,-').
								replace(/^\s+|\s+$/g, '').
								split(/[,\s]/).map(function(nValue) {
									return nValue * 1;
								}),
			nParameters	= aParameters.length;

			switch (sCommand) {
				// moveto (x y)+
				case "M":
					iCurrentX	= aParameters[0];
					iCurrentY	= aParameters[1];
					iStartX		= iCurrentX;
					iStartY		= iCurrentY;
					aPath.push("m" + aParameters.slice(0, 2).map(Math.round) + " ");

					// If there are more that 2 parameters, draw line out of the rest of parameters
					if (nParameters == 2)
						break;
					else {
						aParameters	= aParameters.slice(2);
						nParameters-= 2;
					}

				// lineto (x y)+
				case "L":
					iCurrentX	= aParameters[nParameters - 2];
					iCurrentY	= aParameters[nParameters - 1];
					aPath.push("l" + aParameters.map(Math.round) + " ");
					break;

				case "m":
					iCurrentX	+= aParameters[0];
					iCurrentY	+= aParameters[1];
					iStartX		= iCurrentX;
					iStartY		= iCurrentY;
					aPath.push("t" + aParameters.slice(0, 2).map(Math.round) + " ");

					// If there are more that 2 parameters, draw line out of the rest of parameters
					if (nParameters == 2)
						break;
					else {
						aParameters	= aParameters.slice(2);
						nParameters-= 2;
					}

				case "l":
					for (var j = 0; j < nParameters; j+= 2) {
						iCurrentX	+= aParameters[j];
						iCurrentY	+= aParameters[j + 1];
					}
					aPath.push("r" + aParameters.map(Math.round) + " ");
					break;

				// horizontal lineto x+
				case "H":
					for (var j = 0; j < nParameters; j+=1) {
						aPath.push("l" + [aParameters[j], iCurrentY].map(Math.round) + " ");
					}
					iCurrentX	= aParameters[nParameters - 1];
					break;

				case "h":
					for (var j = 0; j < nParameters; j+=1) {
						aPath.push("r" + [aParameters[j], 0].map(Math.round) + " ");
						iCurrentX	+= aParameters[j];
					}
					break;

				// vertical lineto y+
				case "V":
					for (var j = 0; j < nParameters; j+=1) {
						aPath.push("l" + [iCurrentX, aParameters[j]].map(Math.round) + " ");
					}
					iCurrentY	= aParameters[nParameters - 1];
					break;

				case "v":
					for (var j = 0; j < nParameters; j+=1) {
						aPath.push("r" + [0, aParameters[j]].map(Math.round) + " ");
						iCurrentY	+= aParameters[j];
					}
					break;

				// curveto (x1 y1 x2 y2 x y)+
				case "C":
					aPath.push("c" + aParameters.map(Math.round) + " ");
					iCurrentX	= aParameters[nParameters - 2];
					iCurrentY	= aParameters[nParameters - 1];
					aCubic	= [aParameters[nParameters - 4], aParameters[nParameters - 3]];
					break;

				case "c":
					aPath.push("v" + aParameters.map(Math.round) + " ");
					iCurrentX	+= aParameters[nParameters - 2];
					iCurrentY	+= aParameters[nParameters - 1];
					aCubic	= [aParameters[nParameters - 4], aParameters[nParameters - 3]];
					break;

				// shorthand/smooth curveto (x2 y2 x y)+
				case "S":
					for (var j = 0; j < nParameters; j+=4) {
						aPath.push("c" + [iCurrentX + (aCubic ? iCurrentX - aCubic[0] : 0), iCurrentY + (aCubic ? iCurrentY - aCubic[1] : 0)].map(Math.round) + "," + aParameters.slice(j, j + 4).map(Math.round) + " ");
						aCubic	= [aParameters[j], aParameters[j + 1]];
						iCurrentX	= aParameters[j + 2];
						iCurrentY	= aParameters[j + 3];
					}
					break;

				case "s":
					for (var j = 0; j < nParameters; j+=4) {
						aPath.push("v" + [(aCubic ? aParameters[j + 2] - aCubic[0] : 0), (aCubic ? aParameters[j + 3] - aCubic[1] : 0)].map(Math.round) + "," + aParameters.slice(j, j + 4).map(Math.round) + " ");
						aCubic	= [aParameters[j], aParameters[j + 1]];
						iCurrentX	+= aParameters[j + 2];
						iCurrentY	+= aParameters[j + 3];
					}
					break;

				// quadratic Bézier curveto (x1 y1 x y)+
				case "Q":	// Using Cubic Bezier in IE
					for (var j = 0; j < nParameters; j+=4) {
						aPath.push("c" + [iCurrentX, iCurrentY].map(Math.round) + "," + aParameters.slice(j, j + 4).map(Math.round) + " ");
						aQuadratic	= [aParameters[j], aParameters[j + 1]];
						iCurrentX	= aParameters[j + 2];
						iCurrentY	= aParameters[j + 3];
					}
					break;

				case "q":	// Using Cubic Bezier in IE
					for (var j = 0; j < nParameters; j+=4) {
						aPath.push("v0,0" + "," + aParameters.slice(j, j + 4).map(Math.round) + " ");
						aQuadratic	= [aParameters[j], aParameters[j + 1]];
						iCurrentX	+= aParameters[j + 2];
						iCurrentY	+= aParameters[j + 3];
					}
					break;

				// Shorthand/smooth quadratic Bézier curveto (x y)+
				case "T":	// Using Cubic Bezier in IE
					for (var j = 0; j < nParameters; j+=2) {
						aPath.push("c" + [iCurrentX, iCurrentY].map(Math.round) + "," + [iCurrentX + (aQuadratic ? iCurrentX - aQuadratic[0] : 0), iCurrentY + (aQuadratic ? iCurrentY - aQuadratic[1] : 0)].map(Math.round) + "," + aParameters.slice(j, j +2).map(Math.round) + " ");
						iCurrentX	= aParameters[j + 2];
						iCurrentY	= aParameters[j + 3];
					}
					break;

				case "t":	// Using Cubic Bezier in IE
					for (var j = 0; j < nParameters; j+=2) {
						aPath.push("v0,0" + "," + [(aQuadratic ? aParameters[j] - aQuadratic[0] : 0), (aQuadratic ? aParameters[j + 1] - aQuadratic[1] : 0)].map(Math.round) + "," + aParameters.slice(j, j +2).map(Math.round) + " ");
						iCurrentX	+= aParameters[j];
						iCurrentY	+= aParameters[j + 1];
					}
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

					var a	= (iToX - iCurrentX) / (2 * iRadiusX),
						b	= (iToY - iCurrentY) / (2 * iRadiusY),
						c	= Math.sqrt(Math.abs(1 - 1 / (a * a + b * b))) * (bLargeArc == bSweep ? -1 : 1),
						iCenterX	= iCurrentX + iRadiusX * (a - c * b),
						iCenterY	= iCurrentY + iRadiusY * (b + c * a);
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
						style="position:absolute;top:0;left:0;height:100%;width:100%;"\
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

// Register Element
ample.extend(cSVGElement_path);
