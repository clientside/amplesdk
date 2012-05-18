/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement	= function(sLocalName) {
	this.localName	= sLocalName;
};
cSVGElement.prototype	= new ample.classes.Element;
cSVGElement.prototype.namespaceURI	= "http://www.w3.org/2000/svg";
cSVGElement.prototype.localName		= "-element";

cSVGElement.useVML	= navigator.userAgent.match(/MSIE ([\d.]+)/) && RegExp.$1 < 9;

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

	cSVGElement.getMatrix	= function(oElement) {
		var aMatrix		= cSVGElement.matrixCreate();
		for (var oParent = oElement; !(oParent instanceof cSVGElement_svg); oParent = oParent.parentNode)
			aMatrix	= cSVGElement.matrixMultiply(cSVGElement.getMatrixOwn(oParent), aMatrix);
		return aMatrix;
	};

	cSVGElement.getMatrixOwn	= function(oElement) {
		var sValue		= oElement.attributes["transform"] || '',
			aCommands	= sValue.match(/\w+\([^\)]+\s*,?\)/g),
			aMatrix		= cSVGElement.matrixCreate();

		if (aCommands) {
			// Calculate final matrix
			for (var i = 0; i < aCommands.length; i++) {
				var aCommand	= aCommands[i].match(/(\w+)\(([^\)]+)\)/),
					sCommand	= aCommand[1],
					aParameters	= aCommand[2].split(/[\s,]+/).map(function(nValue) {
						return nValue * 1.0;
					});

				switch (sCommand) {
					case "translate":	// (<tx> [<ty>])
						aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [1,	0,	aParameters[0]],
																		[0, 1,	aParameters.length > 1 ? aParameters[1] : 0],
																		[0, 0,	1]]);
						break;

					case "matrix":		// (<a> <b> <c> <d> <e> <f>)
						aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [aParameters[0],	aParameters[2],	aParameters[4]],
																		[aParameters[1],	aParameters[3],	aParameters[5]],
																		[0,	0, 1]]);
						break;

					case "scale":		// <sx> [<sy>]
						var iScaleX	= aParameters[0],
							iScaleY	= aParameters.length > 1 ? aParameters[1] : iScaleX;

						aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [iScaleX,	0,		0],
																		[0,		iScaleY,	0],
																		[0,		0,			1]]);
						break;

					case "rotate":		// <rotate-angle> [<cx> <cy>]
						var iAngle	= aParameters[0] * Math.PI / 180,
							iCos	= Math.cos(iAngle),
							iSin	= Math.sin(iAngle);

						// Move to the point of rotation
						if (aParameters.length == 3)
							aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [1,	0,	aParameters[1]],
																			[0,	1,	aParameters[2]],
																			[0,	0, 1]]);
						// Rotation
						aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [iCos,	-iSin,	0],
																		[iSin,	iCos,	0],
																		[0,		0,		1]]);
						// Move back to the origin
						if (aParameters.length == 3)
							aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [1,	0,	-aParameters[1]],
																			[0,	1,	-aParameters[2]],
																			[0,	0, 1]]);
						break;

					case "skewX":		// <skew-angle>
						var iAngle	= aParameters[0] * Math.PI / 180,
							iTan	= Math.tan(iAngle);

						aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [1,		iTan,	0],
																		[0,		1,		0],
																		[0,		0,		1]]);
						break;

					case "skewY":		// <skew-angle>
						var iAngle	= aParameters[0] * Math.PI / 180,
							iTan	= Math.tan(iAngle);

						aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [1,		0,		0],
																		[iTan,	1,		0],
																		[0,		0,		1]]);
						break;
				}
			}
		}

		return aMatrix;
	};

	cSVGElement.setMatrixOwn	= function(oElement, aMatrix) {
		var oElementDOM	= oElement.$getContainer(),
			aAspect	= cSVGElement.getAspectRatio(oElement);

		if (oElement instanceof cSVGElement_image || oElement instanceof cSVGElement_foreignObject) {
			// Different transformation for images
			var oMatrix	= oElementDOM.filters.item('DXImageTransform.Microsoft.Matrix');
			if (aMatrix[0][0] != 1 || aMatrix[1][1] != 1 || aMatrix[0][1] != 0 || aMatrix[1][0] != 0) {
				oMatrix.M11	= aMatrix[0][0];
				oMatrix.M12	= aMatrix[0][1];
				oMatrix.M21	= aMatrix[1][0];
				oMatrix.M22	= aMatrix[1][1];
				oMatrix.enabled	= true;
			}
			else
				oMatrix.enabled	= false;
			// Translate
			aMatrix	= cSVGElement.matrixMultiply(aMatrix, [[1, 0, oElement.getAttribute("x") || 0], [0, 1, oElement.getAttribute("y") || 0], [0, 0, 1]]);
			//
			oElementDOM.style.left	= Math.round(aMatrix[0][2]) + "px";
			oElementDOM.style.top	= Math.round(aMatrix[1][2]) + "px";
		}
		else {
			if (oElementDOM.tagName == "group")
				oElementDOM	= oElementDOM.getElementsByTagName("shape")[0];
			if (!oElementDOM)
				return;

			// Apply Transformation
			if (!oElementDOM.skew.on)
				oElementDOM.skew.on	= true;
			oElementDOM.skew.matrix	= [aMatrix[0][0], aMatrix[0][1], aMatrix[1][0], aMatrix[1][1], 0, 0].map(function(nValue) {
				return nValue.toFixed(8);
			});

			oElementDOM.skew.offset	= Math.floor(aMatrix[0][2] * aAspect[0]) + "px" + " " + Math.floor(aMatrix[1][2] * aAspect[1]) + "px";
		}
	};

	cSVGElement.applyTransform	= function(oElement) {
		if (!(oElement instanceof cSVGElement_g))
			cSVGElement.setMatrixOwn(oElement, cSVGElement.getMatrix(oElement));
		else
			for (var nIndex = 0; nIndex < oElement.childNodes.length; nIndex++)
				if (oElement.childNodes[nIndex].nodeType == 1)
					cSVGElement.applyTransform(oElement.childNodes[nIndex]);
	};

	// Note! Performance optimization: Getting attribute values in a hacky way here ".attributes[]" instead of ".getAttribute()"
	cSVGElement.prototype.$getStyle	= function(sName) {
		var sValue;

		// 1) first check if style specified
		if (sValue = this.attributes["style"])
			if (sValue.match(new RegExp(sName + "\\s*:\\s*[\'\"]?\\s*([^;\'\"]+)\\s*[\'\"]?")))
				return RegExp.$1;

		// 2) second check if attribute specified
		if (sValue = this.attributes[sName])
			return sValue;

		return '';
	};

	cSVGElement.prototype.$setStyle	= function(sName, sValue) {
		var oElementDOM	= this.$getContainer();
		if (this instanceof cSVGElement_text)
			oElementDOM	= oElementDOM.getElementsByTagName("shape")[0];

		// Some element do not have view, skip them
		if (!oElementDOM)
			return;

		switch (sName) {
			// opacity (general)
			case "opacity":
				if (this instanceof cSVGElement_image) {
					var oAlpha	= oElementDOM.filters.item('DXImageTransform.Microsoft.Alpha');
					oAlpha.enabled	= sValue != 1;
					oAlpha.opacity	= sValue * 100;
				}
				else {
					this.$setStyle("fill-opacity", this.$getStyleComputed("fill-opacity"));
					this.$setStyle("stroke-opacity", this.$getStyleComputed("stroke-opacity"));
				}
				break;
			// fill
			case "fill":
				oElementDOM.fill.on	= sValue != "none";
				var aValue, oGradient;
				if (aValue = sValue.match(/url\(['"]?#([^'")]+)['"]?\)/)) {
					if (oGradient = this.ownerDocument.getElementById(aValue[1])) {
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
								oElementDOM.fill.type		= "gradientTitle";
								oElementDOM.fill.focus		= "100%";	// Must be set to 100%, otherwise no gradient visible
								// Properties specific to radial gradients
								oElementDOM.fill.focusposition	= "0.5 0.5";	// cx + " " + cy
								oElementDOM.fill.focussize		= "0 0";//(oGradient.getAttribute("r") || 0) + " " + (oGradient.getAttribute("r") || 0);
							}
							// VML sigma fill method is most similar to SVG
							oElementDOM.fill.method		= "sigma";

							// Find referred gradient with stops
							for (var oGradientStop = oGradient; oGradientStop && oGradientStop.hasAttribute("xlink:href"); oGradientStop = this.ownerDocument.getElementById(oGradientStop.getAttribute("xlink:href").substr(1)))
								if (oGradientStop.hasChildNodes())
									break;

							if (oGradientStop) {
								// Collect stops
								var aColors	= [],
									nOpacity	=(this.$getStyleComputed("opacity") || 1) * (this.$getStyleComputed("fill-opacity") || 1);
								for (var i = 0, oStop, sColor; oStop = oGradientStop.childNodes[i]; i++)
									if (oGradientStop.childNodes[i] instanceof cSVGElement_stop)
										aColors.push([parseFloat(oStop.getAttribute("offset") || "1") / (oStop.getAttribute("offset").indexOf("%") ==-1 ? 1 : 100), ((sColor = oStop.$getStyle("stop-color")) in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sColor] + ')' : cSVGElement.correctColor(sColor)), nOpacity * parseFloat(oStop.$getStyle("stop-opacity") || "1")]);

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

									var aColors2	= [];
									for (var i = 0; i < nLength; i++)
										aColors2.push(aColors[i][0].toFixed(3) + " " + aColors[i][1]);

									oElementDOM.fill.colors.value	= aColors2.join(", ");
									oElementDOM.fill.opacity	= aColors[nLength - 1][2];
//									oElementDOM.fill.opacity2	= aColors[0][2];	// Disabled since it produces strange effect in, Z.B. grapes.xml
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
					oElementDOM.fill.color	= sValue in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sValue] + ')' : cSVGElement.correctColor(sValue);
				break;
			case "fill-opacity":
				if (sValue == null || sValue == "")
					sValue	= 1;
				sValue	=(this.$getStyleComputed("opacity") || 1) * sValue;
				if (sValue > 1)
					sValue	= 1;
				if (oElementDOM.fill.opacity != sValue)
					oElementDOM.fill.opacity	= sValue;
				break;
			// strokes
			case "stroke":
				oElementDOM.stroke.on	= sValue != "none";
				oElementDOM.stroke.color	= sValue in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sValue] + ')' : cSVGElement.correctColor(sValue);
				break;
			case "stroke-width":
				var aStrokeWidth	= sValue.match(/([\d.]+)(.*)/),
					nStrokeWidth	= aStrokeWidth[1] * cSVGElement.getScaleFactor(this) * Math.sqrt(Math.abs(cSVGElement.matrixDeterminant(cSVGElement.getMatrix(this))));
				oElementDOM.stroke.weight	= nStrokeWidth + (aStrokeWidth[2] || 'px');
				if (nStrokeWidth < 1 && !(this instanceof cSVGElement_text || this instanceof cSVGElement_tspan || this instanceof cSVGElement_textPath))
					oElementDOM.stroke.opacity	= (this.attributes["stroke-opacity"] || 1) * nStrokeWidth;
				else
					oElementDOM.stroke.opacity	= 1;
				break;
			case "stroke-opacity":
				if (sValue == null || sValue == "")
					sValue	= 1;
				sValue	=(this.$getStyleComputed("opacity") || 1) * sValue;
				var aStrokeWidth,
					nStrokeWidth	= 1;
				if (aStrokeWidth =(this.$getStyleComputed("stroke-width") || "1").match(/([\d.]+)(.*)/)) {
					nStrokeWidth	= aStrokeWidth[1] * cSVGElement.getScaleFactor(this) * Math.sqrt(Math.abs(cSVGElement.matrixDeterminant(cSVGElement.getMatrix(this))));
					if (nStrokeWidth < 1 && !(this instanceof cSVGElement_text || this instanceof cSVGElement_tspan || this instanceof cSVGElement_textPath))
						sValue	= sValue * nStrokeWidth;
				}
				if (sValue > 1)
					sValue	= 1;
				if (oElementDOM.stroke.opacity != sValue)
					oElementDOM.stroke.opacity	= sValue;
				break;
			case "stroke-linejoin":
				oElementDOM.stroke.joinStyle	= sValue;
				break;
			case "stroke-miterlimit":
				oElementDOM.stroke.miterLimit	= sValue;
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
				oElementDOM.getElementsByTagName("textpath")[0].style["v-text-align"]	= cSVGElement.textAnchorToVTextAlign(sValue);
				break;
			case "font-size":
				var aFontSize	= sValue.match(/(^[\d.]*)(.*)$/),
					sFontSizeUnit	= aFontSize[2] || "px",
					nFontSizeValue	= aFontSize[1],
					nFontSize	= Math.round(nFontSizeValue * cSVGElement.getScaleFactor(this)),
					nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

				oElementDOM.style.marginTop	=-(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35) + "px";
				oElementDOM.getElementsByTagName("textpath")[0].style.fontSize	= nFontSize + sFontSizeUnit;
				break;
			case "font-family":
				oElementDOM.getElementsByTagName("textpath")[0].style.fontFamily	= "'" + sValue + "'";
				break;
			case "font-weight":
				oElementDOM.getElementsByTagName("textpath")[0].style.fontWeight	= sValue;
				break;
			case "font-style":
				oElementDOM.getElementsByTagName("textpath")[0].style.fontStyle		= sValue;
				break;
			case "visibility":
				oElementDOM.style.visibility	= sValue;
				break;
		}
	};

	cSVGElement.prototype.$getStyleComputed	= function(sName) {
		var sValue	= this.$getStyle(sName);
		if (sValue == "currentColor")
			return oElement.$getStyleComputed("color");

		if (sValue && sValue != "inherit")
			return sValue;

		// check if parent is group
		var oParent	= this.parentNode;
		if (oParent && (sValue == "inherit" || oParent instanceof cSVGElement_g || oParent instanceof cSVGElement_text || oParent instanceof cSVGElement_a))
			return this.parentNode.$getStyleComputed(sName);

		return '';
	};

	// Should never be called on groups
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
				oElement.$setStyle("opacity", sValue);
			// fills
			if (sValue = oStyle["fill"])
				oElement.$setStyle("fill", sValue);
			if (sValue = oStyle["fill-opacity"])
				oElement.$setStyle("fill-opacity", sValue);
			// strokes
			if (sValue = oStyle["stroke"])
				oElement.$setStyle("stroke", sValue);
			if (sValue = oStyle["stroke-width"])
				oElement.$setStyle("stroke-width", sValue);
			if (sValue = oStyle["stroke-opacity"])
				oElement.$setStyle("stroke-opacity", sValue);
			if (sValue = oStyle["stroke-linejoin"])
				oElement.$setStyle("stroke-linejoin", sValue);
			if (sValue = oStyle["stroke-miterlimit"])
				oElement.$setStyle("stroke-miterlimit", sValue);
			if (sValue = oStyle["stroke-linecap"])
				oElement.$setStyle("stroke-linecap", sValue);
			if (sValue = oStyle["stroke-dasharray"])
				oElement.$setStyle("stroke-dasharray", sValue);
			// Markers
			if (sValue = oStyle["marker-start"])
				oElement.$setStyle("marker-start", sValue);
			if (sValue = oStyle["marker-end"])
				oElement.$setStyle("marker-end", sValue);
			// Text module
			if (oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan || oElement instanceof cSVGElement_textPath) {
				if (!oElement.$getStyleComputed("text-anchor") && (sValue = oStyle["text-anchor"]))
					oElement.$setStyle("text-anchor", sValue);
				if (!oElement.$getStyleComputed("font-weight") && (sValue = oStyle["fontWeight"]))
					oElement.$setStyle("font-weight", sValue);
				if (!oElement.$getStyleComputed("font-family") && (sValue = oStyle["fontFamily"]))
					oElement.$setStyle("font-family", sValue);
				if (!oElement.$getStyleComputed("font-size") && (sValue = oStyle["fontSize"]))
					oElement.$setStyle("font-size", sValue);
				if (!oElement.$getStyleComputed("font-style") && (sValue = oStyle["fontStyle"]))
					oElement.$setStyle("font-style", sValue);
			}
