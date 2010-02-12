/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement	= function(){};
cSVGElement.prototype	= new AMLElement;

cSVGElement.useVML	= !document.implementation || !document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");

if (cSVGElement.useVML) {
	// Add namespace
	document.namespaces.add("svg2vml", "urn:schemas-microsoft-com:vml", "#default#VML");

	cSVGElement.prototype.getBBox	= function() {
		var oBCRectRoot	= cSVGElement.getViewportElement(this).$getContainer().getBoundingClientRect(),
			oBCRectThis	= this.$getContainer().getBoundingClientRect(),
			oSVGRect	= new cSVGRect(
								oBCRectThis.left - oBCRectRoot.left + 1,	// Account for -0.75pt strange offset
								oBCRectThis.top - oBCRectRoot.top + 1,	// Account for -0.75pt strange offset
								oBCRectThis.right - oBCRectThis.left,
								oBCRectThis.bottom - oBCRectThis.top
			);

		return oSVGRect;
	};

	//
	cSVGElement.setTransform	= function(oElement, sValue) {
		var aCommands	= sValue.match(/\w+\([^\)]+\s*,?\)/g),
			nRotation	= 0,
			aMatrix		= cSVGElement.matrixCreate();

		var oElementDOM	= oElement.$getContainer();
		if (oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_image)
			oElementDOM	= oElement.$getContainer("shape");

		// Calculate final matrix
		for (var i = 0; i < aCommands.length; i++) {
			var aCommand	= aCommands[i].match(/(\w+)\(([^\)]+)\)/),
				sCommand	= aCommand[1],
				aParameters	= aCommand[2].split(/[\s,]/);

			switch (sCommand) {
				case "translate":	// (<tx> [<ty>])
					aMatrix	= cSVGElement.matrixMultiple(aMatrix, [
							[1,	0,	0],
							[0, 1,	0],
							[aParameters[0], aParameters.length > 1 ? aParameters[1] : 0, 1]
					]);
					break;

				case "matrix":		// (<a> <b> <c> <d> <e> <f>)
					aMatrix	= cSVGElement.matrixMultiple(aMatrix, [
							[aParameters[0],	aParameters[1],	0],
							[aParameters[2],	aParameters[3],	0],
							[aParameters[4], 	aParameters[5], 1]
					]);
					break;

				case "scale":		// <sx> [<sy>]
					var iScaleX	= aParameters[0],
						iScaleY	= aParameters.length > 1 ? aParameters[1] : iScaleX;

						aMatrix	= cSVGElement.matrixMultiple(aMatrix, [
								[iScaleX,	0,			0],
								[0,			iScaleY,	0],
								[0,			0, 			1]
						]);
					break;

				case "rotate":		// <rotate-angle> [<cx> <cy>]
					var iAngle	= aParameters[0] * Math.PI / 180,
						iCos	= Math.cos(iAngle),
						iSin	= Math.sin(iAngle);

					if (aParameters.length == 3) {
						aMatrix	= cSVGElement.matrixMultiple(aMatrix, [
    							[1,	0,	0],
    							[0,	1,	0],
    							[aParameters[1],	aParameters[2], 1]
    					]);
					}

					nRotation	= aParameters[0];

					aMatrix	= cSVGElement.matrixMultiple(aMatrix, [
							[iCos,	-iSin,	0],
							[iSin,	iCos,	0],
							[0,		0, 		1]
					]);

					if (aParameters.length == 3) {
						aMatrix	= cSVGElement.matrixMultiple(aMatrix, [
    							[1,	0,	0],
    							[0,	1,	0],
    							[-aParameters[1],	-aParameters[2], 1]
    					]);
					}
					break;

				case "skewX":		// <skew-angle>
					var iAngle	= aParameters[0] * Math.PI / 180,
						iTan	= Math.tan(iAngle);

					aMatrix	= cSVGElement.matrixMultiple(aMatrix, [
							[1,		iTan,	0],
							[0,		1,		0],
							[0,		0, 		1]
					]);
					break;

				case "skewY":		// <skew-angle>
					var iAngle	= aParameters[0] * Math.PI / 180,
						iTan	= Math.tan(iAngle);

					aMatrix	= cSVGElement.matrixMultiple(aMatrix, [
							[1,		0,		0],
							[iTan,	1,		0],
							[0,		0, 		1]
					]);
					break;
			}
		}

		if (oElementDOM.tagName == "group") {
			// Apply Translate
			oElementDOM.coordOrigin	= aMatrix[2][0] / aMatrix[0][0] *-1 + "," + aMatrix[2][1] / aMatrix[1][1] *-1;
/*
			// Find nearest parent coordSize
			var aCoordSize	= [0, 0];
			for (var oNode = oElementDOM; oNode = oNode.parentNode;)
				if (oNode.tagName == "group") {
					aCoordSize	= [oNode.coordSize.x, oNode.coordSize.y];
					break;
				}
*/
			// Apply Scale
//			oElementDOM.coordSize	= Math.round(aCoordSize[0] * aMatrix[0][0]) + "," + Math.round(aCoordSize[1] * aMatrix[1][1]);

//alert(aMatrix[2][0] / aMatrix[0][0] *-1 + "," + aMatrix[2][1] / aMatrix[1][1] *-1);
//			oElementDOM.style.marginTop		= Math.round(aMatrix[2][0] / aMatrix[0][0]) + "px";
//			oElementDOM.style.marginLeft	= Math.round(aMatrix[2][1] / aMatrix[1][1]) + "px";

			// Scale
			oElementDOM.style.width		= aMatrix[0][0] * 100 + '%';
			oElementDOM.style.height	= aMatrix[1][1] * 100 + '%';

			// skewing
			// TODO: Implement (possible?)

			// rotation
			oElementDOM.style.rotation	= nRotation;

			// Apply Translate (if filters are used)
//			oElementDOM.coordOrigin	= aMatrix[2][0] *-1 + "," + aMatrix[2][1] *-1;	// In case filters are used

			// Apply Matrix
//			oElementDOM.style.filter	= "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand',M11=" + aMatrix[0][0] + ",M21=" + aMatrix[1][0] + ",M12=" + aMatrix[0][1] + ",M22=" + aMatrix[1][1] + ")";
		}
		else {
			// Apply Translate
			oElementDOM.style.marginLeft	= Math.floor(aMatrix[2][0]) + "px";
			oElementDOM.style.marginTop		= Math.floor(aMatrix[2][1]) + "px";
			// Apply Matrix
			if (!oElementDOM.skew.on)
				oElementDOM.skew.on	= true;
			oElementDOM.skew.matrix	= aMatrix[0][0].toFixed(3) + "," + aMatrix[0][1].toFixed(3) + "," + aMatrix[1][0].toFixed(3) + "," + aMatrix[1][1].toFixed(3);// + "," + -1*aMatrix[2][0] + "," + -1*aMatrix[2][1];
//			oElementDOM.skew.offset	= "0,0";
//			oElementDOM.skew.origin	= "0,0";
//			oElementDOM.skew.offset	= aMatrix[2][0] + "px," + aMatrix[2][1] + "px";
		}
	};

	cSVGElement.getStyleOwn	= function(oElement, sName) {
		var sValue;

		// 1) first check if style specified
		if (sValue = oElement.getAttribute("style"))
			if (sValue.match(new RegExp(sName + "\\s*:\\s*([^;]+)")))
				return RegExp.$1;

		// 2) second check if attribute specified
		if (sValue = oElement.getAttribute(sName))
			return sValue;

		return '';
	};

	cSVGElement.setStyleOwn	= function(oElement, sName, sValue) {
		// other
		var oElementDOM	= oElement.$getContainer();
		if (oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_image)
			oElementDOM	= oElement.$getContainer("shape");

		// Some element do not have view, skip them
		if (!oElementDOM)
			return;

		switch (sName) {
			// opacity (general)
			case "opacity":
				if (cSVGElement.getStyle(oElement, "fill-opacity") == "")
					cSVGElement.setStyleOwn(oElement, "fill-opacity", sValue);
				if (cSVGElement.getStyle(oElement, "stroke-opacity") == "")
					cSVGElement.setStyleOwn(oElement, "stroke-opacity", sValue);
				break;
			// fill
			case "fill":
				oElementDOM.fill.on	= sValue != "none";
				var aValue, oGradient;
				if (aValue = sValue.match(/url\(#([\w-]+)\)/)) {
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
										aColors.push([parseFloat(oStop.getAttribute("offset") || "1") / (oStop.getAttribute("offset").indexOf("%") ==-1 ? 1 : 100), ((sColor = cSVGElement.getStyle(oStop, "stop-color")) in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sColor] + ')' : sColor), cSVGElement.getStyle(oStop, "stop-opacity") || "1"]);

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
					}
				}
				else
					oElementDOM.fill.color	= sValue in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sValue] + ')' : sValue;
				break;
			case "fill-opacity":
				if (oElementDOM.fill.opacity != sValue)
					oElementDOM.fill.opacity	= sValue;
				break;
			// strokes
			case "stroke":
				oElementDOM.stroke.on	= sValue != "none";
				oElementDOM.stroke.color	= sValue in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sValue] + ')' : sValue;
				break;
			case "stroke-width":
				var aStroke	= sValue.match(/([\d.]+)(.*)/),
					nStrokeWidth	= aStroke[1] * oElement.getAspectValue(),
					sStrokeUnit		= aStroke[2] || 'px';
				oElementDOM.stroke.weight	= nStrokeWidth + sStrokeUnit;
				if (nStrokeWidth < 1 && !(oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan || oElement instanceof cSVGElement_textPath))
					oElementDOM.stroke.opacity	= (oElement.hasAttribute("stroke-opacity") ? oElement.getAttribute("stroke-opacity") : 1) * nStrokeWidth;
				break;
			case "stroke-opacity":
				sValue	= (oElement.getAttribute("stroke-width").match(/([\d.]+)(.*)/) && RegExp.$1 < 1 ? RegExp.$1 : 1) * sValue;
				if (oElementDOM.stroke.opacity != sValue)
					oElementDOM.stroke.opacity	= sValue;
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
				oElement.$getContainer("label").style["v-text-align"]	= cSVGElement.textAnchorToVTextAlign(sValue);
				break;
			case "font-size":
				var aFontSize	= sValue.match(/(^[\d.]*)(.*)$/),
					sFontSizeUnit	= aFontSize[2] || "px",
					nFontSizeValue	= aFontSize[1],
					nFontSize	= Math.round(nFontSizeValue * oElement.getAspectValue()),
					nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

				oElementDOM.style.marginTop	=-(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35) + "px";
				oElement.$getContainer("label").style.fontSize	= nFontSize + sFontSizeUnit;
				break;
			case "font-family":
				oElement.$getContainer("label").style.fontFamily	= "'" + sValue + "'";
				break;
			case "font-weight":
				oElement.$getContainer("label").style.fontWeight	= sValue;
				break;
			case "font-style":
				oElement.$getContainer("label").style.fontStyle		= sValue;
				break;
		}
	};

	cSVGElement.getStyle	= function(oElement, sName) {
		var sValue	= cSVGElement.getStyleOwn(oElement, sName);
		if (sValue)
			return sValue;

		// 3) third check if parent is group
		if (oElement.parentNode instanceof cSVGElement_g || oElement.parentNode instanceof cSVGElement_text || oElement.parentNode instanceof cSVGElement_a)
			return cSVGElement.getStyle(oElement.parentNode, sName);

		return '';
	};

	cSVGElement.setStyle	= function(oElement, sName, sValue) {
		// groups
		if (oElement instanceof cSVGElement_g || oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_a)
			for (var nIndex = 0, oChild; oChild = oElement.childNodes[nIndex]; nIndex++)
				if (oChild.nodeType == 1 && !cSVGElement.getStyleOwn(oChild, sName))
					cSVGElement.setStyle(oChild, sName, sValue);
		if (!(oElement instanceof cSVGElement_g) && !(oElement instanceof cSVGElement_a))
			cSVGElement.setStyleOwn(oElement, sName, sValue);
	};

	cSVGElement.applyCSS	= function(oElement) {
		// Execute syns, as it only takes less than 10%
//		setTimeout(function() {
			var oElementDOM	= oElement.$getContainer();
			if (!oElementDOM)	// Element was removed
				return;
			var oStyle	= oElementDOM.currentStyle,
				sValue;
			// opacity (general)
			if (sValue = oStyle["opacity"])
				cSVGElement.setStyle(oElement, "opacity", sValue);
			// fills
			if (sValue = oStyle["fill"])
				cSVGElement.setStyle(oElement, "fill", sValue);
			if (sValue = oStyle["fill-opacity"])
				cSVGElement.setStyle(oElement, "fill-opacity", sValue);
			// strokes
			if (sValue = oStyle["stroke"])
				cSVGElement.setStyle(oElement, "stroke", sValue);
			if (sValue = oStyle["stroke-width"])
				cSVGElement.setStyle(oElement, "stroke-width", sValue);
			if (sValue = oStyle["stroke-opacity"])
				cSVGElement.setStyle(oElement, "stroke-opacity", sValue);
			if (sValue = oStyle["stroke-linejoin"])
				cSVGElement.setStyle(oElement, "stroke-linejoin", sValue);
			if (sValue = oStyle["stroke-linecap"])
				cSVGElement.setStyle(oElement, "stroke-linecap", sValue);
			if (sValue = oStyle["stroke-dasharray"])
				cSVGElement.setStyle(oElement, "stroke-dasharray", sValue);
			// Markers
			if (sValue = oStyle["marker-start"])
				cSVGElement.setStyle(oElement, "marker-start", sValue);
			if (sValue = oStyle["marker-end"])
				cSVGElement.setStyle(oElement, "marker-end", sValue);
			// Text module
			if (oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan || oElement instanceof cSVGElement_textPath) {
				if (!cSVGElement.getStyle(oElement, "text-anchor") && (sValue = oStyle["text-anchor"]))
					cSVGElement.setStyle(oElement, "text-anchor", sValue);
				if (!cSVGElement.getStyle(oElement, "font-weight") && (sValue = oStyle["fontWeight"]))
					cSVGElement.setStyle(oElement, "font-weight", sValue);
				if (!cSVGElement.getStyle(oElement, "font-family") && (sValue = oStyle["fontFamily"]))
					cSVGElement.setStyle(oElement, "font-family", sValue);
				if (!cSVGElement.getStyle(oElement, "font-size") && (sValue = oStyle["fontSize"]))
					cSVGElement.setStyle(oElement, "font-size", sValue);
				if (!cSVGElement.getStyle(oElement, "font-style") && (sValue = oStyle["fontStyle"]))
					cSVGElement.setStyle(oElement, "font-style", sValue);
			}
//		}, 0);
	};

	// Utilities
	cSVGElement.matrixCreate	= function() {
		return [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		];
	};

	cSVGElement.matrixMultiple	= function(aMatrix1, aMatrix2) {
		var aResult	= cSVGElement.matrixCreate();

		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				for (var z = 0, nResult = 0; z < 3; z++)
					nResult	+= aMatrix1[x][z] * aMatrix2[z][y];
				aResult[x][y]	= nResult;
			}
		}
		return aResult;
	};

	cSVGElement.getTransform	= function(oElement) {
		return "1,0,0,1";
	};

	//
	cSVGElement.getViewportElement	= function(oElement) {
		for (var oNode = oElement; oNode; oNode = oNode.parentNode)
			if (oNode instanceof cSVGElement_svg)
				return oNode;
		return null;
	};

	cSVGElement.prototype.getAspectValue	= function() {
		var nAspect	= 1;
		for (var oNode = this, sValue; oNode; oNode = oNode.parentNode) {
			if (oNode instanceof cSVGElement_svg) {
				var aViewBox= oNode.getAttribute("viewBox").split(/[\s,]/),
					aWidth	= oNode.getAttribute("width").match(/([\d.]+)([%\w]*)/),
					aHeight	= oNode.getAttribute("height").match(/([\d.]+)([%\w]*)/);
				// Assume some values
				if (aViewBox.length < 4) {
					if (!aWidth)
						aWidth	= [null, 600, "px"];
					if (!aHeight)
						aHeight	= [null, 600, "px"];
					aViewBox	= [0, 0, aWidth[1], aHeight[1]];
				}
				else {
					if (!aWidth)
						aWidth	= [null, aViewBox[2], "px"];
					if (!aHeight)
						aHeight	= [null, aViewBox[3], "px"];
				}

				nAspect	*= Math.sqrt(Math.pow(cSVGElement.toPixels(aWidth[1] + aWidth[2]), 2) + Math.pow(cSVGElement.toPixels(aHeight[1] + aHeight[2]), 2)) / Math.sqrt(Math.pow(aViewBox[2], 2) + Math.pow(aViewBox[3], 2));
				break;
			}
			else
			if (sValue = oNode.getAttribute("transform")) {
				var aCommands	= sValue.match(/\w+\([^\)]+\s*\)/g);
				if (aCommands) {
					for (var i = 0; i < aCommands.length; i++) {
						var aCommand	= aCommands[i].match(/(\w+)\(([^\)]+)\)/),
							sCommand	= aCommand[1],
							aParameters	= aCommand[2].split(/[\s,]/);

						// TODO: account for final matrix
						if (sCommand == "scale")
							nAspect	*= aParameters[0];
					}
				}
			}
		}
		return nAspect;
	};

	cSVGElement.toPixels	= function(sValue) {
		var aValue	= sValue.match(/([\d.]+)([%\w]*)/),
			nValue	= aValue[1];
		switch (aValue[2]) {
			case "pc":	// pica (1 pc is the same as 12 points)
				nValue	= nValue * 12;
			case "pt":	// point (1 pt is the same as 1/72 inch)
				nValue	= nValue / 72;	// in
			case "in":	// 1 inch = 1.57828283 × 10-5 mi
				nValue	= nValue * 2.54;
			case "cm":
				nValue	= nValue * 10;
			case "mm":
				nValue	= nValue / 0.264;
				break;
//			case "em":	// 1em is equal to the current font size
//				break;
//			case "ex":	// one ex is the x-height of a font (x-height is usually about half the font-size)
//				break;
//			case "%":
//				break;
			case "px":
			default:
				break;
		}
		return nValue;
	};

	cSVGElement.getTagStyle	= function(oElement) {
		var sOpacity		= cSVGElement.getStyle(oElement, "opacity"),
			sFill			= cSVGElement.getStyle(oElement, "fill"),
			sFillOpacity	= cSVGElement.getStyle(oElement, "fill-opacity") || sOpacity,
			sStroke			= cSVGElement.getStyle(oElement, "stroke"),
			sStrokeOpacity	= cSVGElement.getStyle(oElement, "stroke-opacity") || sOpacity,
			sStrokeWidth	= cSVGElement.getStyle(oElement, "stroke-width"),
			sStrokeLineJoin	= cSVGElement.getStyle(oElement, "stroke-linejoin") || 'miter',
			sStrokeLineCap	= cSVGElement.getStyle(oElement, "stroke-linecap") || 'square',
			sStrokeDashArray= cSVGElement.getStyle(oElement, "stroke-dasharray"),
			sTransform		= cSVGElement.getTransform(oElement);

		var aColor;
		// Process rgba
		if (sFill && sFill.match(/rgba\(([^\)]+)\)/)) {
			aColor	= RegExp.$1.split(/\s?,\s?/);
			sFillOpacity	*= aColor.pop();
			sFill	= 'rgb(' + aColor.join(',') + ')';
		}
		// Process rgba
		if (sStroke && sStroke.match(/rgba\(([^\)]+)\)/)) {
			aColor	= RegExp.$1.split(/\s?,\s?/);
			sStrokeOpacity	*= aColor.pop();
			sStroke	= 'rgb(' + aColor.join(',') + ')';
		}

		var aStrokeWidth	= sStrokeWidth.match(/([\d.]*)(.*)/),
			nStrokeWidthValue	=(aStrokeWidth[1] || 1) * oElement.getAspectValue(),
			sStrokeWidthUnit	=(aStrokeWidth[2] || "px");
		if (nStrokeWidthValue < 1 && !(oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan || oElement instanceof cSVGElement_textPath))
			sStrokeOpacity	=(sStrokeOpacity == '' ? 1 : sStrokeOpacity) * nStrokeWidthValue;

		return '<svg2vml:fill on="' + (sFill == "none" ? "false" : "true") + '" color="' + (sFill in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sFill] + ')' : sFill || 'black') + '"\
					' + (sFillOpacity ? ' opacity="' + sFillOpacity + '"' : '') + '\
				/><svg2vml:stroke on="' + (sStroke && sStroke != "none" ? "true" : "false") + '" color="' + (sStroke in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sStroke] + ')' : sStroke || 'black') + '"\
					' + (sStrokeOpacity ? ' opacity="' + sStrokeOpacity + '"' : '') + '\
					' + (sStrokeWidth ? ' weight="' + nStrokeWidthValue + sStrokeWidthUnit + '"' : '') + '\
					' + (sStrokeLineCap ? ' endCap="' + cSVGElement.strokeLineCapToEndCap(sStrokeLineCap) + '"' : '') + '\
					' + (sStrokeDashArray ? ' dashStyle="' + sStrokeDashArray.replace(/,/g, ' ') + '"' : '') + '\
					' + (sStrokeLineJoin ? ' joinStyle="' + sStrokeLineJoin + '"' : '') + '\
				/><svg2vml:skew on="' + (sTransform ? "true" : "false") + '"\
					' + (sTransform ? ' matrix="' + sTransform + '"' : '') + '/>';
	};
