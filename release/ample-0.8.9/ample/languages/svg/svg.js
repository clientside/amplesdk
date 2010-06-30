/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

(function () {


var oSVGNamespace	= new AMLNamespace;

ample.domConfig.setNamespace("http://www.w3.org/2000/svg", oSVGNamespace);



var cSVGElement	= function(){};
cSVGElement.prototype	= new AMLElement;

if (!!document.namespaces) {
		document.namespaces.add("svg2vml", "urn:schemas-microsoft-com:vml", "#default#VML");

		function cSVGRect() {

	};
	cSVGRect.prototype.x	= null;
	cSVGRect.prototype.y	= null;
	cSVGRect.prototype.width	= null;
	cSVGRect.prototype.height	= null;

	cSVGRect.prototype.toString	= function() {
		return "[object SVGRect]";
	};

	cSVGElement.prototype.getBBox	= function() {
		var oBCRectRoot	= cSVGElement.getViewportElement(this).$getContainer().getBoundingClientRect(),
			oBCRectThis	= this.$getContainer().getBoundingClientRect(),
			oSVGRect	= new cSVGRect;
		oSVGRect.x	= oBCRectThis.left - oBCRectRoot.left + 1;			oSVGRect.y	= oBCRectThis.top - oBCRectRoot.top + 1;			oSVGRect.width	= oBCRectThis.right - oBCRectThis.left;
		oSVGRect.height	= oBCRectThis.bottom - oBCRectThis.top;

		return oSVGRect;
	};

		cSVGElement.setTransform	= function(oElement, sValue) {
		var aCommands	= sValue.match(/\w+\([^\)]+\s*,?\)/g),
			nRotation	= 0,
			aMatrix		= cSVGElement.matrixCreate();

		var oElementDOM	= oElement.$getContainer();
		if (oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_image)
			oElementDOM	= oElement.$getContainer("shape");

				for (var i = 0; i < aCommands.length; i++) {
			var aCommand	= aCommands[i].match(/(\w+)\(([^\)]+)\)/),
				sCommand	= aCommand[1],
				aParameters	= aCommand[2].split(/[\s,]/);

			switch (sCommand) {
				case "translate":						aMatrix	= cSVGElement.matrixMultiple(aMatrix, [
							[1,	0,	0],
							[0, 1,	0],
							[aParameters[0], aParameters.length > 1 ? aParameters[1] : 0, 1]
					]);
					break;

				case "matrix":							aMatrix	= cSVGElement.matrixMultiple(aMatrix, [
							[aParameters[0],	aParameters[1],	0],
							[aParameters[2],	aParameters[3],	0],
							[aParameters[4], 	aParameters[5], 1]
					]);
					break;

				case "scale":							var iScaleX	= aParameters[0],
						iScaleY	= aParameters.length > 1 ? aParameters[1] : iScaleX;

						aMatrix	= cSVGElement.matrixMultiple(aMatrix, [
								[iScaleX,	0,			0],
								[0,			iScaleY,	0],
								[0,			0, 			1]
						]);
					break;

				case "rotate":							var iAngle	= aParameters[0] * Math.PI / 180,
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

				case "skewX":							var iAngle	= aParameters[0] * Math.PI / 180,
						iTan	= Math.tan(iAngle);

					aMatrix	= cSVGElement.matrixMultiple(aMatrix, [
							[1,		iTan,	0],
							[0,		1,		0],
							[0,		0, 		1]
					]);
					break;

				case "skewY":							var iAngle	= aParameters[0] * Math.PI / 180,
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
						oElementDOM.coordOrigin	= aMatrix[2][0] / aMatrix[0][0] *-1 + "," + aMatrix[2][1] / aMatrix[1][1] *-1;

			

						oElementDOM.style.width		= aMatrix[0][0] * 100 + '%';
			oElementDOM.style.height	= aMatrix[1][1] * 100 + '%';

						
						oElementDOM.style.rotation	= nRotation;

			
					}
		else {
						oElementDOM.style.marginLeft= Math.floor(aMatrix[2][0] / aMatrix[0][0]) + "px";
			oElementDOM.style.marginTop	= Math.floor(aMatrix[2][1] / aMatrix[1][1]) + "px";

						if (!oElementDOM.skew.on)
				oElementDOM.skew.on	= true;
			oElementDOM.skew.matrix	= aMatrix[0][0].toFixed(3) + "," + aMatrix[0][1].toFixed(3) + "," + aMatrix[1][0].toFixed(3) + "," + aMatrix[1][1].toFixed(3);		}
	};

	cSVGElement.getStyleOwn	= function(oElement, sName) {
		var sValue;

				if (sValue = oElement.getAttribute("style"))
			if (sValue.match(new RegExp(sName + "\\s*:\\s*([^;]+)")))
				return RegExp.$1;

				if (sValue = oElement.getAttribute(sName))
			return sValue;

		return '';
	};

	cSVGElement.setStyleOwn	= function(oElement, sName, sValue) {
				var oElementDOM	= oElement.$getContainer();
		if (oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_image)
			oElementDOM	= oElement.$getContainer("shape");

				if (!oElementDOM)
			return;

		switch (sName) {
						case "opacity":
				if (cSVGElement.getStyle(oElement, "fill-opacity") == "")
					oElementDOM.fill.opacity	= sValue;
				if (cSVGElement.getStyle(oElement, "stroke-opacity") == "")
					oElementDOM.stroke.opacity	= sValue;
				break;
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
								oElementDOM.fill.focus		= "100%";																	oElementDOM.fill.focusposition	= cx + " " + cy;
								oElementDOM.fill.focussize		= "0 0";							}
														oElementDOM.fill.method		= "sigma";

														for (var oGradientStop = oGradient; oGradientStop && oGradientStop.hasAttribute("xlink:href"); oGradientStop = oElement.ownerDocument.getElementById(oGradientStop.getAttribute("xlink:href").substr(1)))
								if (oGradientStop.hasChildNodes())
									break;

							if (oGradientStop) {
																var aColors	= [];
								for (var i = 0, oStop, sColor; oStop = oGradientStop.childNodes[i]; i++)
									if (oGradientStop.childNodes[i] instanceof cSVGElement_stop)
										aColors.push([parseFloat(oStop.getAttribute("offset") || "1") / (oStop.getAttribute("offset").indexOf("%") ==-1 ? 1 : 100), ((sColor = cSVGElement.getStyle(oStop, "stop-color")) in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sColor] + ')' : sColor), cSVGElement.getStyle(oStop, "stop-opacity") || "1"]);

								var nLength	= aColors.length;
								if (nLength) {
																		aColors	= aColors.sort(function(color1, color2) {
										return color1[0] > color2[0];
									});

																		if (aColors[0][0] != 0)
										oElementDOM.fill.color		= aColors[0][1];
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
													}
					}
				}
				else
					oElementDOM.fill.color	= sValue in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sValue] + ')' : sValue;
				break;
			case "fill-opacity":
				oElementDOM.fill.opacity	= sValue;
				break;
						case "stroke":
				oElementDOM.stroke.on	= sValue != "none";
				oElementDOM.stroke.color	= sValue in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sValue] + ')' : sValue;
				break;
			case "stroke-width":
				var aStroke	= sValue.match(/([\d.]+)(.*)/),
					nStrokeWidth	= aStroke[1] * oElement.getAspectValue(),
					sStrokeUnit		= aStroke[2] || 'px';
				oElementDOM.stroke.weight	= nStrokeWidth + sStrokeUnit;
				if (nStrokeWidth < 1 && !(oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan))
					oElementDOM.stroke.opacity	= (oElement.hasAttribute("stroke-opacity") ? oElement.getAttribute("stroke-opacity") : 1) * nStrokeWidth;
				break;
			case "stroke-opacity":
				oElementDOM.stroke.opacity	=(oElement.getAttribute("stroke-width").match(/([\d.]+)(.*)/) && RegExp.$1 < 1 ? RegExp.$1 : 1) * sValue;
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
						case "marker-start":
				oElementDOM.stroke.startarrow	= sValue == "none" ? "none" : "classic";
				break;
			case "marker-end":
				oElementDOM.stroke.endarrow	= sValue == "none" ? "none" : "classic";
				break;
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
		}
	};

	cSVGElement.getStyle	= function(oElement, sName) {
		var sValue	= cSVGElement.getStyleOwn(oElement, sName);
		if (sValue)
			return sValue;

				if (oElement.parentNode instanceof cSVGElement_g || oElement.parentNode instanceof cSVGElement_text || oElement.parentNode instanceof cSVGElement_a)
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
			if (sValue = oStyle["stroke-linecap"])
				cSVGElement.setStyle(oElement, "stroke-linecap", sValue);
			if (sValue = oStyle["stroke-dasharray"])
				cSVGElement.setStyle(oElement, "stroke-dasharray", sValue);
						if (sValue = oStyle["marker-start"])
				cSVGElement.setStyle(oElement, "marker-start", sValue);
			if (sValue = oStyle["marker-end"])
				cSVGElement.setStyle(oElement, "marker-end", sValue);
						if (oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan) {
				if (!cSVGElement.getStyle(oElement, "text-anchor") && (sValue = oStyle["text-anchor"]))
					cSVGElement.setStyle(oElement, "text-anchor", sValue);
				if (!cSVGElement.getStyle(oElement, "font-weight") && (sValue = oStyle["fontWeight"]))
					cSVGElement.setStyle(oElement, "font-weight", sValue);
				if (!cSVGElement.getStyle(oElement, "font-family") && (sValue = oStyle["fontFamily"]))
					cSVGElement.setStyle(oElement, "font-family", sValue);
				if (!cSVGElement.getStyle(oElement, "font-size") && (sValue = oStyle["fontSize"]))
					cSVGElement.setStyle(oElement, "font-size", sValue);
			}
	};

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

				nAspect	*= Math.sqrt(Math.pow(aWidth[1], 2) + Math.pow(aHeight[1], 2)) / Math.sqrt(Math.pow(aViewBox[2], 2) + Math.pow(aViewBox[3], 2));
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

												if (sCommand == "scale")
							nAspect	*= aParameters[0];
					}
				}
			}
		}
		return nAspect;
	};

	cSVGElement.getTagStyle	= function(oElement) {
		var sOpacity		= cSVGElement.getStyle(oElement, "opacity"),
			sFill			= cSVGElement.getStyle(oElement, "fill") || "black",
			sFillOpacity	= cSVGElement.getStyle(oElement, "fill-opacity") || sOpacity,
			sStroke			= cSVGElement.getStyle(oElement, "stroke"),
			sStrokeOpacity	= cSVGElement.getStyle(oElement, "stroke-opacity") || sOpacity,
			sStrokeWidth	= cSVGElement.getStyle(oElement, "stroke-width"),
			sStrokeLineJoin	= cSVGElement.getStyle(oElement, "stroke-linejoin") || 'miter',
			sStrokeLineCap	= cSVGElement.getStyle(oElement, "stroke-linecap") || 'square',
			sStrokeDashArray= cSVGElement.getStyle(oElement, "stroke-dasharray"),
			sTransform		= cSVGElement.getTransform(oElement);

		var aStrokeWidth	= sStrokeWidth.match(/([\d.]*)(.*)/),
			nStrokeWidthValue	=(aStrokeWidth[1] || 1) * oElement.getAspectValue(),
			sStrokeWidthUnit	=(aStrokeWidth[2] || "px");
		if (nStrokeWidthValue < 1 && !(oElement instanceof cSVGElement_text || oElement instanceof cSVGElement_tspan))
			sStrokeOpacity	=(sStrokeOpacity == '' ? 1 : sStrokeOpacity) * nStrokeWidthValue;

		return '<svg2vml:fill on="' + (sFill != "none" ? "true" : "false") + '" color="' + (sFill in oSVGElement_colors ? 'rgb(' + oSVGElement_colors[sFill] + ')' : sFill) + '"\
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

	cSVGElement.strokeLineCapToEndCap	= function(sStrokeLineCap) {
		return {"butt": "flat", "round": "round"}[sStrokeLineCap] || "square";
	};

	cSVGElement.textAnchorToVTextAlign	= function(sTextAnchor) {
		return {"middle": "center", "end": "right"}[sTextAnchor] || "left";
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
				if (sName != "id" && sName != "class")
			this.$getContainer().setAttribute(sName, sValue);

				AMLElement.prototype.setAttribute.call(this, sName, sValue);
	};

	cSVGElement.prototype.removeAttribute	= function(sName) {
				if (sName != "id" && sName != "class")
			this.$getContainer().removeAttribute(sName);

				AMLElement.prototype.removeAttribute.call(this, sName);
	};

	cSVGElement.prototype.getBBox	= function() {
		return this.$getContainer().getBBox();
	};

		cSVGElement.prototype.$getTagOpen	= function()
	{
		var sHtml   = '<' + this.tagName;
		for (var sName in this.attributes)
			if (sName != "id" && sName != "class")				sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
		sHtml	+= ' class="' + ('svg-' + this.localName + ' ') + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
	    return sHtml + '>';
	};

		cSVGElement.prototype.$getTagClose	= function()
	{
	    return '</' + this.tagName + '>';
	};
};

