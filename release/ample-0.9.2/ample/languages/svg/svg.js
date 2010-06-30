/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

(function () {


var oSVGNamespace	= new AMLNamespace;

ample.domConfig.setNamespace("http://www.w3.org/2000/svg", oSVGNamespace);



var cSVGElement	= function(){};
cSVGElement.prototype	= new AMLElement;

cSVGElement.useVML	= navigator.userAgent.match(/MSIE ([\d.]+)/) && RegExp.$1 < 9;

if (cSVGElement.useVML) {
		document.namespaces.add("svg2vml", "urn:schemas-microsoft-com:vml", "#default#VML");

	cSVGElement.prototype.getBBox	= function() {
		var oBCRectRoot	= cSVGElement.getViewportElement(this).$getContainer().getBoundingClientRect(),
			oBCRectThis	= this.$getContainer().getBoundingClientRect(),
			oSVGRect	= new cSVGRect(
								oBCRectThis.left - oBCRectRoot.left + 1,									oBCRectThis.top - oBCRectRoot.top + 1,									oBCRectThis.right - oBCRectThis.left,
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
						for (var i = 0; i < aCommands.length; i++) {
				var aCommand	= aCommands[i].match(/(\w+)\(([^\)]+)\)/),
					sCommand	= aCommand[1],
					aParameters	= aCommand[2].split(/[\s,]+/).map(function(nValue) {
						return nValue * 1.0;
					});

				switch (sCommand) {
					case "translate":							aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [1,	0,	aParameters[0]],
																		[0, 1,	aParameters.length > 1 ? aParameters[1] : 0],
																		[0, 0,	1]]);
						break;

					case "matrix":								aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [aParameters[0],	aParameters[2],	aParameters[4]],
																		[aParameters[1],	aParameters[3],	aParameters[5]],
																		[0, 	0, 1]]);
						break;

					case "scale":								var iScaleX	= aParameters[0],
							iScaleY	= aParameters.length > 1 ? aParameters[1] : iScaleX;

						aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [iScaleX,	0,		0],
																		[0,		iScaleY,	0],
																		[0,		0, 			1]]);
						break;

					case "rotate":								var iAngle	= aParameters[0] * Math.PI / 180,
							iCos	= Math.cos(iAngle),
							iSin	= Math.sin(iAngle);

												if (aParameters.length == 3)
							aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [1,	0,	aParameters[1]],
																			[0,	1,	aParameters[2]],
																			[0,	0, 1]]);
												aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [iCos,	-iSin,	0],
																		[iSin,	iCos,	0],
																		[0,		0, 		1]]);
												if (aParameters.length == 3)
							aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [1,	0,	-aParameters[1]],
																			[0,	1,	-aParameters[2]],
																			[0,	0, 1]]);
						break;

					case "skewX":								var iAngle	= aParameters[0] * Math.PI / 180,
							iTan	= Math.tan(iAngle);

						aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [1,		iTan,	0],
																		[0,		1,		0],
																		[0,		0, 		1]]);
						break;

					case "skewY":								var iAngle	= aParameters[0] * Math.PI / 180,
							iTan	= Math.tan(iAngle);

						aMatrix	= cSVGElement.matrixMultiply(aMatrix, [ [1,		0,		0],
																		[iTan,	1,		0],
																		[0,		0, 		1]]);
						break;
				}
			}
		}

		return aMatrix;
	};

	cSVGElement.setMatrixOwn	= function(oElement, aMatrix) {
		var oElementDOM	= oElement.$getContainer(),
			aAspect	= cSVGElement.getAspectRatio(oElement);

		if (oElement instanceof cSVGElement_image) {
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
						aMatrix	= cSVGElement.matrixMultiply(aMatrix, [[1, 0, oElement.getAttribute("x") || 0], [0, 1, oElement.getAttribute("y") || 0], [0, 0, 1]]);
						oElementDOM.style.left	= Math.round(aMatrix[0][2]) + "px";
			oElementDOM.style.top	= Math.round(aMatrix[1][2]) + "px";
		}
		else {
			if (oElementDOM.tagName == "group")
				oElementDOM	= oElementDOM.getElementsByTagName("shape")[0];
			if (!oElementDOM)
				return;

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

		cSVGElement.getStyleOwn	= function(oElement, sName) {
		var sValue;

				if (sValue = oElement.attributes["style"])
			if (sValue.match(new RegExp(sName + "\\s*:\\s*([^;]+)")))
				return RegExp.$1;

				if (sValue = oElement.attributes[sName])
			return sValue;

		return '';
	};

	cSVGElement.setStyleOwn	= function(oElement, sName, sValue) {
				var oElementDOM	= oElement.$getContainer();
		if (oElement instanceof cSVGElement_text)
			oElementDOM	= oElementDOM.getElementsByTagName("shape")[0];

				if (!oElementDOM)
			return;

		switch (sName) {
						case "opacity":
				if (oElement instanceof cSVGElement_image) {
					var oAlpha	= oElementDOM.filters.item('DXImageTransform.Microsoft.Alpha');
					oAlpha.enabled	= sValue != 1;
					oAlpha.opacity	= sValue * 100;
				}
				else {
					cSVGElement.setStyleOwn(oElement, "fill-opacity", cSVGElement.getStyle(oElement, "fill-opacity"));
					cSVGElement.setStyleOwn(oElement, "stroke-opacity", cSVGElement.getStyle(oElement, "stroke-opacity"));
				}
				break;
						case "fill":
				oElementDOM.fill.on	= sValue != "none";
				var aValue, oGradient;
				if (aValue = sValue.match(/url\(['"]?#([^'")]+)['"]?\)/)) {
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
								oElementDOM.fill.type		= "gradientTitle";
								oElementDOM.fill.focus		= "100%";																	oElementDOM.fill.focusposition	= "0.5 0.5";									oElementDOM.fill.focussize		= "0 0";							}
														oElementDOM.fill.method		= "sigma";

														for (var oGradientStop = oGradient; oGradientStop && oGradientStop.hasAttribute("xlink:href"); oGradientStop = oElement.ownerDocument.getElementById(oGradientStop.getAttribute("xlink:href").substr(1)))
								if (oGradientStop.hasChildNodes())
									break;

							if (oGradientStop) {
																var aColors	= [],
									nOpacity	=(cSVGElement.getStyle(oElement, "opacity") || 1) * (cSVGElement.getStyle(oElement, "fill-opacity") || 1);
								for (var i = 0, oStop, sColor; oStop = oGradientStop.childNodes[i]; i++)
									if (oGradientStop.childNodes[i] instanceof cSVGElement_stop)
										aColors.push([parseFloat(oStop.getAttribute("offset") || "1") / (oStop.getAttribute("offset").indexOf("%") ==-1 ? 1 : 100), ((sColor = cSVGElement.getStyleOwn(oStop, "stop-color")) in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sColor] + ')' : cSVGElement.correctColor(sColor)), nOpacity * parseFloat(cSVGElement.getStyleOwn(oStop, "stop-opacity") || "1")]);

								var nLength	= aColors.length;
								if (nLength) {
																		aColors	= aColors.sort(function(color1, color2) {
										return color1[0] > color2[0];
									});

																		if (aColors[0][0] != 0)
										oElementDOM.fill.color		= aColors[0][1];
																		if (aColors[nLength - 1][0] != 1)
										oElementDOM.fill.color2		= aColors[nLength - 1][1];

									var aColors2	= [];
									for (var i = 0; i < nLength; i++)
										aColors2.push(aColors[i][0].toFixed(3) + " " + aColors[i][1]);

									oElementDOM.fill.colors.value	= aColors2.join(", ");
									oElementDOM.fill.opacity	= aColors[nLength - 1][2];
								}
							}
						}
						else
						if (oGradient instanceof cSVGElement_pattern) {
													}
					}
				}
				else
					oElementDOM.fill.color	= sValue in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sValue] + ')' : cSVGElement.correctColor(sValue);
				break;
			case "fill-opacity":
				if (sValue == null || sValue == "")
					sValue	= 1;
				sValue	=(cSVGElement.getStyle(oElement, "opacity") || 1) * sValue;
				if (sValue > 1)
					sValue	= 1;
				if (oElementDOM.fill.opacity != sValue)
					oElementDOM.fill.opacity	= sValue;
				break;
						case "stroke":
				oElementDOM.stroke.on	= sValue != "none";
				oElementDOM.stroke.color	= sValue in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sValue] + ')' : cSVGElement.correctColor(sValue);
				break;
			case "stroke-width":
				var aStrokeWidth	= sValue.match(/([\d.]+)(.*)/),
					nStrokeWidth	= aStrokeWidth[1] * cSVGElement.getScaleFactor(oElement) * Math.sqrt(Math.abs(cSVGElement.matrixDeterminant(cSVGElement.getMatrix(oElement))));
				oElementDOM.stroke.weight	= nStrokeWidth + (aStrokeWidth[2] || 'px');
				if (nStrokeWidth < 1 && !(oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan || oElement instanceof cSVGElement_textPath))
					oElementDOM.stroke.opacity	= (oElement.attributes["stroke-opacity"] || 1) * nStrokeWidth;
				break;
			case "stroke-opacity":
				if (sValue == null || sValue == "")
					sValue	= 1;
				sValue	=(cSVGElement.getStyle(oElement, "opacity") || 1) * sValue;
				var aStrokeWidth,
					nStrokeWidth	= 1;
				if (aStrokeWidth = cSVGElement.getStyle(oElement, "stroke-width").match(/([\d.]+)(.*)/)) {
					nStrokeWidth	= aStrokeWidth[1] * cSVGElement.getScaleFactor(oElement) * Math.sqrt(Math.abs(cSVGElement.matrixDeterminant(cSVGElement.getMatrix(oElement))));
					if (nStrokeWidth < 1 && !(oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan || oElement instanceof cSVGElement_textPath))
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
						case "marker-start":
				oElementDOM.stroke.startarrow	= sValue == "none" ? "none" : "classic";
				break;
			case "marker-end":
				oElementDOM.stroke.endarrow	= sValue == "none" ? "none" : "classic";
				break;
						case "text-anchor":
				oElementDOM.getElementsByTagName("textpath")[0].style["v-text-align"]	= cSVGElement.textAnchorToVTextAlign(sValue);
				break;
			case "font-size":
				var aFontSize	= sValue.match(/(^[\d.]*)(.*)$/),
					sFontSizeUnit	= aFontSize[2] || "px",
					nFontSizeValue	= aFontSize[1],
					nFontSize	= Math.round(nFontSizeValue * cSVGElement.getScaleFactor(oElement)),
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
		}
	};

	cSVGElement.getStyle	= function(oElement, sName) {
		var sValue	= cSVGElement.getStyleOwn(oElement, sName);
		if (sValue == "currentColor")
			return cSVGElement.getStyle(oElement, "color");

		if (sValue && sValue != "inherit")
			return sValue;

				if (sValue == "inherit" || oElement.parentNode instanceof cSVGElement_g || oElement.parentNode instanceof cSVGElement_text || oElement.parentNode instanceof cSVGElement_a)
			return cSVGElement.getStyle(oElement.parentNode, sName);

		return '';
	};

	cSVGElement.setStyle	= function(oElement, sName, sValue) {
				if (oElement instanceof cSVGElement_g || oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_a)
			for (var nIndex = 0, oChild; oChild = oElement.childNodes[nIndex]; nIndex++)
				if (oChild.nodeType == 1 && !cSVGElement.getStyleOwn(oChild, sName))
					cSVGElement.setStyle(oChild, sName, sValue);
		if (!(oElement instanceof cSVGElement_g) && !(oElement instanceof cSVGElement_a))
			cSVGElement.setStyleOwn(oElement, sName, sValue);
	};

		cSVGElement.applyCSS	= function(oElement) {
					var oElementDOM	= oElement.$getContainer();
			if (!oElementDOM)					return;
			var oStyle	= oElementDOM.currentStyle,
				sValue;
						if (sValue = oStyle["opacity"])
				cSVGElement.setStyle(oElement, "opacity", sValue);
						if (sValue = oStyle["fill"])
				cSVGElement.setStyle(oElement, "fill", sValue);
			if (sValue = oStyle["fill-opacity"])
				cSVGElement.setStyle(oElement, "fill-opacity", sValue);
						if (sValue = oStyle["stroke"])
				cSVGElement.setStyle(oElement, "stroke", sValue);
			if (sValue = oStyle["stroke-width"])
				cSVGElement.setStyle(oElement, "stroke-width", sValue);
			if (sValue = oStyle["stroke-opacity"])
				cSVGElement.setStyle(oElement, "stroke-opacity", sValue);
			if (sValue = oStyle["stroke-linejoin"])
				cSVGElement.setStyle(oElement, "stroke-linejoin", sValue);
			if (sValue = oStyle["stroke-miterlimit"])
				cSVGElement.setStyle(oElement, "stroke-miterlimit", sValue);
			if (sValue = oStyle["stroke-linecap"])
				cSVGElement.setStyle(oElement, "stroke-linecap", sValue);
			if (sValue = oStyle["stroke-dasharray"])
				cSVGElement.setStyle(oElement, "stroke-dasharray", sValue);
						if (sValue = oStyle["marker-start"])
				cSVGElement.setStyle(oElement, "marker-start", sValue);
			if (sValue = oStyle["marker-end"])
				cSVGElement.setStyle(oElement, "marker-end", sValue);
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
	};

	cSVGElement.applyCSSSizes	= function(oElement) {
		var oElementDOM	= oElement.$getContainer();
		if (!oElementDOM)				return;
		var oStyle	= oElementDOM.currentStyle,
			sValue;
		if (sValue = (oStyle["stroke-width"] || cSVGElement.getStyle(oElement, "stroke-width")))
			cSVGElement.setStyle(oElement, "stroke-width", sValue);
		if (sValue = (oStyle["stroke-opacity"] || cSVGElement.getStyle(oElement, "stroke-opacity")))
			cSVGElement.setStyle(oElement, "stroke-opacity", sValue);
				if (oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan || oElement instanceof cSVGElement_textPath) {
			if (sValue = cSVGElement.getStyle(oElement, "font-size"))
				cSVGElement.setStyle(oElement, "font-size", sValue);
		}
		for (var oChild = oElement.firstChild; oChild; oChild = oChild.nextSibling)
			if (!(oChild instanceof cSVGElement_g))
				cSVGElement.applyCSSSizes(oChild);
	};

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
						var nRatio	= (aViewBox[2] / aViewBox[3]) / (aWidth[1] / aHeight[1]);
			if (nRatio > 1)
				aHeight[1]	/= nRatio;
			else
				aWidth[1]	*= nRatio;
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
			case "pc":					nValue	= nValue * 12;
			case "pt":					nValue	= nValue / 72;				case "in":					nValue	= nValue * 2.54;
			case "cm":
				nValue	= nValue * 10;
			case "mm":
				nValue	= nValue / 0.264;
				break;
			case "px":
			default:
				break;
		}
		return nValue;
	};

	cSVGElement.getTagStyle	= function(oElement) {
		var nOpacity		= cSVGElement.getStyle(oElement, "opacity") || 1,
			sFill			= cSVGElement.getStyle(oElement, "fill"),
			nFillOpacity	=(cSVGElement.getStyle(oElement, "fill-opacity") || 1) * nOpacity,
			sStroke			= cSVGElement.getStyle(oElement, "stroke"),
			nStrokeOpacity	=(cSVGElement.getStyle(oElement, "stroke-opacity") || 1) * nOpacity,
			sStrokeWidth	= cSVGElement.getStyle(oElement, "stroke-width"),
			sStrokeLineJoin	= cSVGElement.getStyle(oElement, "stroke-linejoin") || 'miter',
			sStrokeMiterLimit	= cSVGElement.getStyle(oElement, "stroke-miterlimit") || '4',
			sStrokeLineCap	= cSVGElement.getStyle(oElement, "stroke-linecap") || 'square',
			sStrokeDashArray= cSVGElement.getStyle(oElement, "stroke-dasharray");

		var aColor;
				if (sFill && sFill.match(/rgba\(([^\)]+)\)/)) {
			aColor	= RegExp.$1.split(/\s?,\s?/);
			nFillOpacity	*= aColor.pop();
			sFill	= 'rgb(' + aColor.join(',') + ')';
		}
				if (sStroke && sStroke.match(/rgba\(([^\)]+)\)/)) {
			aColor	= RegExp.$1.split(/\s?,\s?/);
			nStrokeOpacity	*= aColor.pop();
			sStroke	= 'rgb(' + aColor.join(',') + ')';
		}

		if (sStrokeWidth) {
			var aStrokeWidth	= sStrokeWidth.match(/([\d.]+)(.*)/),
				nStrokeWidth	= (aStrokeWidth[1] || 1) * cSVGElement.getScaleFactor(oElement) * Math.sqrt(Math.abs(cSVGElement.matrixDeterminant(cSVGElement.getMatrix(oElement))));
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

	cSVGElement.strokeDashArrayToDashStyle	= function(sStrokeDashArray, nStrokeWidth) {
		return sStrokeDashArray.split(",").map(function(sValue) {
			return Math.ceil(sValue / nStrokeWidth);
		}).join(" ");
	};

	cSVGElement.strokeLineCapToEndCap	= function(sStrokeLineCap) {
		return {"butt": "flat", "round": "round"}[sStrokeLineCap] || "square";
	};

	cSVGElement.textAnchorToVTextAlign	= function(sTextAnchor) {
		return {"middle": "center", "end": "right"}[sTextAnchor] || "left";
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
}
else {
	cSVGElement.prototype.setAttribute	= function(sName, sValue) {
		var oElementDOM	= this.$getContainer();
				if (oElementDOM && sName != "id" && sName != "class")
			oElementDOM.setAttribute(sName, sValue);

				AMLElement.prototype.setAttribute.call(this, sName, sValue);
	};

	cSVGElement.prototype.removeAttribute	= function(sName) {
		var oElementDOM	= this.$getContainer();
				if (oElementDOM && sName != "id" && sName != "class")
			oElementDOM.removeAttribute(sName);

				AMLElement.prototype.removeAttribute.call(this, sName);
	};

	cSVGElement.prototype.getBBox	= function() {
		return this.$getContainer().getBBox();
	};

		cSVGElement.prototype.$getTagOpen	= function()
	{
		var sHtml   = '<' + this.tagName;
		for (var sName in this.attributes)
			if (this.attributes.hasOwnProperty(sName) && sName != "id" && sName != "class")				sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
		sHtml	+= ' class="' + ('svg-' + this.localName + ' ') + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
	    return sHtml + '>';
	};

		cSVGElement.prototype.$getTagClose	= function()
	{
	    return '</' + this.tagName + '>';
	};
};

oSVGNamespace.setElement("#element", cSVGElement);



function cSVGPathSeg() {

};

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

cSVGPathSeg.prototype.pathSegType	= cSVGPathSeg.PATHSEG_UNKNOWN;
cSVGPathSeg.prototype.pathSegTypeAsLetter	= "";





function cSVGPathSegList() {
	this.$items	= [];
};

cSVGPathSegList.prototype.numberOfItems	= 0;

cSVGPathSegList.prototype.$onchange	= new Function;

cSVGPathSegList.prototype.clear	= function() {
	this.$items.length	= 0;
	this.numberOfItems	= 0;
	this.$onchange();	};

cSVGPathSegList.prototype.initialize	= function(oItem) {
	this.$items.length	= 0;
	this.numberOfItems	= this.$items.push(oItem);
	this.$onchange();
	return oItem;
};

cSVGPathSegList.prototype.getItem		= function(nIndex) {
	if (nIndex > this.numberOfItems || nIndex < 0)
		throw new AMLException(AMLException.INDEX_SIZE_ERR);

	return this.$items[nIndex];
};

cSVGPathSegList.prototype.insertItemBefore	= function(oItem, nIndex) {
	if (nIndex > this.numberOfItems || nIndex < 0)
		throw new AMLException(AMLException.INDEX_SIZE_ERR);

	this.numberOfItems	= this.$items.length++;
	for (var n = this.numberOfItems - 1; n > nIndex; n--)
		this.$items[n]	= this.$items[n - 1];
	this.$items[nIndex]	= oItem;
	this.$onchange();
	return oItem;
};

cSVGPathSegList.prototype.replaceItem 	= function(oItem, nIndex) {
	if (nIndex > this.numberOfItems || nIndex < 0)
		throw new AMLException(AMLException.INDEX_SIZE_ERR);

	this.$items[nIndex]	= oItem;
	this.$onchange();
	return oItem;
};

cSVGPathSegList.prototype.removeItem	= function(nIndex) {
	if (nIndex > this.numberOfItems || nIndex < 0)
		throw new AMLException(AMLException.INDEX_SIZE_ERR);

	var oItem	= this.$items[nIndex];
	for (var n = nIndex + 1; n < this.numberOfItems; n++)
		this.$items[n - 1]	= this.$items[n];
	this.numberOfItems	= this.$items.length--;
	this.$onchange();
	return oItem;
};

cSVGPathSegList.prototype.appendItem	= function(oItem) {
	this.numberOfItems	= this.$items.push(oItem);
	this.$onchange();
	return oItem;
};
function cSVGRect(nX, nY, nWidth, nHeight) {
	this.x	= nX;
	this.y	= nY;
	this.width	= nWidth;
	this.height	= nHeight;
};

cSVGRect.prototype.x	= 0;
cSVGRect.prototype.y	= 0;
cSVGRect.prototype.width	= 0;
cSVGRect.prototype.height	= 0;

cSVGRect.prototype.toString	= function() {
	return "[object SVGRect]";
};


var cSVGElement_a	= function(){};
cSVGElement_a.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_a.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "href":
						cSVGElement_a.setHref(this, oEvent.newValue);
						break;
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue	= this.getAttribute("xlink:href");
			if (sValue != "")
				cSVGElement_a.setHref(this, sValue);
		},
		'mouseenter':	function(oEvent) {
			cSVGElement_a.recalcCSS(this);
		},
		'mouseleave':	function(oEvent) {
			cSVGElement_a.recalcCSS(this);
		}
	};

		cSVGElement_a.recalcCSS	= function(oElement) {
		for (var nIndex = 0, oChild, oElementDOM; oChild = oElement.childNodes[nIndex]; nIndex++)
			if (oChild.nodeType == 1) {
				if (oChild instanceof cSVGElement_g)
					cSVGElement_a.recalcCSS(oChild);
				else
					cSVGElement.applyCSS(oChild);
			}
	};

	cSVGElement_a.setHref	= function(oElement, sValue) {
		for (var nIndex = 0, oChild, oElementDOM; oChild = oElement.childNodes[nIndex]; nIndex++) {
			if (oChild instanceof cSVGElement_g)
				cSVGElement_a.setHref(oChild, sValue);
			else
			if (oChild instanceof cSVGElement_text)
				oChild.$getContainer().getElementsByTagName("shape")[0].href	= sValue;
			else
			if (oChild.nodeType == 1) {
				oElementDOM	= oChild.$getContainer();
				if (oElementDOM)
					oElementDOM.href	= sValue;
			}
		}
	};

		cSVGElement_a.prototype.$getTagOpen	= function() {
		return '<svg2vml:group class="svg-a' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:100%;height:100%;left:0;top:0;"\
				>';
	};

	cSVGElement_a.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