//	<svg2vml:shadow on="true" type="double" color="yellow" color2="green" offset="1pt" opacity="0.5"/>\
//	<svg2vml:extrusion xmetal="on" on="true" backdepth="20" xedge="5" xcolor="green" xrotationangle="0,5"/>\

	cSVGElement.strokeLineCapToEndCap	= function(sStrokeLineCap) {
		return {/*"square": "square", */"butt": "flat", "round": "round"}[sStrokeLineCap] || "square";
	};

	cSVGElement.textAnchorToVTextAlign	= function(sTextAnchor) {
		return {/*"start": "left", */"middle": "center", "end": "right"/*, "inherit": "left"*/}[sTextAnchor] || "left";
	};

	cSVGElement.parseUnit	= function(sValue) {
		var aValue	= sValue.match(/(^\d*(?:.\d+))\s*([a-z%]+)?$/);
		return aValue ? [aValue[1], aValue[2] || ''] : [0, ''];
	};

	var oSVGElement_colors	= {
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
else {
	cSVGElement.prototype.setAttribute	= function(sName, sValue) {
		var oElementDOM	= this.$getContainer();
		// Map attribute value (only when in the live tree)
		if (oElementDOM && sName != "id" && sName != "class")
			oElementDOM.setAttribute(sName, sValue);

		//
		AMLElement.prototype.setAttribute.call(this, sName, sValue);
	};

	cSVGElement.prototype.removeAttribute	= function(sName) {
		var oElementDOM	= this.$getContainer();
		// Map attribute value (only when in the live tree)
		if (oElementDOM && sName != "id" && sName != "class")
			oElementDOM.removeAttribute(sName);

		//
		AMLElement.prototype.removeAttribute.call(this, sName);
	};

	cSVGElement.prototype.getBBox	= function() {
		return this.$getContainer().getBBox();
	};

	// Default Element Render: open
	cSVGElement.prototype.$getTagOpen	= function()
	{
		var sHtml   = '<' + this.tagName;
		for (var sName in this.attributes)
			if (sName != "id" && sName != "class")// && sName.indexOf(':') ==-1)
				sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
		sHtml	+= ' class="' + ('svg-' + this.localName + ' ') + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
	    return sHtml + '>';
	};

	// Default Element Render: close
	cSVGElement.prototype.$getTagClose	= function()
	{
	    return '</' + this.tagName + '>';
	};
};

// Register Element with language
oSVGNamespace.setElement("#element", cSVGElement);