oSVGNamespace.setElement("#element", cSVGElement);



var cSVGElement_a	= function(){};
cSVGElement_a.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
		cSVGElement_a.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "href":
						cSVGElement_a.setHref(this, oEvent.newValue);
						break;
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			if (this.hasAttribute("xlink:href"))
				cSVGElement_a.setHref(this, this.getAttribute("xlink:href"));
		}
	};

		cSVGElement_a.setHref	= function(oElement, sValue) {
		for (var nIndex = 0, oChild, oElementDOM; oChild = oElement.childNodes[nIndex]; nIndex++) {
			if (oChild instanceof cSVGElement_g)
				cSVGElement_a.setHref(oChild, sValue);
			else
			if (oChild instanceof cSVGElement_text)
				oChild.$getContainer("shape").href	= sValue;
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

if (!!document.namespaces) {
	
		cSVGElement_circle.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer(),
					oStyle		= oElement.style;
				switch (oEvent.attrName) {
					case "cx":
					case "cy":
						oStyle[oEvent.attrName == "cx" ? "left" : "top"]		=(oEvent.newValue - this.getAttribute("r"))+ "px";
						break;

					case "r":
						oStyle["width"]		= oEvent.newValue * 2 + "px";
						oStyle["height"]	= oEvent.newValue * 2 + "px";
						oStyle["left"]		=(this.getAttribute("cx") - oEvent.newValue)+ "px";
						oStyle["top"]		=(this.getAttribute("cy") - oEvent.newValue)+ "px";
						break;
										case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

						if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

						cSVGElement.applyCSS(this);
		}
	};

		cSVGElement_circle.prototype.$getTagOpen	= function() {
		var r	= this.getAttribute("r"),
			cx	= this.getAttribute("cx"),
			cy	= this.getAttribute("cy");
		return '<svg2vml:oval class="svg-circle' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:' + r * 2 + 'px;height:' + r * 2 + 'px;left:' + (cx - r) + 'px;top:' + (cy - r) + 'px;"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_circle.prototype.$getTagClose	= function() {
		return '</svg2vml:oval>';
	};
};

oSVGNamespace.setElement("circle", cSVGElement_circle);



var cSVGElement_clipPath	= function(){};
cSVGElement_clipPath.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
	};