oSVGNamespace.setElement("a", cSVGElement_a);



var cSVGElement_circle	= function(){};
cSVGElement_circle.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_circle.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "cx":
					case "cy":
					case "r":
						this.$getContainer().path	= cSVGElement_circle.toPath(this);
						break;
										case "transform":
						cSVGElement.applyTransform(this);
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						cSVGElement.applyTransform(this);

						cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_circle.toPath	= function(oElement) {
		var nCx	= oElement.getAttribute("cx") * 1,
			nCy	= oElement.getAttribute("cy") * 1,
			nR	= oElement.getAttribute("r") * 1;
		return "at" + [nCx - nR, nCy - nR, nCx + nR, nCy + nR, nCx - nR, nCy - nR, nCx - nR, nCy - nR].map(Math.round) + "x";
	};

		cSVGElement_circle.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-circle' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" \
			style="position:absolute;top:0;left:0;height:100%;width:100%;"\
			path="' + cSVGElement_circle.toPath(this) + '"\
		>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_circle.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("circle", cSVGElement_circle);



var cSVGElement_clipPath	= function(){};
cSVGElement_clipPath.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
	cSVGElement_clipPath.prototype.$getTagOpen	= function() {
		return '<svg2vml:group style="top:0;left:0;width:100%;height:100%;display:none">';
	};

	cSVGElement_clipPath.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

