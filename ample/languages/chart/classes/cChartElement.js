/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement	= function(sLocalName) {
	this.localName	= sLocalName;
};
cChartElement.prototype	= new ample.classes.Element;
cChartElement.prototype.namespaceURI	= "http://www.amplesdk.com/ns/chart";
cChartElement.prototype.localName		= "#element";

cChartElement.useVML	= navigator.userAgent.match(/MSIE ([\d.]+)/) && RegExp.$1 < 9;

cChartElement.setPath	= function(oElementDOM, sPath) {
	if (!cChartElement.useVML) {
		oElementDOM.setAttribute("d", sPath);
	}
	else {
		oElementDOM.path	= cChartElement.convert(sPath);
	}
};

cChartElement.setTextPosition	= function(oElementDOM, nX, nY) {
	if (!cChartElement.useVML) {
		oElementDOM.setAttribute("x", nX);
		oElementDOM.setAttribute("y", nY);
	}
	else {
		oElementDOM.style.left	= Math.round(nX) + "px";
		oElementDOM.style.top	= Math.round(nY) + "px";
	}
};

if (cChartElement.useVML) {
	// Add namespace
	document.namespaces.add("chart2vml", "urn:schemas-microsoft-com:vml", "#default#VML");

	cChartElement.hQuadratic	= {"Q":true, "q":true, "T":true, "t":true};
	cChartElement.hCubic		= {"C":true, "c":true, "S":true, "s":true};

	cChartElement.convert	= function(sValue) {
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
			if (!cChartElement.hQuadratic[sCommand])
				aQuadratic	= null;
			else
			if (!cChartElement.hCubic[sCommand])
				aCubic		= null;
		}

		return aPath.join('') + "e";
	};

	cChartElement.roundRectPath	= function(nX, nY, nWidth, nHeight, nRx, nRy) {
		if (nWidth && nHeight) {
			//
			if (nRx && !nRy)
				nRy	= nRx;
			else
			if (nRy && !nRx)
				nRx	= nRy;
			//
			if (nRx > nWidth / 2)
				nRx	= nWidth / 2;
			if (nRy > nHeight / 2)
				nRy	= nHeight / 2;

			return ["m", [nX + nRx, nY].map(Math.round),
					"l", [nX + nWidth - nRx, nY].map(Math.round),
					"wa", [nX + nWidth - 2 * nRx, nY, nX + nWidth, nY + 2 * nRy, nX + nWidth - nRx, nY, nX + nWidth, nY + nRy].map(Math.round),
					"l", [nX + nWidth, nY + nHeight - nRy].map(Math.round),
					"wa", [nX + nWidth - 2 * nRx, nY + nHeight - 2 * nRy, nX + nWidth, nY + nHeight, nX + nWidth, nY + nHeight - nRy, nX + nWidth - nRx, nY + nHeight].map(Math.round),
					"l", [nX + nRx, nY + nHeight].map(Math.round),
					"wa", [nX, nY + nHeight - 2 * nRy, nX + 2 * nRx, nY + nHeight, nX + nRx, nY + nHeight, nX, nY + nHeight - nRy].map(Math.round),
					"l", [nX, nY + nRy].map(Math.round),
					"wa", [nX, nY, nX + 2 * nRx, nY + 2 * nRy, nX, nY + nRy, nX + nRx, nY].map(Math.round),
					"x"].join(" ");
		}
		else
			return "";
	};

	cChartElement.applyCSS	= function(oElementDOM) {
		var sValue,
			sOpacity	= cChartElement.getCSSProperty(oElementDOM, "opacity") || "1";
		// Note! Setting opacity accounts for 50% of processing time!
		sValue	= cChartElement.getCSSProperty(oElementDOM, "fill-opacity") || sOpacity;
		cChartElement.setStyle(oElementDOM, "fill-opacity", sValue);
		sValue	= cChartElement.getCSSProperty(oElementDOM, "stroke-opacity") || sOpacity;
		cChartElement.setStyle(oElementDOM, "stroke-opacity", sValue);
		sValue	= cChartElement.getCSSProperty(oElementDOM, "stroke-width") || "1";
		cChartElement.setStyle(oElementDOM, "stroke-width", sValue);

		if (sValue = cChartElement.getCSSProperty(oElementDOM, "fill"))
			cChartElement.setStyle(oElementDOM, "fill", sValue);
		if (sValue = cChartElement.getCSSProperty(oElementDOM, "stroke"))
			cChartElement.setStyle(oElementDOM, "stroke", sValue);
		if (oElementDOM.path && oElementDOM.path.textpathok) {
			if (sValue = cChartElement.getCSSProperty(oElementDOM, "text-anchor"))
				cChartElement.setStyle(oElementDOM, "text-anchor", sValue);
			if (sValue = cChartElement.getCSSProperty(oElementDOM, "fontSize"))
				cChartElement.setStyle(oElementDOM, "font-size", sValue);
			if (sValue = cChartElement.getCSSProperty(oElementDOM, "fontFamily"))
				cChartElement.setStyle(oElementDOM, "font-family", sValue);
			if (sValue = cChartElement.getCSSProperty(oElementDOM, "fontWeight"))
				cChartElement.setStyle(oElementDOM, "font-weight", sValue);
			if (sValue = cChartElement.getCSSProperty(oElementDOM, "fontStyle"))
				cChartElement.setStyle(oElementDOM, "font-style", sValue);
		}
	};

	cChartElement.getCSSProperty	= function(oElementDOM, sName) {
		for (var sValue; oElementDOM.nodeType != 9; oElementDOM = oElementDOM.parentNode)
			if (sValue = oElementDOM.currentStyle[sName])
				return sValue;
		return null;
	};

	cChartElement.setStyle	= function(oElementDOM, sName, sValue) {
		switch (sName) {
			// opacity (general)
			case "opacity":
//				if (cSVGElement.getCSSProperty(oElement, "fill-opacity") == "")
					cChartElement.setStyle(oElementDOM, "fill-" + sName, sValue);
//				if (cSVGElement.getCSSProperty(oElement, "stroke-opacity") == "")
					cChartElement.setStyle(oElementDOM, "stroke-" + sName, sValue);
				break;
			// fill
			case "fill":
//				oElementDOM.fill.on	= sValue != "none";
				var aValue, oGradient;
				if (aValue = sValue.match(/url\(#([\w-]+)\)/)) {/*
					if (oGradient = oElement.ownerDocument.getElementById(aValue[1])) {
						if (oGradient instanceof cSVGElement_linearGradient || oGradient instanceof cSVGElement_radialGradient) {
							if (oGradient instanceof cSVGElement_linearGradient) {
								var x1	= parseFloat(oGradient.getAttribute("x1") || "0") / (oGradient.getAttribute("x1").indexOf("%") ==-1 ? 1 : 100),
									x2	= parseFloat(oGradient.getAttribute("x2") || "1") / (oGradient.getAttribute("x2").indexOf("%") ==-1 ? 1 : 100),
									y1	= parseFloat(oGradient.getAttribute("y1") || "0") / (oGradient.getAttribute("y1").indexOf("%") ==-1 ? 1 : 100),
									y2	= parseFloat(oGradient.getAttribute("y2") || "0") / (oGradient.getAttribute("y2").indexOf("%") ==-1 ? 1 : 100);

								if (x1 == x2 && y1 == y2) {
									oElementDOM.fill.type		= "solid";
								}
								else {
									oElementDOM.fill.type		= "gradient";
									oElementDOM.fill.focus		= y2 > y1 ? "0%" : "100%";
									oElementDOM.fill.angle		= 180 + Math.round(Math.atan((x1 - x2) / (y1 - y2)) * 180 / Math.PI);
								}
							}
							else {
								var cx	= parseFloat(oGradient.getAttribute("cx") || "0.5") / (oGradient.getAttribute("cx").indexOf("%") ==-1 ? 1 : 100),
									cy	= parseFloat(oGradient.getAttribute("cy") || "0.5") / (oGradient.getAttribute("cy").indexOf("%") ==-1 ? 1 : 100);
								oElementDOM.fill.type		= "gradientradial";
								oElementDOM.fill.focus		= "100%";	// Must be set to 100%, otherwise no gradient visible
								// Properties specific to radial gradients
								oElementDOM.fill.focusposition	= cx + " " + cy;
								oElementDOM.fill.focussize		= "0 0";//(oGradient.getAttribute("r") || 0) + " " + (oGradient.getAttribute("r") || 0);
							}
							// VML sigma fill method is most similar to SVG
							oElementDOM.fill.method		= "sigma";

							// Find referred gradient with stops
							for (var oGradientStop = oGradient; oGradientStop && oGradientStop.hasAttribute("xlink:href"); oGradientStop = oElement.ownerDocument.getElementById(oGradientStop.getAttribute("xlink:href").substr(1)))
								if (oGradientStop.hasChildNodes())
									break;

							if (oGradientStop) {
								// Collect stops
								var aColors	= [];
								for (var i = 0, oStop, sColor; oStop = oGradientStop.childNodes[i]; i++)
									if (oGradientStop.childNodes[i] instanceof cSVGElement_stop)
										aColors.push([parseFloat(oStop.getAttribute("offset") || "1") / (oStop.getAttribute("offset").indexOf("%") ==-1 ? 1 : 100), ((sColor = cSVGElement.getCSSProperty(oStop, "stop-color")) in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sColor] + ')' : sColor), cSVGElement.getCSSProperty(oStop, "stop-opacity") || "1"]);

								var nLength	= aColors.length;
								if (nLength) {
									// Order on offset
									aColors	= aColors.sort(function(color1, color2) {
										return color1[0] > color2[0];
									});

									// If there is no "0%" offset defined, set color1
									if (aColors[0][0] != 0)
										oElementDOM.fill.color		= aColors[0][1];
									// If there is no "100%" offset defined, set color2
									if (aColors[nLength - 1][0] != 1)
										oElementDOM.fill.color2		= aColors[nLength - 1][1];

									oElementDOM.fill.opacity	= aColors[0][2];
									oElementDOM.fill.opacity2	= aColors[nLength - 1][2];

									var aColors2	= [];
									for (var i = 0; i < nLength; i++)
										aColors2.push(aColors[i][0].toFixed(3) + " " + aColors[i][1]);

									oElementDOM.fill.colors.value	= aColors2.join(", ");
								}
							}
						}
						else
						if (oGradient instanceof cSVGElement_pattern) {
							// TODO: looks to be impossible to do
						}
					}*/
				}
				else
					oElementDOM.fill.color	= sValue in oChartElement_colors ? 'rgb(' + oChartElement_colors[sValue] + ')' : sValue;
				break;
			case "fill-opacity":
				if (oElementDOM.fill.opacity != sValue)
					oElementDOM.fill.opacity	= sValue;
				break;
			// strokes
			case "stroke":
//				oElementDOM.stroke.on	= sValue != "none";
				oElementDOM.stroke.color	= sValue in oChartElement_colors ? 'rgb(' + oChartElement_colors[sValue] + ')' : sValue;
				break;
			case "stroke-width":
				var aStroke	= sValue.match(/([\d.]+)(.*)/),
					nStrokeWidth	= aStroke[1] * 1,
					sStrokeUnit		= aStroke[2] || 'px';
				oElementDOM.stroke.weight	= nStrokeWidth + sStrokeUnit;
//				if (nStrokeWidth < 1 && !(oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan || oElement instanceof cSVGElement_textPath))
//					oElementDOM.stroke.opacity	= (oElement.hasAttribute("stroke-opacity") ? oElement.getAttribute("stroke-opacity") : 1) * nStrokeWidth;
				break;
			case "stroke-opacity":
				if (oElementDOM.stroke.opacity != sValue)
					oElementDOM.stroke.opacity	=/*(oElement.getAttribute("stroke-width").match(/([\d.]+)(.*)/) && RegExp.$1 < 1 ? RegExp.$1 : 1) */ sValue;
				break;
			case "stroke-linejoin":
				oElementDOM.stroke.joinStyle	= sValue;
				break;
			case "stroke-linecap":
				oElementDOM.stroke.endCap		= cSVGElement.strokeLineCapToEndCap(sValue);
				break;
			case "stroke-dasharray":
				oElementDOM.stroke.dashStyle	= sValue;
				break;
			// markers
			case "marker-start":
				oElementDOM.stroke.startarrow	= sValue == "none" ? "none" : "classic";
				break;
			case "marker-end":
				oElementDOM.stroke.endarrow	= sValue == "none" ? "none" : "classic";
				break;
			// fonts
			case "text-anchor":
				oElementDOM.childNodes[1].style["v-text-align"]	= cChartElement.textAnchorToVTextAlign(sValue);
				break;
			case "font-size":
				var aFontSize	= sValue.match(/(^[\d.]*)(.*)$/),
					sFontSizeUnit	= aFontSize[2] || "px",
					nFontSizeValue	= aFontSize[1],
					nFontSize	= Math.round(nFontSizeValue * 1),
					nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

				oElementDOM.style.marginTop	=-(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35) + "px";
				oElementDOM.childNodes[1].style.fontSize	= nFontSize + sFontSizeUnit;
				break;
			case "font-family":
				oElementDOM.childNodes[1].style.fontFamily	= "'" + sValue + "'";
				break;
			case "font-weight":
				oElementDOM.childNodes[1].style.fontWeight	= sValue;
				break;
			case "font-style":
				oElementDOM.childNodes[1].style.fontStyle	= sValue;
				break;
		}
	};

	cChartElement.textAnchorToVTextAlign	= function(sTextAnchor) {
		return {/*"start": "left", */"middle": "center", "end": "right"/*, "inherit": "left"*/}[sTextAnchor] || "left";
	};

	var oChartElement_colors	= {
		'aliceblue':	[240,248,255],
		'antiquewhite':	[250,235,215],
		'aqua':			[0,255,255],
		'aquamarine':	[127,255,212],
		'azure':		[240,255,255],
		'beige':		[245,245,220],
		'bisque':		[255,228,196],
		'black':		[0,0,0],
		'blanchedalmond':	[255,235,205],
		'blue':			[0,0,255],
		'blueviolet':	[138,43,226],
		'brown':		[165,42,42],
		'burlywood':	[222,184,135],
		'cadetblue':	[95,158,160],
		'chartreuse':	[127,255,0],
		'chocolate':	[210,105,30],
		'coral':		[255,127,80],
		'cornflowerblue':	[100,149,237],
		'cornsilk':		[255,248,220],
		'crimson':		[220,20,60],
		'cyan':			[0,255,255],
		'darkblue':		[0,0,139],
		'darkcyan':		[0,139,139],
		'darkgoldenrod':[184,134,11],
		'darkgray':		[169,169,169],
		'darkgreen':	[0,100,0],
		'darkkhaki':	[189,183,107],
		'darkmagenta':	[139,0,139],
		'darkolivegreen':	[85,107,47],
		'darkorange':	[255,140,0],
		'darkorchid':	[153,50,204],
		'darkred':		[139,0,0],
		'darksalmon':	[233,150,122],
		'darkseagreen':	[143,188,143],
		'darkslateblue':[72,61,139],
		'darkslategray':[47,79,79],
		'darkturquoise':[0,206,209],
		'darkviolet':	[148,0,211],
		'deeppink':		[255,20,147],
		'deepskyblue':	[0,191,255],
		'dimgray':		[105,105,105],
		'dodgerblue':	[30,144,255],
		'firebrick':	[178,34,34],
		'floralwhite':	[255,250,240],
		'forestgreen':	[34,139,34],
		'fuchsia':		[255,0,255],
		'gainsboro':	[220,220,220],
		'ghostwhite':	[248,248,255],
		'gold':			[255,215,0],
		'goldenrod':	[218,165,32],
		'gray':			[128,128,128],
		'green':		[0,128,0],
		'greenyellow':	[173,255,47],
		'honeydew':		[240,255,240],
		'hotpink':		[255,105,180],
		'indianred':	[205,92,92],
		'indigo':		[75,0,130],
		'ivory':		[255,255,240],
		'khaki':		[240,230,140],
		'lavender':		[230,230,250],
		'lavenderblush':[255,240,245],
		'lawngreen':	[124,252,0],
		'lemonchiffon':	[255,250,205],
		'lightblue':	[173,216,230],
		'lightcoral':	[240,128,128],
		'lightcyan':	[224,255,255],
		'lightgoldenrodyellow':	[250,250,210],
		'lightgreen':	[144,238,144],
		'lightgrey':	[211,211,211],
		'lightpink':	[255,182,193],
		'lightsalmon':	[255,160,122],
		'lightseagreen':[32,178,170],
		'lightskyblue':	[135,206,250],
		'lightslategray':	[119,136,153],
		'lightsteelblue':	[176,196,222],
		'lightyellow':	[255,255,224],
		'lime':			[0,255,0],
		'limegreen':	[50,205,50],
		'linen':		[250,240,230],
		'magenta':		[255,0,255],
		'maroon':		[128,0,0],
		'mediumaquamarine':	[102,205,170],
		'mediumblue':	[0,0,205],
		'mediumorchid':	[186,85,211],
		'mediumpurple':	[147,112,219],
		'mediumseagreen':	[60,179,113],
		'mediumslateblue':	[123,104,238],
		'mediumspringgreen':[0,250,154],
		'mediumturquoise':	[72,209,204],
		'mediumvioletred':	[199,21,133],
		'midnightblue':	[25,25,112],
		'mintcream':	[245,255,250],
		'mistyrose':	[255,228,225],
		'moccasin':		[255,228,181],
		'navajowhite':	[255,222,173],
		'navy':			[0,0,128],
		'oldlace':		[253,245,230],
		'olive':		[128,128,0],
		'olivedrab':	[107,142,35],
		'orange':		[255,165,0],
		'orangered':	[255,69,0],
		'orchid':		[218,112,214],
		'palegoldenrod':[238,232,170],
		'palegreen':	[152,251,152],
		'paleturquoise':[175,238,238],
		'palevioletred':[219,112,147],
		'papayawhip':	[255,239,213],
		'peachpuff':	[255,218,185],
		'peru':			[205,133,63],
		'pink':			[255,192,203],
		'plum':			[221,160,221],
		'powderblue':	[176,224,230],
		'purple':		[128,0,128],
		'red':			[255,0,0],
		'rosybrown':	[188,143,143],
		'royalblue':	[65,105,225],
		'saddlebrown':	[139,69,19],
		'salmon':		[250,128,114],
		'sandybrown':	[244,164,96],
		'seagreen':		[46,139,87],
		'seashell':		[255,245,238],
		'sienna':		[160,82,45],
		'silver':		[192,192,192],
		'skyblue':		[135,206,235],
		'slateblue':	[106,90,205],
		'slategray':	[112,128,144],
		'snow':			[255,250,250],
		'springgreen':	[0,255,127],
		'steelblue':	[70,130,180],
		'tan':			[210,180,140],
		'teal':			[0,128,128],
		'thistle':		[216,191,216],
		'tomato':		[255,99,71],
		'turquoise':	[64,224,208],
		'violet':		[238,130,238],
		'wheat':		[245,222,179],
		'white':		[255,255,255],
		'whitesmoke':	[245,245,245],
		'yellow':		[255,255,0],
		'yellowgreen':	[154,205,50]
	};
}

// Register Element
ample.extend(cChartElement);