oSVGNamespace.setElement("clipPath", cSVGElement_clipPath);



var cSVGElement_defs	= function(){};
cSVGElement_defs.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
	cSVGElement_defs.prototype.$getTagOpen	= function() {
		return '<div style="display:none">';
	};

	cSVGElement_defs.prototype.$getTagClose	= function() {
		return '</div>';
	};
}

oSVGNamespace.setElement("defs", cSVGElement_defs);



var cSVGElement_desc	= function(){};
cSVGElement_desc.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
		cSVGElement_desc.prototype.$getTag	= function() {
		return '';
	};
};

oSVGNamespace.setElement("desc", cSVGElement_desc);



var cSVGElement_ellipse	= function(){};
cSVGElement_ellipse.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
		cSVGElement_ellipse.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer(),
					oStyle		= oElement.style;
				switch (oEvent.attrName) {
					case "cx":
						oStyle.left		=(oEvent.newValue - this.getAttribute("rx"))+ "px";
						break;

					case "cy":
						oStyle.top		=(oEvent.newValue - this.getAttribute("ry"))+ "px";
						break;

					case "rx":
						oStyle.width	= oEvent.newValue * 2 + "px";
						oStyle.left		=(this.getAttribute("cx") - oEvent.newValue)+ "px";
						break;

					case "ry":
						oStyle.height	= oEvent.newValue * 2 + "px";
						oStyle.top		=(this.getAttribute("cy") - oEvent.newValue)+ "px";
						break;
										case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

						if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

						cSVGElement.applyCSS(this);
		}
	};

		cSVGElement_ellipse.prototype.$getTagOpen	= function() {
		var rx	= this.getAttribute("rx"),
			ry	= this.getAttribute("ry"),
			cx	= this.getAttribute("cx"),
			cy	= this.getAttribute("cy");
		return '<svg2vml:oval class="svg-ellipse' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:' + rx * 2 + 'px;height:' + ry * 2 + 'px;left:' + (cx - rx) + 'px;top:' + (cy - ry) + 'px;"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_ellipse.prototype.$getTagClose	= function() {
		return '</svg2vml:oval>';
	};
};