oSVGNamespace.setElement("clipPath", cSVGElement_clipPath);



var cSVGElement_defs	= function(){};
cSVGElement_defs.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
	cSVGElement_defs.prototype.$getTagOpen	= function() {
		return '<svg2vml:group style="top:0;left:0;width:100%;height:100%;display:none">';
	};

	cSVGElement_defs.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
}

oSVGNamespace.setElement("defs", cSVGElement_defs);



var cSVGElement_desc	= function(){};
cSVGElement_desc.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_desc.prototype.$getTag	= function() {
		return '';
	};
};

oSVGNamespace.setElement("desc", cSVGElement_desc);



var cSVGElement_ellipse	= function(){};
cSVGElement_ellipse.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_ellipse.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "cx":
					case "cy":
					case "rx":
					case "ry":
						this.$getContainer().path	= cSVGElement_ellipse.toPath(this);
						break;
										case "transform":
						cSVGElement.applyTransform(this);
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						cSVGElement.applyTransform(this);

						cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_ellipse.toPath	= function(oElement) {
		var nCx	= oElement.getAttribute("cx") * 1,
			nCy	= oElement.getAttribute("cy") * 1,
			nRx	= oElement.getAttribute("rx") * 1,
			nRy	= oElement.getAttribute("ry") * 1;
		return (nRx && nRy) ? ("at" + [nCx - nRx, nCy - nRy, nCx + nRx, nCy + nRy, nCx - nRx, nCy - nRy, nCx - nRx, nCy - nRy].map(Math.round) + "x") : "";
	};

		cSVGElement_ellipse.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-ellipse' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" \
			style="position:absolute;top:0;left:0;height:100%;width:100%;"\
			path="' + cSVGElement_ellipse.toPath(this) + '"\
		>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_ellipse.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("ellipse", cSVGElement_ellipse);