//		}, 0);
	};

	cSVGElement.applyCSSSizes	= function(oElement) {
		var oElementDOM	= oElement.$getContainer();
		if (!oElementDOM)	// Element was removed
			return;
		var oStyle	= oElementDOM.currentStyle,
			sValue;
		if (sValue = (oStyle["stroke-width"] || oElement.$getStyleComputed("stroke-width")))
			oElement.$setStyle("stroke-width", sValue);
		if (sValue = (oStyle["stroke-opacity"] || oElement.$getStyleComputed("stroke-opacity")))
			oElement.$setStyle("stroke-opacity", sValue);
		// Text module
		if (oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan || oElement instanceof cSVGElement_textPath) {
			if (sValue = oElement.$getStyleComputed("font-size"))
				oElement.$setStyle("font-size", sValue);
		}
		for (var oChild = oElement.firstChild; oChild; oChild = oChild.nextSibling)
			if (!(oChild instanceof cSVGElement_g))
				cSVGElement.applyCSSSizes(oChild);
	};

	// Utilities
	cSVGElement.matrixCreate	= function() {
		return [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		];
	};

	cSVGElement.matrixMultiply	= function(aMatrix1, aMatrix2) {
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

	cSVGElement.matrixDeterminant	= function(aMatrix) {
		return aMatrix[0][0] * aMatrix[1][1] - aMatrix[0][1] * aMatrix[1][0];
	};

	//
	cSVGElement.getViewportElement	= function(oElement) {
		for (var oNode = oElement; oNode; oNode = oNode.parentNode)
			if (oNode instanceof cSVGElement_svg)
				return oNode;
		return null;
	};

	cSVGElement.getAspectRatio		= function(oElement) {
		var aAspect	= [1, 1],
			oNode	= cSVGElement.getViewportElement(oElement);
		if (oNode) {
			var aViewBox= (oNode.attributes["viewBox"] || "").split(/[\s,]/),
				aWidth	= (oNode.attributes["width"] || "").match(/([\d.]+)([%\w]*)/),
				aHeight	= (oNode.attributes["height"] || "").match(/([\d.]+)([%\w]*)/);
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

			if (aWidth[2] == "%" || aHeight[2] == "%") {
				var oBCRect		= oNode.getBoundingClientRect();
				if (aWidth[2] == "%") {
					if (oBCRect.right - oBCRect.left) {
						aWidth		= [null, oBCRect.right - oBCRect.left, "px"];
						aHeight		= [null,(oBCRect.right - oBCRect.left)/(aViewBox[2] / aViewBox[3]), "px"];
					}
				}
				else
				if (aHeight[2] == "%") {
					if (oBCRect.bottom - oBCRect.top) {
						aHeight	= [null,(oBCRect.bottom - oBCRect.top)*(aViewBox[2] / aViewBox[3]), "px"];
						aWidth	= [null, oBCRect.bottom - oBCRect.top, "px"];
					}
				}
			}

			// Account for fitting
			var nRatio	= (aViewBox[2] / aViewBox[3]) / (aWidth[1] / aHeight[1]);
			if (nRatio > 1)
				aHeight[1]	/= nRatio;
			else
				aWidth[1]	*= nRatio;
			//
			aAspect	= [cSVGElement.toPixels(aWidth[1] + aWidth[2]) / aViewBox[2], cSVGElement.toPixels(aHeight[1] + aHeight[2]) / aViewBox[3]];
		}
		return aAspect;
	};

	cSVGElement.getScaleFactor	= function(oElement) {
		var aAspect	= cSVGElement.getAspectRatio(oElement);
		return Math.sqrt(aAspect[0] * aAspect[1]);
	};

	cSVGElement.toPixels	= function(sValue) {
		var aValue	= sValue.match(/([\d.]+)([%\w]*)/),
			nValue	= aValue[1];
		switch (aValue[2]) {
			case "pc":	// pica (1 pc is the same as 12 points)
				nValue	= nValue * 12;
			case "pt":	// point (1 pt is the same as 1/72 inch)
				nValue	= nValue / 72;	// in
			case "in":	// 1 inch = 1.57828283 � 10-5 mi
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
		var nOpacity		= oElement.$getStyleComputed("opacity") || 1,
			sFill			= oElement.$getStyleComputed("fill"),
			nFillOpacity	=(oElement.$getStyleComputed("fill-opacity") || 1) * nOpacity,
			sStroke			= oElement.$getStyleComputed("stroke"),
			nStrokeOpacity	=(oElement.$getStyleComputed("stroke-opacity") || 1) * nOpacity,
			sStrokeWidth	= oElement.$getStyleComputed("stroke-width") || "1",
			sStrokeLineJoin	= oElement.$getStyleComputed("stroke-linejoin") || 'miter',
			sStrokeMiterLimit	= oElement.$getStyleComputed("stroke-miterlimit") || '4',
			sStrokeLineCap	= oElement.$getStyleComputed("stroke-linecap") || 'square',
			sStrokeDashArray= oElement.$getStyleComputed("stroke-dasharray");

		var aColor;
		// Process rgba
		if (sFill && sFill.match(/rgba\(([^\)]+)\)/)) {
			aColor	= RegExp.$1.split(/\s?,\s?/);
			nFillOpacity	*= aColor.pop();
			sFill	= 'rgb(' + aColor.join(',') + ')';
		}
		// Process rgba
		if (sStroke && sStroke.match(/rgba\(([^\)]+)\)/)) {
			aColor	= RegExp.$1.split(/\s?,\s?/);
			nStrokeOpacity	*= aColor.pop();
			sStroke	= 'rgb(' + aColor.join(',') + ')';
		}

		if (sStrokeWidth) {
			var aStrokeWidth	= sStrokeWidth.match(/([\d.]+)(.*)/),
				nStrokeWidth	= aStrokeWidth[1] * cSVGElement.getScaleFactor(oElement) * Math.sqrt(Math.abs(cSVGElement.matrixDeterminant(cSVGElement.getMatrix(oElement))));
			if (nStrokeWidth < 1 && !(oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan || oElement instanceof cSVGElement_textPath))
				nStrokeOpacity	= nStrokeOpacity * nStrokeWidth;
			sStrokeWidth	= nStrokeWidth + (aStrokeWidth[2] || "px");
		}

		if (nFillOpacity > 1)
			nFillOpacity	= 1;
		if (nStrokeOpacity > 1)
			nStrokeOpacity	= 1;

		return '<svg2vml:fill on="' + (sFill == "none" ? "false" : "true") + '" color="' + (sFill in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sFill] + ')' : cSVGElement.correctColor(sFill) || 'black') + '"\
					' + (nFillOpacity != 1 ? ' opacity="' + nFillOpacity + '"' : '') + '\
				/><svg2vml:stroke on="' + (sStroke && sStroke != "none" ? "true" : "false") + '" color="' + (sStroke in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sStroke] + ')' : cSVGElement.correctColor(sStroke) || 'black') + '"\
					' + (nStrokeOpacity != 1 ? ' opacity="' + nStrokeOpacity + '"' : '') + '\
					' + (sStrokeWidth ? ' weight="' + sStrokeWidth + '"' : '') + '\
					' + (sStrokeLineCap ? ' endCap="' + cSVGElement.strokeLineCapToEndCap(sStrokeLineCap) + '"' : '') + '\
					' + (sStrokeDashArray ? ' dashStyle="' + sStrokeDashArray.replace(/,/g, ' ') + '"' : '') + '\
					' + (sStrokeLineJoin ? ' joinStyle="' + sStrokeLineJoin + '"' : '') + '\
					' + (sStrokeMiterLimit ? ' miterLimit="' + sStrokeMiterLimit + '"' : '') + '\
				/><svg2vml:skew on="true" origin="-0.5,-0.5" matrix="1,0,0,1"/>';
	};