oSVGNamespace.setElement("ellipse", cSVGElement_ellipse);



var cSVGElement_foreignObject	= function(){};
cSVGElement_foreignObject.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
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
						cSVGElement.setTransform(this, oEvent.newValue);
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

						if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

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

if (!!document.namespaces) {
	
		cSVGElement_g.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "transform":
												cSVGElement.setTransform(this, oEvent.newValue);
						break;

					default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue	= this.getAttribute("transform");
			if (sValue != "")
				cSVGElement.setTransform(this, sValue);
		}
	};

		cSVGElement_g.prototype.$getTagOpen	= function() {
				return '<svg2vml:group class="svg-g' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="top:0;left:0;width:100%;height:100%;position:absolute;"\
				>';
	};

	cSVGElement_g.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

oSVGNamespace.setElement("g", cSVGElement_g);



var cSVGElement_image	= function(){};
cSVGElement_image.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
		cSVGElement_image.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "xlink:href":
						this.$getContainer("image").src	= oEvent.newValue;
						break;
										case "width":
					case "height":
						var aValue	= oEvent.newValue.match(/([\d.]+)([%\w]*)/);
						oElement.style[oEvent.attrName]	= aValue[1] + (aValue[2] || "px");
						break;
										case "x":
					case "y":
						oElement.style["margin" +(oEvent.attrName == "x" ? "Left" : "Top")]	= oEvent.newValue + "px";
						break;
										case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

						if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

						cSVGElement.applyCSS(this);
		}
	};

		cSVGElement_image.prototype.$getTagOpen	= function() {
		var aWidth	= this.getAttribute("width").match(/([\d.]+)([%\w]*)/),
			aHeight	= this.getAttribute("height").match(/([\d.]+)([%\w]*)/);
		return '<svg2vml:group class="svg-image' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:' + aWidth[1] + (aWidth[2] || 'px') + ';height:' + aHeight[1] + (aHeight[2] || 'px') + ';margin-left:' + this.getAttribute("x") + 'px;margin-top:' + this.getAttribute("y") + 'px;"\
				>\
					<svg2vml:rect class="svg-image--shape" style="width:100%;height:100%;">\
						<svg2vml:stroke on="false" />\
						<svg2vml:imagedata src="' + this.getAttribute("xlink:href")+ '" class="svg-image--image"/>\
					</svg2vml:rect>';
	};

	cSVGElement_image.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