var cSVGElement_foreignObject	= function(){};
cSVGElement_foreignObject.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_foreignObject.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
										case "width":
					case "height":
						oElement.style[oEvent.attrName]	= oEvent.newValue + "px";
						break;
										case "x":
					case "y":
						oElement.style[oEvent.attrName == "x" ? "left" : "top"]	= oEvent.newValue + "px";
						break;
										case "transform":
						cSVGElement.applyTransform(this);
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
						cSVGElement.applyTransform(this);

						cSVGElement.applyCSS(this);
		}
	};

		cSVGElement_foreignObject.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-foreignObject' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:' + this.getAttribute("width") + 'px;height:' + this.getAttribute("height") + 'px;left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_foreignObject.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("foreignObject", cSVGElement_foreignObject);



var cSVGElement_g	= function(){};
cSVGElement_g.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_g.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "transform":
						cSVGElement.applyTransform(this);
						break;

					default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		}
	};

		cSVGElement_g.prototype.$getTagOpen	= function() {
				return '<svg2vml:group class="svg-g' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="top:0;left:0;width:100%;height:100%;position:absolute;' + (this.hasAttribute("style") ? this.getAttribute("style") : '')+ '"\
				>';
	};

	cSVGElement_g.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

oSVGNamespace.setElement("g", cSVGElement_g);



var cSVGElement_image	= function(){};
cSVGElement_image.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_image.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "xlink:href":
						oElement.imagedata.src	= oEvent.newValue;
						break;
										case "width":
					case "height":
						var aValue	= oEvent.newValue.match(/([\d.]+)([%\w]*)/);
						oElement.style[oEvent.attrName]	= aValue[1] + (aValue[2] || "px");
						break;
					case "x":
					case "y":
					case "transform":
						cSVGElement.applyTransform(this);
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

						cSVGElement.applyTransform(this);

						cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_image.resolveXmlBase	= function(oElement, sUri) {
		for (var oNode = oElement, sBaseUri = ''; oNode != null && oNode.nodeType != 9; oNode = oNode.parentNode)
			if (sBaseUri = oNode.getAttribute("xml:base"))
				sUri	= oElement.ownerDocument.$resolveUri(sUri, sBaseUri);
		return oElement.ownerDocument.$resolveUri(sUri, String(document.location));
	};

		cSVGElement_image.prototype.$getTagOpen	= function() {
		var aWidth	= this.getAttribute("width").match(/([\d.]+)([%\w]*)/),
			aHeight	= this.getAttribute("height").match(/([\d.]+)([%\w]*)/),
			nOpacity= cSVGElement.getStyle(this, "opacity") * 1 || 1;
		return '<svg2vml:shape class="svg-image' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;padding:10cm;width:' + aWidth[1] + (aWidth[2] || 'px') + ';height:' + aHeight[1] + (aHeight[2] || 'px') + ';left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;filter:progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'clip\',enabled=false) progid:DXImageTransform.Microsoft.Alpha(' + (nOpacity != 1 ? 'opacity:' + nOpacity * 100 : 'enabled=false')+ ')" stroked="false"\
				>\
					<svg2vml:imagedata src="' + cSVGElement_image.resolveXmlBase(this, this.getAttribute("xlink:href"))+ '"/>';
	};

	cSVGElement_image.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("image", cSVGElement_image);