//	<svg2vml:shadow on="true" type="double" color="yellow" color2="green" offset="1pt" opacity="0.5"/>\
//	<svg2vml:extrusion xmetal="on" on="true" backdepth="20" xedge="5" xcolor="green" xrotationangle="0,5"/>\

	cSVGElement.strokeDashArrayToDashStyle	= function(sStrokeDashArray, nStrokeWidth) {
		return sStrokeDashArray.split(",").map(function(sValue) {
			return Math.ceil(sValue / nStrokeWidth);
		}).join(" ");
	};

	cSVGElement.strokeLineCapToEndCap	= function(sStrokeLineCap) {
		return {/*"square": "square", */"butt": "flat", "round": "round"}[sStrokeLineCap] || "square";
	};

	cSVGElement.textAnchorToVTextAlign	= function(sTextAnchor) {
		return {/*"start": "left", */"middle": "center", "end": "right"/*, "inherit": "left"*/}[sTextAnchor] || "left";
	};

	cSVGElement.correctColor	= function(sColor) {
		var aColor;
		if (sColor && sColor.match(/rgb\(([^\)]+)\)/) && (aColor = RegExp.$1.split(/\s*%\s*,?\s*/)) && aColor.length == 3)
			sColor	= 'rgb(' + Math.round(2.55 * aColor[0]) + "," + Math.round(2.55 * aColor[1]) + "," + Math.round(2.55 * aColor[2]) + ")";
		return sColor;
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

	cSVGElement.prototype.refresh	= function() {
		switch (this.localName) {
			case "text":
			case "textPath":
			case "tspan":
				this.$setStyle("font-size", this.$getStyleComputed("font-size") || "16px");
				// No break intentially left here
			case "circle":
			case "ellipse":
			case "line":
			case "path":
			case "polygon":
			case "polyline":
			case "rect":
				// Apply transform
				cSVGElement.setMatrixOwn(this, cSVGElement.getMatrix(this));
				//
				this.$setStyle("stroke-width", this.$getStyleComputed("stroke-width") || "1");
				break;
			case "svg":
				cSVGElement_svg.resize(this);
				break;
		}
		// Refresh children
		for (var oNode = this.firstChild; oNode; oNode = oNode.nextSibling)
			if (oNode instanceof cSVGElement)
				oNode.refresh();
	};

	cSVGElement.prototype.$mapAttribute	= function(sName, sValue) {
		if (sName == "transform") {
			cSVGElement.applyTransform(this);
		}
		else
			this.$setStyle(sName, sValue);
	};
}
else {
	cSVGElement.prototype.$mapAttribute	= function(sName, sValue) {
		var oElementDOM	= this.$getContainer();
		if (oElementDOM) {
			if (sValue === null)
				oElementDOM.removeAttribute(sName);
			else
				oElementDOM.setAttribute(sName, sValue);
		}
	};

	cSVGElement.prototype.getBBox	= function() {
		return this.$getContainer().getBBox();
	};

	// Default Element Render: open
	cSVGElement.prototype.$getTagOpen	= function() {
		var sHtml	= '<' + this.tagName;
		for (var sName in this.attributes)
			if (this.attributes.hasOwnProperty(sName) && sName != "id" && sName != "class")// && sName.indexOf(':') ==-1)
				sHtml	+= ' ' + sName + '="' + ample.$encodeXMLCharacters(this.attributes[sName]) + '"';
		sHtml	+= ' class="' + ('svg-' + this.localName + ' ') + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
		return sHtml + '>';
	};

	// Default Element Render: close
	cSVGElement.prototype.$getTagClose	= function() {
		return '</' + this.tagName + '>';
	};
};

// Register Element
ample.extend(cSVGElement);