oSVGNamespace.setElement("image", cSVGElement_image);




var cSVGElement_line	= function(){};
cSVGElement_line.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
		cSVGElement_line.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "x1":
						oElement.from	= oEvent.newValue + "," + this.getAttribute("y1");
						break;

					case "y1":
						oElement.from	= this.getAttribute("x1") + "," + oEvent.newValue;
						break;

					case "x2":
						oElement.to		= oEvent.newValue + "," + this.getAttribute("y2");
						break;

					case "y2":
						oElement.to		= this.getAttribute("x2") + "," + oEvent.newValue;
						break;
										case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

						if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

						cSVGElement.applyCSS(this);
		}
	};

		cSVGElement_line.prototype.$getTagOpen	= function() {
		return '<svg2vml:line class="svg-line' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
						from="' + this.getAttribute("x1") + ',' + this.getAttribute("y1") + '"\
						to="' + this.getAttribute("x2") + ',' + this.getAttribute("y2") + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_line.prototype.$getTagClose	= function() {
		return '</svg2vml:line>';
	};
};

oSVGNamespace.setElement("line", cSVGElement_line);



var cSVGElement_linearGradient	= function(){};
cSVGElement_linearGradient.prototype	= new cSVGElement;

if (!!document.namespaces) {
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

if (!!document.namespaces) {
	
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

if (!!document.namespaces) {
	
		cSVGElement_metadata.prototype.$getTag	= function() {
		return '';
	};
};

oSVGNamespace.setElement("metadata", cSVGElement_metadata);



var cSVGElement_path	= function(){};
cSVGElement_path.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
		cSVGElement_path.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "d":
						oElement.path	= cSVGElement_path.convert(oEvent.newValue);
						break;
										case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

						if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

						cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_path.convert	= function(sValue) {
		var aCommands	= sValue.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/ig),
			iStartX		= 0,
			iStartY		= 0,
			iCurrentX	= 0,
			iCurrentY	= 0,
			aPath		= [];

		if (!aCommands)
			return '';

		for (var i = 0, aCommand, sCommand; i < aCommands.length; i++) {
			sCommand	= aCommands[i].substr(0, 1);
			aParameters	= aCommands[i].substr(1).
								replace(/(\d)-/g, '$1,-').
								replace(/^\s+|\s+$/g, '').
								split(/[,\s]/);

						for (var j = 0; j < aParameters.length; j++)
				aParameters[j]	= Math.round(aParameters[j]);

			switch (sCommand) {
								case "M":
					iCurrentX	= aParameters[0];
					iCurrentY	= aParameters[1];
					iStartX		= iCurrentX;
					iStartY		= iCurrentY;
					aPath.push("m" + aParameters.slice(0, 2) + " ");

										if (aParameters.length == 2)
						break;
					else
						aParameters	= aParameters.slice(2);

								case "L":
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					aPath.push("l" + aParameters + " ");
					break;

				case "m":
					iCurrentX	+= aParameters[0];
					iCurrentY	+= aParameters[1];
					iStartX		= iCurrentX;
					iStartY		= iCurrentY;

					aPath.push("t" + aParameters.slice(0, 2) + " ");

										if (aParameters.length == 2)
						break;
					else
						aParameters	= aParameters.slice(2);

				case "l":
					for (var j = 0; j < aParameters.length; j+= 2) {
						iCurrentX	+= aParameters[j];
						iCurrentY	+= aParameters[j + 1];
					}
					aPath.push("r" + aParameters + " ");
					break;

								case "H":
					iCurrentX	= aParameters[0];
					aPath.push("l" + iCurrentX + "," + iCurrentY + " ");
					break;

				case "h":
					iCurrentX	+= aParameters[0];
					aPath.push("r" + aParameters[0] + "," + "0" + " ");
					break;

								case "V":
					iCurrentY	= aParameters[0];
					aPath.push("l" + iCurrentX + "," + iCurrentY + " ");
					break;

				case "v":
					iCurrentY	+= aParameters[0];
					aPath.push("r" + "0" + "," + aParameters[0] + " ");
					break;

								case "C":
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					aPath.push("c" + aParameters + " ");
					break;

				case "c":
					iCurrentX	+= aParameters[aParameters.length - 2];
					iCurrentY	+= aParameters[aParameters.length - 1];
					aPath.push("v" + aParameters + " ");
					break;

								case "S":
					iCurrentX	= aParameters[2];
					iCurrentY	= aParameters[3];
					aPath.push("c" + iCurrentX + "," + iCurrentY + "," + aParameters + " ");
					break;

				case "s":
					iCurrentX	+= aParameters[2];
					iCurrentY	+= aParameters[3];
					aPath.push("v" + iCurrentX + "," + iCurrentY + "," + aParameters + " ");
					break;

								case "Q":
					iCurrentX	= aParameters[2];
					iCurrentY	= aParameters[3];
					aPath.push("qb" + aParameters + " ");
					break;

				case "q":
					iCurrentX	+= aParameters[2];
					iCurrentY	+= aParameters[3];
					aPath.push("qb" + aParameters[0] + "," + aParameters[1] + "," + iCurrentX + "," + iCurrentY + " ");
					break;

								case "T":
										iCurrentX	= aParameters[0];
					iCurrentY	= aParameters[1];
					aPath.push("l" + iCurrentX + "," + iCurrentY);
					break;

				case "t":
										iCurrentX	+= aParameters[0];
					iCurrentY	+= aParameters[1];
					aPath.push("l" + iCurrentX + "," + iCurrentY);
					break;

								case "A":
				case "a":

					var iRadiusX	= aParameters[0],
						iRadiusY	= aParameters[1],
						iRotation	= aParameters[2],
						bLargeArc	= aParameters[3] == "1",
						bSweep		= aParameters[4] == "1",
						iToX		= aParameters[5] + (sCommand == "A" ? 0 : iCurrentX),
						iToY		= aParameters[6] + (sCommand == "A" ? 0 : iCurrentY);

					var iFromX	= iCurrentX,
						iFromY	= iCurrentY,
						a	= (iToX - iFromX) / (2 * iRadiusX),
						b	= (iToY - iFromY) / (2 * iRadiusY),
						x	= Math.atan(a / b),
						y	= Math.asin((bSweep == bLargeArc ? -1 : 1) * Math.sqrt(a * a + b * b)),
						iAngleTo	= x + y,
						iAngleFrom	= x - y,
						iCenterX	= Math.round(iToX + (a < 0 ? 1 :-1) * iRadiusX * Math.cos(iAngleTo)),
						iCenterY	= Math.round(iToY + (b < 0 ? 1 :-1) * iRadiusY * Math.sin(iAngleTo)),
						iLeft	= iCenterX - iRadiusX,
						iTop	= iCenterY - iRadiusY,
						iRight	= iCenterX + iRadiusX,
						iBottom	= iCenterY + iRadiusY;


					aPath.push("at" + iLeft + "," + iTop + "," + iRight + "," + iBottom + "," + iFromX + "," + iFromY + "," + iToX + "," + iToY + " ");

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
		}

		return aPath.join('') + "e";
	};


	function getEllipseCenter(x1,y1,x2,y2,rx,ry)
	{
		var y1a = y1 * rx/ry; 		var y2a = y2 * rx/ry; 		var deltaX = x2-x1;
		var deltaY = y2a-y1a; 		var deltaXsqr = deltaX * deltaX;
		var deltaYsqr = deltaY * deltaY;
		var bigroot = Math.sqrt(Math.abs(rx*rx/(deltaXsqr + deltaYsqr) - 0.25));
		var c1 = 0.5 * (x1 + x2) + bigroot * (y1a - y2a);
		var d1a = 0.5 * (y1a + y2a) + bigroot * (x2 - x1);
		var c2 = 0.5 * (x1 + x2) - bigroot * (y1a - y2a);
		var d2a = 0.5 * (y1a + y2a) - bigroot * (x2 - x1);
		return [c1, d1a*ry/rx, c2, d2a*ry/rx];
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
};

oSVGNamespace.setElement("path", cSVGElement_path);



var cSVGElement_pattern	= function(){};
cSVGElement_pattern.prototype	= new cSVGElement;

if (!!document.namespaces) {
	};

oSVGNamespace.setElement("pattern", cSVGElement_pattern);



var cSVGElement_polygon	= function(){};
cSVGElement_polygon.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
		cSVGElement_polygon.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "points":
						var aPoints = oEvent.newValue.split(/[ ,]/);
						oElement.path	= 'm ' + aPoints[0] + ',' + aPoints[1] + ' l ' + aPoints + ' xe';
						break;
										case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

						if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

						cSVGElement.applyCSS(this);
		}
	};

		cSVGElement_polygon.prototype.$getTagOpen	= function() {
		var aPoints = this.getAttribute("points").split(/[ ,]/);
		return '<svg2vml:shape class="svg-polygon' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
						style="position:absolute;height:100%; width:100%;"\
						path="' + 'm ' + aPoints[0] + ',' + aPoints[1] + ' l ' + aPoints + ' xe' + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_polygon.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("polygon", cSVGElement_polygon);



var cSVGElement_polyline	= function(){};
cSVGElement_polyline.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
		cSVGElement_polyline.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "points":
						oElement.points	= oEvent.newValue;
						break;
										case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

						if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

						cSVGElement.applyCSS(this);
		}
	};

		cSVGElement_polyline.prototype.$getTagOpen	= function() {
		return '<svg2vml:polyline class="svg-polyline' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
						points="' + this.getAttribute("points") + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_polyline.prototype.$getTagClose	= function() {
		return '</svg2vml:polyline>';
	};
};