var cSVGElement_line	= function(){};
cSVGElement_line.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_line.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "x1":
					case "y1":
					case "x2":
					case "y2":
						this.$getContainer().path	= cSVGElement_line.toPath(this);
						break;
										case "transform":
						cSVGElement.applyTransform(this);
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						cSVGElement.applyTransform(this);

						cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_line.toPath	= function(oElement) {
		var nX1	= oElement.getAttribute("x1") * 1,
			nY1	= oElement.getAttribute("y1") * 1,
			nX2	= oElement.getAttribute("x2") * 1,
			nY2	= oElement.getAttribute("y2") * 1;
		return "m" + [nX1, nY1].map(Math.round) + "l" + [nX2, nY2].map(Math.round) + "x";
	};

		cSVGElement_line.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-line' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
						style="position:absolute;top:0;left:0;height:100%;width:100%;"\
						path="' + cSVGElement_line.toPath(this) + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_line.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("line", cSVGElement_line);



var cSVGElement_linearGradient	= function(){};
cSVGElement_linearGradient.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
		cSVGElement_linearGradient.handlers	= {
		"DOMAttrModified":	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "x1":
					case "x2":
					case "y1":
					case "y2":
						var sId	= this.getAttribute("id");
						if (sId) {
							var aElements	= this.ownerDocument.querySelectorAll("[fill=url(#" + sId + ")]");
							for (var nIndex = 0; nIndex < aElements.length; nIndex++)
								cSVGElement.setStyle(aElements[nIndex], "fill", "url(#" + sId + ")");
						}
				}
			}
		}
	};
};

oSVGNamespace.setElement("linearGradient", cSVGElement_linearGradient);



var cSVGElement_marker	= function(){};
cSVGElement_marker.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_marker.prototype.$getTagOpen	= function() {
		return '';
	};

	cSVGElement_marker.prototype.$getTagClose	= function() {
		return '';
	};
};

oSVGNamespace.setElement("marker", cSVGElement_marker);



var cSVGElement_metadata	= function(){};
cSVGElement_metadata.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_metadata.prototype.$getTag	= function() {
		return '';
	};
};

oSVGNamespace.setElement("metadata", cSVGElement_metadata);



var cSVGElement_path	= function(){
	this.pathSegList			= new cSVGPathSegList;

};
cSVGElement_path.prototype	= new cSVGElement;

cSVGElement_path.prototype.pathSegList				= null;

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

cSVGElement_path.d2PathSegList	= function(oInstance) {

};

cSVGElement_path.pathSegList2d	= function(oInstance) {

};

if (cSVGElement.useVML) {
	
		cSVGElement_path.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "d":
						this.$getContainer().path	= cSVGElement_path.convert(oEvent.newValue);
						break;
										case "transform":
						cSVGElement.applyTransform(this);
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						cSVGElement.applyTransform(this);

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
								case "M":
					iCurrentX	= aParameters[0];
					iCurrentY	= aParameters[1];
					iStartX		= iCurrentX;
					iStartY		= iCurrentY;
					aPath.push("m" + aParameters.slice(0, 2).map(Math.round) + " ");

										if (aParameters.length == 2)
						break;
					else
						aParameters	= aParameters.slice(2);

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

								case "H":
					iCurrentX	= aParameters[0];
					aPath.push("l" + [iCurrentX, iCurrentY].map(Math.round) + " ");
					break;

				case "h":
					iCurrentX	+= aParameters[0];
					aPath.push("r" + [aParameters[0], 0].map(Math.round) + " ");
					break;

								case "V":
					iCurrentY	= aParameters[0];
					aPath.push("l" + [iCurrentX, iCurrentY].map(Math.round) + " ");
					break;

				case "v":
					iCurrentY	+= aParameters[0];
					aPath.push("r" + [0, aParameters[0]].map(Math.round) + " ");
					break;

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

								case "Q":						aPath.push("c" + [iCurrentX, iCurrentY].map(Math.round) + "," + aParameters.map(Math.round) + " ");
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					aQuadratic	= [aParameters[aParameters.length - 4], aParameters[aParameters.length - 3]];
					break;

				case "q":						aPath.push("v0,0" + "," + aParameters.map(Math.round) + " ");
					iCurrentX	+= aParameters[aParameters.length - 2];
					iCurrentY	+= aParameters[aParameters.length - 1];
					aQuadratic	= [aParameters[aParameters.length - 4], aParameters[aParameters.length - 3]];
					break;

								case "T":						aPath.push("c" + [iCurrentX, iCurrentY].map(Math.round) + "," + [iCurrentX + (aQuadratic ? iCurrentX - aQuadratic[0] : 0), iCurrentY + (aQuadratic ? iCurrentY - aQuadratic[1] : 0)].map(Math.round) + "," + aParameters.map(Math.round) + " ");
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					break;

				case "t":						aPath.push("v0,0" + "," + [(aQuadratic ? aParameters[aParameters.length - 2] - aQuadratic[0] : 0), (aQuadratic ? aParameters[aParameters.length - 1] - aQuadratic[1] : 0)].map(Math.round) + "," + aParameters.map(Math.round) + " ");
					iCurrentX	+= aParameters[aParameters.length - 2];
					iCurrentY	+= aParameters[aParameters.length - 1];
					break;

								case "A":					case "a":
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

								case "Z":
				case "z":
					aPath.push("x");
					iCurrentX	= iStartX;
					iCurrentY	= iStartY;
					break;
			}

						if (!cSVGElement_path.hQuadratic[sCommand])
				aQuadratic	= null;
			else
			if (!cSVGElement_path.hCubic[sCommand])
				aCubic		= null;
		}

		return aPath.join('') + "e";
	};

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
						break;
				}
			}
		},
		"DOMNodeInsertedIntoDocument":	function(oEvent) {
			this.pathSegList	= this.$getContainer().pathSegList;
		}
	};
};

oSVGNamespace.setElement("path", cSVGElement_path);



var cSVGElement_pattern	= function(){};
cSVGElement_pattern.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	};

oSVGNamespace.setElement("pattern", cSVGElement_pattern);



var cSVGElement_polygon	= function(){};
cSVGElement_polygon.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_polygon.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "points":
						this.$getContainer().path	= cSVGElement_polygon.toPath(this);
						break;
										case "transform":
						cSVGElement.applyTransform(this);
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						cSVGElement.applyTransform(this);

						cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_polygon.toPath	= function(oElement) {
		var aPoints = oElement.getAttribute("points").split(/[ ,]/);
		return "m " + aPoints.slice(0, 2).map(Math.round)+ " l " + aPoints.slice(2).map(Math.round) + " x";
	};

		cSVGElement_polygon.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-polygon' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
						style="position:absolute;top:0;left:0;height:100%;width:100%;"\
						path="' + cSVGElement_polygon.toPath(this) + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_polygon.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("polygon", cSVGElement_polygon);



var cSVGElement_polyline	= function(){};
cSVGElement_polyline.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_polyline.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "points":
						this.$getContainer().path	= cSVGElement_polyline.toPath(this);
						break;
										case "transform":
						cSVGElement.applyTransform(this);
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						cSVGElement.applyTransform(this);

						cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_polyline.toPath	= function(oElement) {
		var aPoints = oElement.getAttribute("points").split(/[ ,]/);
		return "m " + aPoints.slice(0, 2).map(Math.round)+ " l " + aPoints.slice(2).map(Math.round) + " e";
	};

		cSVGElement_polyline.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-polyline' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
						style="position:absolute;top:0;left:0;height:100%;width:100%;"\
						path="' + cSVGElement_polyline.toPath(this) + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_polyline.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("polyline", cSVGElement_polyline);



var cSVGElement_radialGradient	= function(){};
cSVGElement_radialGradient.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
		cSVGElement_radialGradient.handlers	= {
		"DOMAttrModified":	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "cx":
					case "cy":
					case "r":
						var sId	= this.getAttribute("id");
						if (sId) {
							var aElements	= this.ownerDocument.querySelectorAll("[fill=url(#" + sId + ")]");
							for (var nIndex = 0; nIndex < aElements.length; nIndex++)
								cSVGElement.setStyle(aElements[nIndex], "fill", "url(#" + sId + ")");
						}
				}
			}
		}
	};
};

oSVGNamespace.setElement("radialGradient", cSVGElement_radialGradient);



var cSVGElement_rect	= function(){};
cSVGElement_rect.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_rect.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "width":
					case "height":
					case "x":
					case "y":
					case "rx":
					case "ry":
						this.$getContainer().path	= cSVGElement_rect.toPath(this);
						break;
										case "transform":
						cSVGElement.applyTransform(this);
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						cSVGElement.applyTransform(this);

						cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_rect.toPath	= function(oElement) {
		var nX	= oElement.getAttribute("x") * 1,
			nY	= oElement.getAttribute("y") * 1,
			nWidth	= oElement.getAttribute("width") * 1,
			nHeight	= oElement.getAttribute("height") * 1,
			nRx	= oElement.getAttribute("rx") * 1 || 0,
			nRy	= oElement.getAttribute("ry") * 1 || 0;
		if (nWidth && nHeight) {
						if (nRx && !nRy)
				nRy	= nRx;
			else
			if (nRy && !nRx)
				nRx	= nRy;
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

		cSVGElement_rect.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-rect' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" \
					style="position:absolute;top:0;left:0;height:100%;width:100%;"\
					path="' + cSVGElement_rect.toPath(this) + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_rect.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("rect", cSVGElement_rect);



var cSVGElement_script	= function(){};
cSVGElement_script.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	};

cSVGElement_script.prototype.$getTag	= function() {
	return '';
};

cSVGElement_script.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.firstChild instanceof AMLCharacterData) {
			var oScript	= document.createElement("script");
			document.getElementsByTagName("head")[0].appendChild(oScript);
			oScript.type	= "text/javascript";
			oScript.text	= this.firstChild.data;
		}
	}
};

oSVGNamespace.setElement("script", cSVGElement_script);



var cSVGElement_stop	= function(){};
cSVGElement_stop.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
		cSVGElement_stop.handlers	= {
		"DOMAttrModified":	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "offset":
					case "stop-color":
					case "stop-opacity":
						var sId	= this.parentNode.getAttribute("id");
						if (sId) {
							var aElements	= this.ownerDocument.querySelectorAll("[fill=url(#" + sId + ")]");
							for (var nIndex = 0; nIndex < aElements.length; nIndex++)
								cSVGElement.setStyle(aElements[nIndex], "fill", "url(#" + sId + ")");
						}
				}
			}
		}
	};
}

oSVGNamespace.setElement("stop", cSVGElement_stop);



var cSVGElement_style	= function(){};
cSVGElement_style.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
	cSVGElement_style.translate	= function(sCSS) {
		var aCSS	= [],
			aRules	= sCSS.match(/[^\{]+\{[^\}]+\}/g);
		if (aRules) {
			for (var nIndex = 0, nLength = aRules.length, aRule; nIndex < nLength; nIndex++) {
				aRule	= aRules[nIndex].match(/([^\{]+)(\{[^\}]+\})/);
				aCSS.push(aRule[1]
								.replace(/\|/g, '-')															.replace(/([\s>+~,])(\w+\|)?([\w])/g, '$1.svg-$3')									,
								aRule[2]);
			}
		}
		return aCSS.join('');
	};

		cSVGElement_style.prototype.$getTagOpen	= function() {
				if (this.firstChild instanceof AMLText) {
			this.firstChild.nodeValue	=
			this.firstChild.data	= cSVGElement_style.translate(this.firstChild.data);
			this.firstChild.length	= this.firstChild.data.length;
		}

		return '<style type="text/css">';
	};

	cSVGElement_style.prototype.$getTagClose	= function() {
		return '</style>';
	};
};

oSVGNamespace.setElement("style", cSVGElement_style);



var cSVGElement_svg	= function(){};
cSVGElement_svg.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
		cSVGElement_svg.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "viewBox":
					case "width":
					case "height":
						cSVGElement_svg.resize(this);
						break;
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
						var that	= this;
			setTimeout(function() {
				var oGroup	= that.$getContainer("gateway");
				if (oGroup)
					oGroup.style.display	= "";

								var oEventLoad	= that.ownerDocument.createEvent("Event");
				oEventLoad.initEvent("load", false, false);
				that.dispatchEvent(oEventLoad);
			}, 0);
						if (navigator.userAgent.match(/MSIE ([0-9.]+)/) && RegExp.$1 * 1 == 8)
				cSVGElement_svg.resize(this);
		}
	};

	cSVGElement_svg.resize	= function(oInstance) {
		var oElement	= oInstance.$getContainer(),
			oElementGroup	= oInstance.$getContainer("gateway"),
			aBox	= cSVGElement_svg.getBox(oInstance);
		oElementGroup.style.marginLeft	= aBox[0][0];
		oElementGroup.style.marginTop	= aBox[0][1];
		oElementGroup.style.width	= aBox[1][0];
		oElementGroup.style.height	= aBox[1][1];
		oElement.style.width	= aBox[2][0];
		oElement.style.height	= aBox[2][1];
	};

	cSVGElement_svg.getBox	= function(oInstance) {
		var aViewBox= oInstance.getAttribute("viewBox").split(/[\s,]/),
			aWidth	= oInstance.getAttribute("width").match(/([\d.]+)([%\w]*)/),
			aHeight	= oInstance.getAttribute("height").match(/([\d.]+)([%\w]*)/);

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

		var oBCRect		= aWidth[2] == "%" || aHeight[2] == "%" ? oInstance.getBoundingClientRect() : {},
			sWidthOuter	= aWidth[1] + (aWidth[2] || "px"),
			sHeightOuter= aHeight[1] + (aHeight[2] || "px");
			nWidthInner	= aWidth[2] == "%" ? oBCRect.right - oBCRect.left : aWidth[1],
			nHeightInner= aHeight[2] == "%" ? oBCRect.bottom - oBCRect.top : aHeight[1],
			nRatio	= (aViewBox[2] / aViewBox[3]) / (nWidthInner / nHeightInner),
			nLeft	= 0,
			nTop	= 0;

				if (nRatio > 1) {
			nTop	= (nHeightInner - (nHeightInner / nRatio)) / 2;
			nHeightInner	/= nRatio;
		}
		else
		if (nRatio < 1) {
			nLeft	= (nWidthInner - (nWidthInner * nRatio)) / 2;
			nWidthInner 	*= nRatio;
		}

				if (aViewBox[0])
			nLeft	-= (aViewBox[0] / aViewBox[2]) * nWidthInner;
		if (aViewBox[1])
			nTop	-= (aViewBox[1] / aViewBox[3]) * nHeightInner;

		var sWidthUnit	= aWidth[2] == "%" || !aWidth[2] ? "px" : aWidth[2],
			sHeightUnit	= aHeight[2] == "%" || !aHeight[2] ? "px" : aHeight[2];

		return [
		        [nLeft + sWidthUnit, nTop + sHeightUnit],
		        [nWidthInner + sWidthUnit, nHeightInner + sHeightUnit],
		        [sWidthOuter, sHeightOuter]
		];
	};

		cSVGElement_svg.prototype.$getTagOpen	= function() {
		var aViewBox= this.getAttribute("viewBox").split(/[\s,]/) || [],
			aWidth	= this.getAttribute("width").match(/([\d.]+)([%\w]*)/) || [],
			aHeight	= this.getAttribute("height").match(/([\d.]+)([%\w]*)/) || [];
		return '<div class="svg-svg' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="position:relative;display:inline-block;overflow:hidden;' + (this.hasAttribute("style") ? this.getAttribute("style") : '') + '"\
					onresize="var o = ample.$instance(this); ample.domConfig.getNamespace(o.namespaceURI).getElement(o.localName).resize(o)">\
					<svg2vml:group class="svg-svg--gateway" style="position:absolute;display:none;"\
						coordOrigin="0,0"\
						coordSize="' + (aViewBox[2] || aWidth[1] || 600) + ',' + (aViewBox[3] || aHeight[1] || 600) + '"\
					>';
	};

	cSVGElement_svg.prototype.$getTagClose	= function() {
		return 		'</svg2vml:group>\
				</div>';
	};
}
else {
		cSVGElement_svg.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var that	= this;
			setTimeout(function() {
								var oEventLoad	= that.ownerDocument.createEvent("Event");
				oEventLoad.initEvent("load", false, false);
				that.dispatchEvent(oEventLoad);
			});
		}
	};
}