oSVGNamespace.setElement("polyline", cSVGElement_polyline);



var cSVGElement_radialGradient	= function(){};
cSVGElement_radialGradient.prototype	= new cSVGElement;

if (!!document.namespaces) {
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

if (!!document.namespaces) {
	
		cSVGElement_rect.handlers	= {
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
					case "rx":
					case "ry":
												break;
										case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

						cSVGElement.applyCSS(this);
		}
	};

		cSVGElement_rect.prototype.$getTagOpen	= function() {
		var nRx	= this.getAttribute("rx"),
			nRy	= this.getAttribute("ry"),
			arcSize	= (nRx && nRy ? Math.min(nRx, nRy) : (nRx || nRy)) / Math.min(this.getAttribute("width"), this.getAttribute("height"));
		return '<svg2vml:roundrect class="svg-rect' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" \
					style="position:absolute;width:' + this.getAttribute("width") + 'px;height:' + this.getAttribute("height") + 'px;left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;"\
					arcSize="' + arcSize + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_rect.prototype.$getTagClose	= function() {
		return '</svg2vml:roundrect>';
	};
};

oSVGNamespace.setElement("rect", cSVGElement_rect);



var cSVGElement_script	= function(){};
cSVGElement_script.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
		cSVGElement_script.prototype.$getTagOpen	= function() {
		return '';
	};

	cSVGElement_script.prototype.$getTagClose	= function() {
		return '';
	};
};