oSVGNamespace.setElement("svg", cSVGElement_svg);



var cSVGElement_symbol	= function(){};
cSVGElement_symbol.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	};

oSVGNamespace.setElement("symbol", cSVGElement_symbol);



var cSVGElement_text	= function(){};
cSVGElement_text.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
		cSVGElement_text.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "x":
					case "y":
					case "dx":
					case "dy":
						var nLeft	=(this.getAttribute("x").match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dx") * 1 || 0),
							nTop	=(this.getAttribute("y").match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dy") * 1 || 0);
						this.$getContainer().getElementsByTagName("shape")[0].path	= 'm ' + [nLeft, nTop].map(Math.round) + ' r 1000,0 x';
						break;
										case "transform":
						cSVGElement.applyTransform(this);
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
						for (var oElement = this.$getContainer(), i = 0; oElement.childNodes[i]; i++)
				if (oElement.childNodes[i].tagName != "shape")
					oElement.removeChild(oElement.childNodes[i--]);

			if (this.firstChild instanceof AMLCharacterData)
				this.$getContainer().getElementsByTagName("textpath")[0].string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');;

			var sValue;

						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						cSVGElement.applyTransform(this);

						cSVGElement.applyCSS(this);
		},
		'DOMCharacterDataModified':	function(oEvent) {
			if (oEvent.target.parentNode == this)
				this.$getContainer().getElementsByTagName("textpath")[0].string	= oEvent.target.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
		}
	};

		cSVGElement_text.prototype.$getTagOpen	= function() {
		var sFontFamily	= cSVGElement.getStyle(this, "font-family") || "Times New Roman",
			sFontWeight	= cSVGElement.getStyle(this, "font-weight"),
			sFontSize	= cSVGElement.getStyle(this, "font-size"),
			sFontStyle	= cSVGElement.getStyle(this, "font-style"),
			sTextAnchor	= cSVGElement.getStyle(this, "text-anchor"),
			nLeft	=(this.getAttribute("x").match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dx") * 1 || 0),
			nTop	=(this.getAttribute("y").match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dy") * 1 || 0),
						aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1] || 16,
			nFontSize	= Math.round(nFontSizeValue * cSVGElement.getScaleFactor(this)),
			nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

		return '<svg2vml:group class="svg-text' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;top:0;left:0;width:100%;height:100%;">\
					<svg2vml:shape \
						style="position:absolute;width:100%;height:100%;margin-top:' + nMarginTop + 'px;left:0px;top:0px;"\
						path="m ' + [nLeft, nTop].map(Math.round) + ' r 1000,0 x" allowoverlap="true"\
					>' + cSVGElement.getTagStyle(this) + '\
						<svg2vml:path textpathok="true" />\
						<svg2vml:textpath on="true" xscale="true"\
							style="v-text-align:' + cSVGElement.textAnchorToVTextAlign(sTextAnchor) + ';font-size:' + nFontSize + sFontSizeUnit + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + (sFontStyle ? 'font-style:' + sFontStyle + ';' : '') + '" />\
					</svg2vml:shape>';
	};

	cSVGElement_text.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

oSVGNamespace.setElement("text", cSVGElement_text);



var cSVGElement_textPath	= function(){};
cSVGElement_textPath.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
			cSVGElement_textPath.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "xlink:href":
						var oTextPath = this.ownerDocument.getElementById(oEvent.newValue.substr(1));
						if (oTextPath)
							this.$getContainer().path	= cSVGElement_path.convert(oTextPath.getAttribute("d"));
						break;
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
						var oTextPath = this.ownerDocument.getElementById(this.getAttribute("xlink:href").substr(1));
			if (oTextPath)
				this.$getContainer().path	= cSVGElement_path.convert(oTextPath.getAttribute("d"));

						if (this.firstChild instanceof AMLCharacterData)
				this.$getContainer().getElementsByTagName("textpath")[0].string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

			var sValue;

						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						cSVGElement.applyTransform(this);

						cSVGElement.applyCSS(this);
		},
		'DOMCharacterDataModified':	function(oEvent) {
			if (oEvent.target.parentNode == this)
				this.$getContainer().getElementsByTagName("textpath")[0].string	= oEvent.target.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
		}
	};

		cSVGElement_textPath.prototype.$getTagOpen	= function() {
		var sFontFamily	= cSVGElement.getStyle(this, "font-family") || "Times New Roman",
			sFontWeight	= cSVGElement.getStyle(this, "font-weight"),
			sFontSize	= cSVGElement.getStyle(this, "font-size"),
			sFontStyle	= cSVGElement.getStyle(this, "font-style"),
			sTextAnchor	= cSVGElement.getStyle(this, "text-anchor"),
						aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1] || 16,
			nFontSize	= Math.round(nFontSizeValue * cSVGElement.getScaleFactor(this)),
			nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

		return '<svg2vml:shape class="svg-textPath' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:100%;height:100%;margin-top:' + nMarginTop + 'px;left:0px;top:0px;"\
					path="m 0,0 l 1000,0 x" allowoverlap="true"\
				>' + cSVGElement.getTagStyle(this) + '\
					<svg2vml:path textpathok="true" />\
					<svg2vml:textpath on="true"\
						style="v-text-align:' + cSVGElement.textAnchorToVTextAlign(sTextAnchor) + ';font-size:' + nFontSize + sFontSizeUnit + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + (sFontStyle ? 'font-style:' + sFontStyle + ';' : '') + '" />\
					<span style="display:none">';
	};

	cSVGElement_textPath.prototype.$getTagClose	= function() {
		return '	</span>\
				</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("textPath", cSVGElement_textPath);



var cSVGElement_title	= function(){};
cSVGElement_title.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	
	cSVGElement_title.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			if (!(this.parentNode instanceof cSVGElement_svg) && this.firstChild)
				this.parentNode.$getContainer().title	= this.firstChild.data;
		}
	};

		cSVGElement_title.prototype.$getTag	= function() {
		return '';
	};
};

oSVGNamespace.setElement("title", cSVGElement_title);



var cSVGElement_tref	= function(){};
cSVGElement_tref.prototype	= new cSVGElement;

if (cSVGElement.useVML) {

	cSVGElement_tref.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "x":
					case "y":
					case "dx":
					case "dy":
						var nLeft	=((this.getAttribute("x") || (this.parentNode ? this.parentNode.getAttribute("x") : "0")).match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dx") * 1 || 0),
							nTop	=((this.getAttribute("y") || (this.parentNode ? this.parentNode.getAttribute("y") : "0")).match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dy") * 1 || 0);
						this.$getContainer().path	= 'm ' + [nLeft, nTop].map(Math.round) + ' r 1000,0 x';
						break;
					case "xlink:href":
						var oTextPath = this.ownerDocument.getElementById(oEvent.newValue.substr(1));
						if (oTextPath)
							this.$getContainer().path	= cSVGElement_path.convert(oTextPath.getAttribute("d"));
						break;
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sHref	= this.getAttribute("xlink:href"),
				that	= this;
			if (sHref) {
				setTimeout(function() {
					var oRef	= that.ownerDocument.getElementById(sHref.substr(1));
					if (oRef instanceof cSVGElement_text && oRef.firstChild instanceof AMLCharacterData)
						that.$getContainer().getElementsByTagName("textpath")[0].string	= oRef.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
				});
			}
						cSVGElement.applyTransform(this);

						cSVGElement.applyCSS(this);
		}
	};

		cSVGElement_tref.prototype.$getTagOpen	= function() {
		var sFontFamily	= cSVGElement.getStyle(this, "font-family") || "Times New Roman",
			sFontWeight	= cSVGElement.getStyle(this, "font-weight"),
			sFontSize	= cSVGElement.getStyle(this, "font-size"),
			sTextAnchor	= cSVGElement.getStyle(this, "text-anchor"),
			nLeft	=((this.getAttribute("x") || (this.parentNode ? this.parentNode.getAttribute("x") : "0")).match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dx") * 1 || 0),
			nTop	=((this.getAttribute("y") || (this.parentNode ? this.parentNode.getAttribute("y") : "0")).match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dy") * 1 || 0),
						aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1] || 16,
			nFontSize	= Math.round(nFontSizeValue * cSVGElement.getScaleFactor(this)),
			nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

		return '<svg2vml:shape class="svg-tspan' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:100%;height:100%;margin-top:' + nMarginTop + 'px;left:' + (this.getAttribute("x") || (this.parentNode ? this.parentNode.getAttribute("x") : "0")) + 'px;top:' + (this.getAttribute("y") || (this.parentNode ? this.parentNode.getAttribute("y") : "0")) + 'px;"\
					path="m ' + [nLeft, nTop].map(Math.round) + ' r 1000,0 x" allowoverlap="false"\
				>' + cSVGElement.getTagStyle(this) + '\
					<svg2vml:path textpathok="true" />\
					<svg2vml:textpath on="true"\
						style="v-text-align:' + cSVGElement.textAnchorToVTextAlign(sTextAnchor) + ';font-size:' + nFontSize + sFontSizeUnit + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + '" />';
	};

	cSVGElement_tref.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("tref", cSVGElement_tref);


var cSVGElement_tspan	= function(){};
cSVGElement_tspan.prototype	= new cSVGElement;

if (cSVGElement.useVML) {

		cSVGElement_tspan.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "x":
					case "y":
					case "dx":
					case "dy":
						var nLeft	=((this.getAttribute("x") || (this.parentNode ? this.parentNode.getAttribute("x") : "0")).match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dx") * 1 || 0),
							nTop	=((this.getAttribute("y") || (this.parentNode ? this.parentNode.getAttribute("y") : "0")).match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dy") * 1 || 0);
						this.$getContainer().path	= 'm ' + [nLeft, nTop].map(Math.round) + ' r 1000,0 x';
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			if (this.firstChild instanceof AMLCharacterData)
				this.$getContainer().getElementsByTagName("textpath")[0].string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

			var sValue;

						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						cSVGElement.applyTransform(this);

						cSVGElement.applyCSS(this);
		},
		'DOMCharacterDataModified':	function(oEvent) {
			if (oEvent.target.parentNode == this)
				this.$getContainer().getElementsByTagName("textpath")[0].string	= oEvent.target.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
		}
	};

		cSVGElement_tspan.prototype.$getTagOpen	= function() {
		var sFontFamily	= cSVGElement.getStyle(this, "font-family") || "Times New Roman",
			sFontWeight	= cSVGElement.getStyle(this, "font-weight"),
			sFontSize	= cSVGElement.getStyle(this, "font-size"),
			sFontStyle	= cSVGElement.getStyle(this, "font-style"),
			sTextAnchor	= cSVGElement.getStyle(this, "text-anchor"),
			nLeft	=((this.getAttribute("x") || (this.parentNode ? this.parentNode.getAttribute("x") : "0")).match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dx") * 1 || 0),
			nTop	=((this.getAttribute("y") || (this.parentNode ? this.parentNode.getAttribute("y") : "0")).match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dy") * 1 || 0),
						aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1] || 16,
			nFontSize	= Math.round(nFontSizeValue * cSVGElement.getScaleFactor(this)),
			nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

		return '<svg2vml:shape class="svg-tspan' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:100%;height:100%;margin-top:' + nMarginTop + 'px;left:0px;top:0px;"\
					path="m ' + [nLeft, nTop].map(Math.round) + ' r 1000,0 x" allowoverlap="false"\
				>' + cSVGElement.getTagStyle(this) + '\
					<svg2vml:path textpathok="true" />\
					<svg2vml:textpath on="true" xscale="true"\
						style="v-text-align:' + cSVGElement.textAnchorToVTextAlign(sTextAnchor) + ';font-size:' + nFontSize + sFontSizeUnit + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + (sFontStyle ? 'font-style:' + sFontStyle + ';' : '') + '" />\
					<span style="display:none">';
	};

	cSVGElement_tspan.prototype.$getTagClose	= function() {
		return '	</span>\
				</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("tspan", cSVGElement_tspan);



var cSVGElement_use	= function(){};
cSVGElement_use.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
		cSVGElement_use.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sHref	= this.getAttribute("xlink:href"),
				that	= this;
			if (sHref) {
					var oRef	= that.ownerDocument.getElementById(sHref.substr(1));
					if (oRef) {
												var oNode	= oRef.cloneNode(true);
						oNode.removeAttribute("id");

												for (var sAttribute in this.attributes)
							if (this.attributes.hasOwnProperty(sAttribute) && sAttribute != "id" && sAttribute != "xlink:href")
								oNode.attributes[sAttribute]	= this.attributes[sAttribute];

						that.parentNode.insertBefore(oNode, that);
					}
			}
		}
	};

		cSVGElement_use.prototype.$getTag	= function() {
		return '';
	};
};

oSVGNamespace.setElement("use", cSVGElement_use);


})()