oSVGNamespace.setElement("script", cSVGElement_script);



var cSVGElement_stop	= function(){};
cSVGElement_stop.prototype	= new cSVGElement;

if (!!document.namespaces) {
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

if (!!document.namespaces) {
	
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

if (!!document.namespaces) {
	
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
				that.$getContainer("group").style.display	= "";
			}, 0);
						if (navigator.userAgent.match(/MSIE ([0-9.]+)/) && RegExp.$1 * 1 == 8)
				cSVGElement_svg.resize(this);
		}
	};

	cSVGElement_svg.resize	= function(oInstance) {
		var oElement	= oInstance.$getContainer(),
			oElementGroup	= oInstance.$getContainer("group"),
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
		return '<div class="svg-svg' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="position:relative;display:inline-block;overflow:hidden;"\
					onresize="var o = ample.$instance(this); ample.domConfig.getNamespace(o.namespaceURI).getElement(o.localName).resize(o)">\
					<svg2vml:group class="svg-svg--group" style="position:absolute;display:none;"\
						coordOrigin="0,0"\
						coordSize="' + (aViewBox[2] || aWidth[1] || 600) + ',' + (aViewBox[3] || aHeight[1] || 600) + '"\
					>';
	};

	cSVGElement_svg.prototype.$getTagClose	= function() {
		return 		'</svg2vml:group>\
				</div>';
	};
};

oSVGNamespace.setElement("svg", cSVGElement_svg);



var cSVGElement_text	= function(){};
cSVGElement_text.prototype	= new cSVGElement;

if (!!document.namespaces) {
		cSVGElement_text.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer("shape");
				switch (oEvent.attrName) {
					case "x":
						oElement.style.left	= oEvent.newValue + 'px';
						break;

					case "y":
						oElement.style.top	= oEvent.newValue + 'px';
						break;
										case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

			var oLabel	= this.$getContainer("label");
			if (this.firstChild instanceof AMLCharacterData)
				oLabel.string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');;

			var sValue;

						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

						cSVGElement.applyCSS(this);
		},
		'DOMCharacterDataModified':	function(oEvent) {
			this.$getContainer("label").string	= oEvent.target.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');;
		}
	};

		cSVGElement_text.prototype.$getTagOpen	= function() {
		var sFontFamily	= cSVGElement.getStyle(this, "font-family") || "Times New Roman",
			sFontWeight	= cSVGElement.getStyle(this, "font-weight"),
			sFontSize	= cSVGElement.getStyle(this, "font-size"),
			sTextAnchor	= cSVGElement.getStyle(this, "text-anchor"),
						aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1] || 0,
			nFontSize	= Math.round(nFontSizeValue * this.getAspectValue()),
			nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

		return '<svg2vml:group class="svg-text' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="top:0;left:0;width:100%;height:100%;position:absolute;">\
					<svg2vml:shape class="svg-text--shape"\
						style="position:absolute;margin-top:' + nMarginTop + 'px;left:' + (this.getAttribute("x") || "0") + 'px;top:' + (this.getAttribute("y") || "0") + 'px;width:100%;height:100%;"\
						path="m 0,0 l 100,0 xe" allowoverlap="true"\
					>' + cSVGElement.getTagStyle(this) + '\
						<svg2vml:path textpathok="true" />\
						<svg2vml:textpath on="true" xscale="true" class="svg-text--label"\
							style="v-text-align:' + cSVGElement.textAnchorToVTextAlign(sTextAnchor) + ';font-size:' + nFontSize + sFontSizeUnit + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + '" />\
					</svg2vml:shape>';
	};

	cSVGElement_text.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

oSVGNamespace.setElement("text", cSVGElement_text);



var cSVGElement_textPath	= function(){};
cSVGElement_textPath.prototype	= new cSVGElement;

if (!!document.namespaces) {
			cSVGElement_textPath.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "xlink:href":
						oElement.setAttribute(oEvent.attrName, oEvent.newValue);
						break;
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var oText	= this.parentNode,
				sValue;
			if (oText instanceof cSVGElement_text) {
								var oTextPath = this.ownerDocument.getElementById(this.getAttribute("xlink:href").substr(1));
				if (oTextPath) {
					oText.$getContainer("shape").path	= cSVGElement_path.convert(oTextPath.getAttribute("d"));

										if (!oText.getAttribute("fill"))
						if (sValue = (this.getAttribute("fill") || oText.getAttribute("fill")))
							oText.setAttribute("fill", sValue);

					if (!oText.getAttribute("stroke"))
						if (sValue = (this.getAttribute("stroke") || oText.getAttribute("stroke")))
							oText.setAttribute("stroke", sValue);
				}
								if (this.firstChild instanceof AMLCharacterData)
					oText.$getContainer("label").string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');;
			}
		}
	};

		cSVGElement_textPath.prototype.$getTagOpen	= function() {
		return '<span class="svg-textPath' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="display:none">';
	};

	cSVGElement_textPath.prototype.$getTagClose	= function() {
		return '</span>';
	};
};

oSVGNamespace.setElement("textPath", cSVGElement_textPath);



var cSVGElement_title	= function(){};
cSVGElement_title.prototype	= new cSVGElement;

if (!!document.namespaces) {
	
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



var cSVGElement_tspan	= function(){};
cSVGElement_tspan.prototype	= new cSVGElement;

if (!!document.namespaces) {
		cSVGElement_tspan.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
										case "x":
					case "y":
						oElement.style[oEvent.attrName == "x" ? "left" : "top"]	= oEvent.newValue + "px";
						break;
										default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var oLabel	= this.$getContainer("label");
			if (this.firstChild instanceof AMLCharacterData)
				oLabel.string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

			var sValue;

						if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

						cSVGElement.applyCSS(this);
		}
	};

		cSVGElement_tspan.prototype.$getTagOpen	= function() {
		var sFontFamily	= cSVGElement.getStyle(this, "font-family") || "Times New Roman",
			sFontWeight	= cSVGElement.getStyle(this, "font-weight"),
			sFontSize	= cSVGElement.getStyle(this, "font-size"),
			sTextAnchor	= cSVGElement.getStyle(this, "text-anchor"),
						aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1] || 128,
			nFontSize	= Math.round(nFontSizeValue * this.getAspectValue()),
			nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

		return '<svg2vml:shape class="svg-tspan' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;margin-top:' + nMarginTop + 'px;left:' + (this.getAttribute("x") || (this.parentNode ? this.parentNode.getAttribute("x") : "0")) + 'px;top:' + (this.getAttribute("y") || (this.parentNode ? this.parentNode.getAttribute("y") : "0")) + 'px;width:100%;height:100%;"\
					path="m 0,0 l 100,0 x" allowoverlap="true"\
				>' + cSVGElement.getTagStyle(this) + '\
					<svg2vml:path textpathok="true" />\
					<svg2vml:textpath on="true" xscale="true" class="svg-tspan--label"\
						style="v-text-align:' + cSVGElement.textAnchorToVTextAlign(sTextAnchor) + ';font-size:' + nFontSize + sFontSizeUnit + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + '" />\
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

if (!!document.namespaces) {
		cSVGElement_use.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sHref	= this.getAttribute("xlink:href"),
				that	= this;
			if (sHref) {
				setTimeout(function() {
					var oRef	= that.ownerDocument.getElementById(sHref.substr(1));
					if (oRef && oRef.hasAttribute("d")) {
						that.$getContainer().path	= oRef.$getContainer().path;
					}
				});
			}
		}
	};

		cSVGElement_use.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-path' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;top:0;left:0;height:100%;width:100%;"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_use.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

oSVGNamespace.setElement("use", cSVGElement_use);


})()
