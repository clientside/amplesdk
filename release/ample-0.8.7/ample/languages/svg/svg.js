(function () {
var oSVGNamespace	= new AMLNamespace;

// Register language
ample.domConfig.setNamespace("http://www.w3.org/2000/svg", oSVGNamespace);
var cSVGElement	= function(){};
cSVGElement.prototype	= new AMLElement;

if (!!document.namespaces) {
	// Add namespace
	document.namespaces.add("svg2vml", "urn:schemas-microsoft-com:vml", "#default#VML");

	//
	cSVGElement.setTransform	= function(oElement, sValue) {
		var oElementDOM	= oElement.$getContainer(),
			aCommands	= sValue.match(/\w+\([^\)]+\s*,?\)/g),
			nRotation	= 0,
			aMatrix		= cSVGElement.matrixCreate();

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
							[iCos,	iSin,	0],
							[-iSin,	iCos,	0],
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
			oElementDOM.style.marginLeft= aMatrix[2][0] / aMatrix[0][0] + "px";
			oElementDOM.style.marginTop	= aMatrix[2][1] / aMatrix[1][1] + "px";

			// Apply Matrix
			if (!oElementDOM.skew.on)
				oElementDOM.skew.on	= true;
			oElementDOM.skew.matrix= aMatrix[0][0] + "," + aMatrix[0][1] + "," + aMatrix[1][0] + "," + aMatrix[1][1];
		}
	};

	cSVGElement.getStyle	= function(oElement, sName) {
		var sValue;

		// 1) first check if style specified
		if (sValue = oElement.getAttribute("style")) {
			var aStyles	= sValue.split(/;/g);
			for (var nIndex = 0, nLength = aStyles.length; nIndex < nLength; nIndex++)
				if ((aStyle = aStyles[nIndex].match(/\s*([\w-]+)\s*:\s*(.+)\s*/i)) && aStyle[1] == sName)
					return aStyle[2];
		}

		// 2) second check if attribute specified
		if (sValue = oElement.getAttribute(sName))
			return sValue;

		// 3) third check if parent is group
		if (oElement.parentNode instanceof cSVGElement_g)
			return cSVGElement.getStyle(oElement.parentNode, sName);

		return '';
	};

	cSVGElement.setStyle	= function(oElement, sName, sValue) {
		var oElementDOM	= oElement.$getContainer();
		switch (sName) {
			case "opacity":
				if (oElement.getStyle("fill-opacity") == "")
					oElementDOM.fill.opacity	= sValue;
				if (oElement.getStyle("stroke-opacity") == "")
					oElementDOM.stroke.opacity	= sValue;
				break;
			case "fill":
				oElementDOM.fill.on	= sValue != "none";
				var aValue, oGradient;
				if (aValue = sValue.match(/url\(#(\w+)\)/)) {
					if (oGradient = oElement.ownerDocument.getElementById(aValue[1])) {
						if (oGradient instanceof cSVGElement_linearGradient || oGradient instanceof cSVGElement_radialGradient) {
							if (oGradient instanceof cSVGElement_linearGradient) {
								var x1	= parseFloat(oGradient.getAttribute("x1") || "0") / (oGradient.getAttribute("x1").indexOf("%") ==-1 ? 1 : 100),
									x2	= parseFloat(oGradient.getAttribute("x2") || "1") / (oGradient.getAttribute("x2").indexOf("%") ==-1 ? 1 : 100),
									y1	= parseFloat(oGradient.getAttribute("y1") || "0") / (oGradient.getAttribute("y1").indexOf("%") ==-1 ? 1 : 100),
									y2	= parseFloat(oGradient.getAttribute("y2") || "0") / (oGradient.getAttribute("y2").indexOf("%") ==-1 ? 1 : 100);
								oElementDOM.fill.type		= "gradient";
								oElementDOM.fill.angle		= 90 - Math.round(Math.atan((y2 - y1) / (x2 - x1)) * 180 / Math.PI);
							}
							else {
								oElementDOM.fill.type		= "gradientradial";
								// Properties specific to radial gradients
								oElementDOM.fill.focusposition	=(oGradient.getAttribute("cx") || 0.5) + " " + (oGradient.getAttribute("cy") || 0.5);
								oElementDOM.fill.focussize		= "0 0";//(oGradient.getAttribute("r") || 0) + " " + (oGradient.getAttribute("r") || 0);
							}

							oElementDOM.fill.focus		= "100%";
							oElementDOM.fill.method		= "sigma";

							// Find referred gradient with stops
							for (var oGradientStop = oGradient; oGradientStop && oGradientStop.hasAttribute("xlink:href"); oGradientStop = oElement.ownerDocument.getElementById(oGradientStop.getAttribute("xlink:href").substr(1)))
								if (oGradientStop.hasChildNodes())
									break;

							if (oGradientStop) {
								// Collect stops
								var aColors	= [];
								for (var i = 0, oStop; oStop = oGradientStop.childNodes[i]; i++)
									if (oGradientStop.childNodes[i] instanceof cSVGElement_stop)
										aColors.push([parseFloat(oStop.getAttribute("offset") || "1") / (oStop.getAttribute("offset").indexOf("%") ==-1 ? 1 : 100), cSVGElement.getStyle(oStop, "stop-color"), cSVGElement.getStyle(oStop, "stop-opacity") || "1"]);

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
					oElementDOM.fill.color	= sValue;
				break;
			case "fill-opacity":
				oElementDOM.fill.opacity	= sValue;
				break;
			case "stroke":
				oElementDOM.stroke.on	= sValue != "none";
				oElementDOM.stroke.color	= sValue;
				break;
			case "stroke-width":
				var aStroke	= sValue.match(/([\d.]+)(.*)/),
					nStrokeWidth	= aStroke[1] * oElement.getAspectValue(),
					sStrokeUnit		= aStroke[2] || 'px';
				oElementDOM.stroke.weight	= nStrokeWidth + sStrokeUnit;
				if (nStrokeWidth < 1)
					oElementDOM.stroke.opacity	= (oElement.hasAttribute("stroke-opacity") ? oElement.getAttribute("stroke-opacity") : 1) * nStrokeWidth;
				break;
			case "stroke-opacity":
				oElementDOM.stroke.opacity	=(oElement.getAttribute("stroke-width").match(/([\d.]+)(.*)/) && RegExp.$1 < 1 ? RegExp.$1 : 1) * sValue;
				break;
			case "stroke-linejoin":
				oElementDOM.stroke.joinStyle	= sValue;
				break;
			case "stroke-linecap":
				oElementDOM.stroke.endCap		= sValue == 'butt' ? 'flat' : sValue == 'round' ? 'round' : 'square';
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
		}
	};

	cSVGElement.applyCSS	= function(oElement) {
		setTimeout(function() {
			var oStyle	= oElement.$getContainer().currentStyle;
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
		}, 0);
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

						// TODO: account for final matrix
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
		if (nStrokeWidthValue < 1)
			sStrokeOpacity	=(sStrokeOpacity == '' ? 1 : sStrokeOpacity) * nStrokeWidthValue;

		return '<svg2vml:fill on="' + (sFill != "none" ? "true" : "false") + '" color="' + sFill + '"\
					' + (sFillOpacity ? ' opacity="' + sFillOpacity + '"' : '') + '\
				/>\
				<svg2vml:stroke on="' + (sStroke && sStroke != "none" ? "true" : "false") + '" color="' + (sStroke || 'black') + '"\
					' + (sStrokeOpacity ? ' opacity="' + sStrokeOpacity + '"' : '') + '\
					' + (sStrokeWidth ? ' weight="' + nStrokeWidthValue + sStrokeWidthUnit + '"' : '') + '\
					' + (sStrokeLineCap ? ' endCap="' + (sStrokeLineCap == 'butt' ? 'flat' : sStrokeLineCap == 'round' ? 'round' : 'square') + '"' : '') + '\
					' + (sStrokeDashArray ? ' dashStyle="' + sStrokeDashArray.replace(/,/g, ' ') + '"' : '') + '\
					' + (sStrokeLineJoin ? ' joinStyle="' + sStrokeLineJoin + '"' : '') + '\
				/>\
				<svg2vml:skew on="' + (sTransform ? "true" : "false") + '"\
					' + (sTransform ? ' matrix="' + sTransform + '"' : '') + '/>';
	};
//	<svg2vml:shadow on="true" type="double" color="yellow" color2="green" offset="1pt" opacity="0.5"/>\
//	<svg2vml:extrusion xmetal="on" on="true" backdepth="20" xedge="5" xcolor="green" xrotationangle="0,5"/>\

	cSVGElement.parseUnit	= function(sValue) {
		var aValue	= sValue.match(/(^\d*(?:.\d+))\s*([a-z%]+)?$/);
		return aValue ? [aValue[1], aValue[2] || ''] : [0, ''];
	};
}
else {
	cSVGElement.prototype.setAttribute	= function(sName, sValue) {
		// Map attribute value
		if (sName != "id" && sName != "class")
			this.$getContainer().setAttribute(sName, sValue);

		//
		AMLElement.prototype.setAttribute.call(this, sName, sValue);
	};

	cSVGElement.prototype.removeAttribute	= function(sName) {
		// Map attribute value
		if (sName != "id" && sName != "class")
			this.$getContainer().removeAttribute(sName);

		//
		AMLElement.prototype.removeAttribute.call(this, sName);
	};

	// Default Element Render: open
	cSVGElement.prototype.$getTagOpen	= function()
	{
		var sHtml   = '<' + this.tagName;
		for (var sName in this.attributes)
			if (sName != "id" && sName != "class")// && sName.indexOf(':') ==-1)
				sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
		sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
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
var cSVGElement_a	= function(){};
cSVGElement_a.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
	cSVGElement_a.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "href":
						oElement.href	= oEvent.newValue;
						break;
				}
			}
		}
	};

	// presentation
	cSVGElement_a.prototype.$getTagOpen	= function() {
		return '';/*'<a class="svg-a' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="width:' + this.getAttribute("width") + 'px;height:' + this.getAttribute("height") + 'px;left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;"\
					href="' + this.getAttribute("href") + '"\
				>';*/
	};

	cSVGElement_a.prototype.$getTagClose	= function() {
		return '';/*'</a>';*/
	};
};

// Register Element with language
oSVGNamespace.setElement("a", cSVGElement_a);
var cSVGElement_circle	= function(){};
cSVGElement_circle.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
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
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

			// Apply transform
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	// presentation
	cSVGElement_circle.prototype.$getTagOpen	= function() {
		var r	= this.getAttribute("r"),
			cx	= this.getAttribute("cx"),
			cy	= this.getAttribute("cy");
		return '<svg2vml:oval class="svg-circle' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="width:' + r * 2 + 'px;height:' + r * 2 + 'px;left:' + (cx - r) + 'px;top:' + (cy - r) + 'px;"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_circle.prototype.$getTagClose	= function() {
		return '</svg2vml:oval>';
	};
};

// Register Element with language
oSVGNamespace.setElement("circle", cSVGElement_circle);
var cSVGElement_clipPath	= function(){};
cSVGElement_clipPath.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE
};

// Register Element with language
oSVGNamespace.setElement("clipPath", cSVGElement_clipPath);
var cSVGElement_defs	= function(){};
cSVGElement_defs.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	cSVGElement_defs.prototype.$getTagOpen	= function() {
		return '<div style="display:none">';
	};

	cSVGElement_defs.prototype.$getTagClose	= function() {
		return '</div>';
	};
}

// Register Element with language
oSVGNamespace.setElement("defs", cSVGElement_defs);
var cSVGElement_desc	= function(){};
cSVGElement_desc.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// presentation
	cSVGElement_desc.prototype.$getTagOpen	= function() {
		return '';
	};

	cSVGElement_desc.prototype.$getTagClose	= function() {
		return '';
	};
};

// Register Element with language
oSVGNamespace.setElement("desc", cSVGElement_desc);
var cSVGElement_ellipse	= function(){};
cSVGElement_ellipse.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
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
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

			// Apply transform
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	// presentation
	cSVGElement_ellipse.prototype.$getTagOpen	= function() {
		var rx	= this.getAttribute("rx"),
			ry	= this.getAttribute("ry"),
			cx	= this.getAttribute("cx"),
			cy	= this.getAttribute("cy");
		return '<svg2vml:oval class="svg-ellipse' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="width:' + rx * 2 + 'px;height:' + ry * 2 + 'px;left:' + (cx - rx) + 'px;top:' + (cy - ry) + 'px;"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_ellipse.prototype.$getTagClose	= function() {
		return '</svg2vml:oval>';
	};
};

// Register Element with language
oSVGNamespace.setElement("ellipse", cSVGElement_ellipse);
var cSVGElement_foreignObject	= function(){};
cSVGElement_foreignObject.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
	cSVGElement_foreignObject.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					//
					case "width":
					case "height":
						oElement.style[oEvent.attrName]	= oEvent.newValue + "px";
						break;
					//
					case "x":
					case "y":
						oElement.style[oEvent.attrName == "x" ? "left" : "top"]	= oEvent.newValue + "px";
						break;
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
						break;
					//
					default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;

			// Apply transform
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	// presentation
	cSVGElement_foreignObject.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-foreignObject' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="width:' + this.getAttribute("width") + 'px;height:' + this.getAttribute("height") + 'px;left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_foreignObject.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element with language
oSVGNamespace.setElement("foreignObject", cSVGElement_foreignObject);
var cSVGElement_g	= function(){};
cSVGElement_g.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// Class Event Handlers
	cSVGElement_g.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "transform":
						// do not propagate this attribute change to children!
						cSVGElement.setTransform(this, oEvent.newValue);
						break;

					default:
						// Propagate changes to child elements
						for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
							if (this.childNodes[nIndex].nodeType == 1)
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

	// presentation
	cSVGElement_g.prototype.$getTagOpen	= function() {
		// Keep left:0 and top:0
		return '<svg2vml:group class="svg-g' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="top:0;left:0;width:100%;height:100%;position:absolute;"\
				>';
	};

	cSVGElement_g.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

// Register Element with language
oSVGNamespace.setElement("g", cSVGElement_g);
var cSVGElement_image	= function(){};
cSVGElement_image.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
	cSVGElement_image.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "xlink:href":
						this.$getContainer("image").src	= oEvent.newValue;
						break;
					//
					case "width":
					case "height":
						oElement.style[oEvent.attrName]	= oEvent.newValue + "px";
						break;
					//
					case "x":
					case "y":
						oElement.style[oEvent.attrName == "x" ? "left" : "top"]	= oEvent.newValue + "px";
						break;
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

			// Apply transform
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	// presentation
	cSVGElement_image.prototype.$getTagOpen	= function() {
		return '<svg2vml:group class="svg-image' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="width:' + this.getAttribute("width") + 'px;height:' + this.getAttribute("height") + 'px;margin-left:' + this.getAttribute("x") + 'px;margin-top:' + this.getAttribute("y") + 'px;"\
				>\
					<svg2vml:rect style="width:100%;height:100%;">\
						<svg2vml:stroke on="false" />\
						<svg2vml:imagedata src="' + this.getAttribute("xlink:href")+ '" class="svg-image--image"/>\
					</svg2vml:rect>';
	};

	cSVGElement_image.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

// Register Element with language
oSVGNamespace.setElement("image", cSVGElement_image);

var cSVGElement_line	= function(){};
cSVGElement_line.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
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
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

			// Apply transform
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	// presentation
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

// Register Element with language
oSVGNamespace.setElement("line", cSVGElement_line);
var cSVGElement_linearGradient	= function(){};
cSVGElement_linearGradient.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE
};

// Register Element with language
oSVGNamespace.setElement("linearGradient", cSVGElement_linearGradient);
var cSVGElement_marker	= function(){};
cSVGElement_marker.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// presentation
	cSVGElement_marker.prototype.$getTagOpen	= function() {
		return '';
	};

	cSVGElement_marker.prototype.$getTagClose	= function() {
		return '';
	};
};

// Register Element with language
oSVGNamespace.setElement("marker", cSVGElement_marker);
var cSVGElement_path	= function(){};
cSVGElement_path.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
	cSVGElement_path.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "d":
						oElement.path	= cSVGElement_path.convert(oEvent.newValue);
						break;
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	cSVGElement_path.convert	= function(sValue) {
		var aCommands	= sValue.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/ig),
			iStartX		= 0,
			iStartY		= 0,
			iCurrentX	= 0,
			iCurrentY	= 0,
			sPath		= "";

		if (!aCommands)
			return '';

		for (var i = 0, aCommand, sCommand; i < aCommands.length; i++) {
			sCommand	= aCommands[i].substr(0, 1);
			aParameters	= aCommands[i].substr(1).
								replace(/(\d)-/g, '$1,-').
								replace(/^\s+|\s+$/g, '').
								split(/[,\s+]/);

			// Round command parameters values
			for (var j = 0; j < aParameters.length; j++)
				aParameters[j]	= Math.round(aParameters[j]);

			switch (sCommand) {
				// moveto (x y)+
				case "M":
					iCurrentX	= aParameters[0];
					iCurrentY	= aParameters[1];
					iStartX		= iCurrentX;
					iStartY		= iCurrentY;
					sPath	+= "m" + aParameters.slice(0, 2) + " ";

					// If there are more that 2 parameters, draw line out of the rest of parameters
					if (aParameters.length == 2)
						break;
					else
						aParameters	= aParameters.slice(2);

				// lineto (x y)+
				case "L":
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					sPath	+= "l" + aParameters + " ";
					break;

				case "m":
					iCurrentX	+= aParameters[0];
					iCurrentY	+= aParameters[1];
					iStartX		= iCurrentX;
					iStartY		= iCurrentY;

					sPath	+= "t" + aParameters.slice(0, 2) + " ";

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
					sPath	+= "r" + aParameters + " ";
					break;

				// horizontal lineto x+
				case "H":
					iCurrentX	= aParameters[0];
					sPath	+= "l" + iCurrentX + "," + iCurrentY + " ";
					break;

				case "h":
					iCurrentX	+= aParameters[0];
					sPath	+= "r" + aParameters[0] + "," + "0" + " ";
					break;

				// vertical lineto y+
				case "V":
					iCurrentY	= aParameters[0];
					sPath	+= "l" + iCurrentX + "," + iCurrentY + " ";
					break;

				case "v":
					iCurrentY	+= aParameters[0];
					sPath	+= "r" + "0" + "," + aParameters[0] + " ";
					break;

				// curveto (x1 y1 x2 y2 x y)+
				case "C":
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					sPath	+= "c" + aParameters + " ";
					break;

				case "c":
					iCurrentX	+= aParameters[aParameters.length - 2];
					iCurrentY	+= aParameters[aParameters.length - 1];
					sPath	+= "v" + aParameters + " ";
					break;

				// shorthand/smooth curveto (x2 y2 x y)+
				case "S":
					iCurrentX	= aParameters[2];
					iCurrentY	= aParameters[3];
					sPath	+= "c" + iCurrentX + "," + iCurrentY + "," + aParameters + " ";
					break;

				case "s":
					iCurrentX	+= aParameters[2];
					iCurrentY	+= aParameters[3];
					sPath	+= "v" + iCurrentX + "," + iCurrentY + "," + aParameters + " ";
					break;

				// quadratic Bézier curveto (x1 y1 x y)+
				case "Q":
					iCurrentX	= aParameters[2];
					iCurrentY	= aParameters[3];
					sPath	+= "qb" + aParameters + " ";
//									sPath	+= "l" + iCurrentX + "," + iCurrentY;
					break;

				case "q":
					iCurrentX	+= aParameters[2];
					iCurrentY	+= aParameters[3];
					sPath	+= "qb" + aParameters[0] + "," + aParameters[1] + "," + iCurrentX + "," + iCurrentY + " ";
//									sPath	+= "l" + iCurrentX + "," + iCurrentY;
					break;

				// Shorthand/smooth quadratic Bézier curveto (x y)+
				case "T":
					// TODO
					iCurrentX	= aParameters[0];
					iCurrentY	= aParameters[1];
//									sPath	+= "qb" + aParameters + " ";
					sPath	+= "l" + iCurrentX + "," + iCurrentY;
					break;

				case "t":
					// TODO
					iCurrentX	+= aParameters[0];
					iCurrentY	+= aParameters[1];
//									sPath	+= "qb" + iCurrentX + "," + iCurrentY + " ";
					sPath	+= "l" + iCurrentX + "," + iCurrentY;
					break;

				// elliptical arc (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
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
//alert([x, y]);

//alert("<br /><div style='font-weight:bold; color:" + this.getSVGStyleValueInherited("stroke")+ "'>&gt; " + this.boundElement.getAttribute("d") + "</div>");
//alert(["a, b:", a, b]);
//alert(["x, y:", x, y]);
//alert(["from (x, y, angle):", iFromX, iFromY, Math.round(180 * iAngleFrom / Math.PI)]);
//alert(["to (x, y, angle):", iToX, iToY, Math.round(180 * iAngleTo / Math.PI)]);
//alert(["center:", iCenterX, iCenterY]);

//										sPath	+= "l" + iToX + " " + iToY + " ";
						sPath	+= /*(bSweep ? "wa" : */"at"/*)*/ + iLeft + "," + iTop + "," + iRight + "," + iBottom + "," + iFromX + "," + iFromY + "," + iToX + "," + iToY + " ";
/*

					var currDigits	= aParameters;
					var prevEndX	= iCurrentX;
					var prevEndY	= iCurrentY;

					var rx = currDigits[0];
					var ry = currDigits[1];
					var xAxisRotationFlag = currDigits[2];
					var largeArcFlag = currDigits[3];
					var clockwise = currDigits[4];
					var x2 = currDigits[5];
					var y2 = currDigits[6];
					var centers = getEllipseCenter(prevEndX,prevEndY,x2,y2,rx,ry);

					//left, top, right, bottom start(x,y) end(x,y)
					var centerX;
					var centerY;
					if (largeArcFlag == 0 ^ clockwise == 0)
					{
						centerX = centers[0];
						centerY = centers[1];
					}
					else
					{
						centerX = centers[2];
						centerY = centers[3];
					}
					var left = Math.round(centerX - rx);
					var top = Math.round(centerY - ry);
					var right = Math.round(centerX + rx);
					var bottom = Math.round(centerY + ry);
					//wa == clockWise Arc
					//at == AnTiclockwise arc
					sPath += (clockwise ? "wa" : "at") + left + "," + top + "," + right + "," + bottom + "," + Math.round(prevEndX) + "," + Math.round(prevEndY) + "," + Math.round(x2) + "," + Math.round(y2);
*/
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
					sPath	+= "x";
					iCurrentX	= iStartX;
					iCurrentY	= iStartY;
					break;
			}
		}

		return sPath;
	};


	function getEllipseCenter(x1,y1,x2,y2,rx,ry)
	{
		var y1a = y1 * rx/ry; //y1' op aangepaste schaal waar ellipsen cirkels worden
		var y2a = y2 * rx/ry; //y2' op aangepaste schaal waar ellipsen cirkels worden
		var deltaX = x2-x1;
		var deltaY = y2a-y1a; //op aangepaste schaal
		var deltaXsqr = deltaX * deltaX;
		var deltaYsqr = deltaY * deltaY;
		var bigroot = Math.sqrt(Math.abs(rx*rx/(deltaXsqr + deltaYsqr) - 0.25));
		var c1 = 0.5 * (x1 + x2) + bigroot * (y1a - y2a);
		var d1a = 0.5 * (y1a + y2a) + bigroot * (x2 - x1);
		var c2 = 0.5 * (x1 + x2) - bigroot * (y1a - y2a);
		var d2a = 0.5 * (y1a + y2a) - bigroot * (x2 - x1);
		return [c1, d1a*ry/rx, c2, d2a*ry/rx];
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
};

// Register Element with language
oSVGNamespace.setElement("path", cSVGElement_path);
var cSVGElement_pattern	= function(){};
cSVGElement_pattern.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE
};

// Register Element with language
oSVGNamespace.setElement("pattern", cSVGElement_pattern);
var cSVGElement_polygon	= function(){};
cSVGElement_polygon.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
	cSVGElement_polygon.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "points":
						var aPoints = oEvent.newValue.split(/[ ,]/);
						oElement.path	= 'm ' + aPoints[0] + ',' + aPoints[1] + ' l ' + aPoints + ' xe';
						break;
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

			// Apply transformations
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	// presentation
	cSVGElement_polygon.prototype.$getTagOpen	= function() {
		var aPoints = this.getAttribute("points").split(/[ ,]/);
		return '<svg2vml:shape class="svg-polygon' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
						style="height:100%; width:100%;"\
						path="' + 'm ' + aPoints[0] + ',' + aPoints[1] + ' l ' + aPoints + ' xe' + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_polygon.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element with language
oSVGNamespace.setElement("polygon", cSVGElement_polygon);
var cSVGElement_polyline	= function(){};
cSVGElement_polyline.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
	cSVGElement_polyline.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "points":
						oElement.points	= oEvent.newValue;
						break;
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

			// Apply transformations
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	// presentation
	cSVGElement_polyline.prototype.$getTagOpen	= function() {
		return '<svg2vml:polyline class="svg-polyline' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
						points="' + this.getAttribute("points") + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_polyline.prototype.$getTagClose	= function() {
		return '</svg2vml:polyline>';
	};
};

// Register Element with language
oSVGNamespace.setElement("polyline", cSVGElement_polyline);
var cSVGElement_radialGradient	= function(){};
cSVGElement_radialGradient.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE
};

// Register Element with language
oSVGNamespace.setElement("radialGradient", cSVGElement_radialGradient);
var cSVGElement_rect	= function(){};
cSVGElement_rect.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// handlers
	cSVGElement_rect.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					//
					case "width":
					case "height":
						oElement.style[oEvent.attrName]	= oEvent.newValue + "px";
						break;
					//
					case "x":
					case "y":
						oElement.style[oEvent.attrName == "x" ? "left" : "top"]	= oEvent.newValue + "px";
						break;
					case "rx":
					case "ry":
						// TODO: Cannot be accessed at the runtime
						break;
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
						break;
					//
					default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			// Apply gradients
			if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

			// Apply transformations
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	// presentation
	cSVGElement_rect.prototype.$getTagOpen	= function() {
		var nRx	= this.getAttribute("rx"),
			nRy	= this.getAttribute("ry"),
			arcSize	= (nRx && nRy ? Math.min(nRx, nRy) : (nRx || nRy)) / Math.min(this.getAttribute("width"), this.getAttribute("height"));
		return '<svg2vml:roundrect class="svg-rect' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" \
					style="width:' + this.getAttribute("width") + 'px;height:' + this.getAttribute("height") + 'px;left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;"\
					arcSize="' + arcSize + '"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_rect.prototype.$getTagClose	= function() {
		return '</svg2vml:roundrect>';
	};
};

// Register Element with language
oSVGNamespace.setElement("rect", cSVGElement_rect);
var cSVGElement_script	= function(){};
cSVGElement_script.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// presentation
	cSVGElement_script.prototype.$getTagOpen	= function() {
		return '';
	};

	cSVGElement_script.prototype.$getTagClose	= function() {
		return '';
	};
};

// Register Element with language
oSVGNamespace.setElement("script", cSVGElement_script);
var cSVGElement_stop	= function(){};
cSVGElement_stop.prototype	= new cSVGElement;

// Register Element with language
oSVGNamespace.setElement("stop", cSVGElement_stop);
var cSVGElement_style	= function(){};
cSVGElement_style.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// presentation
	cSVGElement_style.prototype.$getTagOpen	= function() {
		return '<style type="text/css">';
	};

	cSVGElement_style.prototype.$getTagClose	= function() {
		return '</style>';
	};
};

// Register Element with language
oSVGNamespace.setElement("style", cSVGElement_style);
var cSVGElement_svg	= function(){};
cSVGElement_svg.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	cSVGElement_svg.attributes	= {
		"viewBox":	"0,0 600,600",
		"width":	"600px",
		"height":	"600px"
	};

	// handlers
	cSVGElement_svg.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "viewBox":
						var aViewBox= this.getAttribute("viewBox").split(/[\s,]/);
						oElement.coordOrigin	= aViewBox[0] + ',' + aViewBox[1];
						oElement.coordSize		= aViewBox[2] + ',' + aViewBox[3];
						break;
						//
					case "width":
					case "height":
						oElement.style[oEvent.attrName]	= oEvent.newValue + "px";
						break;
					//
					case "x":
					case "y":
						oElement.style[oEvent.attrName == "x" ? "left" : "top"]	= oEvent.newValue + "px";
						break;
				}
			}
		}
	};

	// presentation
	cSVGElement_svg.prototype.$getTagOpen	= function() {
		var aViewBox= this.getAttribute("viewBox").split(/[\s,]/),
			aWidth	= this.getAttribute("width").match(/([\d.]+)([%\w]*)/),
			aHeight	= this.getAttribute("height").match(/([\d.]+)([%\w]*)/),
			sWidthOuter	= aWidth[2] == "%" ? (aViewBox[2] * aWidth[1] / 100) + "px" : aWidth[1] + (aWidth[2] || "px"),
			sHeightOuter= aHeight[2] == "%" ? (aViewBox[3] * aHeight[1] / 100) + "px" : aHeight[1] + (aHeight[2] || "px");

		var nWidthInner	= aWidth[1],
			nHeightInner= aHeight[1],
			nRatio	= (aViewBox[2] / aViewBox[3]) / (aWidth[1] / aHeight[1]),
			nLeft	= 0,
			nTop	= 0;

		if (nRatio > 1) {
			nHeightInner= aHeight[1] / nRatio;
			nTop	= (aHeight[1] - nHeightInner) / 2;
		}
		else
		if (nRatio < 1) {
			nWidthInner	= aWidth[1] * nRatio;
			nLeft	= (aWidth[1] - nWidthInner) / 2;
		}

		return '<div class="svg-svg' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="position:relative;display:inline-block;overflow:hidden;width:' + sWidthOuter + ';height:' + sHeightOuter + ';">\
					<svg2vml:group style="position:absolute;margin-top:' + nTop + (aHeight[2] || "px") + ';margin-left:' + nLeft + (aWidth[2] || "px") + ';width:' + nWidthInner + (aWidth[2] || "px") + ';height:' + nHeightInner + (aHeight[2] || "px") + ';"\
						coordOrigin="' + aViewBox[0] + ',' + aViewBox[1] + '"\
						coordSize="' + aViewBox[2] + ',' + aViewBox[3] + '"\
					>';
	};

	cSVGElement_svg.prototype.$getTagClose	= function() {
		return 		'</svg2vml:group>\
				</div>';
	};
};

// Register Element with language
oSVGNamespace.setElement("svg", cSVGElement_svg);
var cSVGElement_text	= function(){};
cSVGElement_text.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE
	cSVGElement_text.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer("shape");
				switch (oEvent.attrName) {
					case "text-anchor":
						this.$getContainer("label").style["v-text-align"]	= cSVGElement_text.textAnchorToAlign(oEvent.newValue);
						break;

					case "font-size":
						cSVGElement_text.setFontSize(this, oEvent.newValue || "32px");
						break;

					case "font-family":
						oElement.style.fontFamily	= oEvent.newValue;
						break;

					case "font-weight":
						oElement.style.fontWeight	= oEvent.newValue;
						break;

					case "x":
						oElement.style.left	= oEvent.newValue + 'px';
						break;

					case "y":
						oElement.style.top	= oEvent.newValue + 'px';
						break;
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
						break;
					//
					default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			// Remove text elements from view
			for (var oElement = this.$getContainer(), i = 0; oElement.childNodes[i]; i++)
				if (oElement.childNodes[i].tagName != "shape")
					oElement.removeChild(oElement.childNodes[i--]);

			var oLabel	= this.$getContainer("label");
			if (this.firstChild instanceof AMLCharacterData)
				oLabel.string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '');

			var sValue;

			// Apply gradients
			if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

			// Apply transformations
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);

			// Apply font-size
			cSVGElement_text.setFontSize(this, cSVGElement.getStyle(this, "font-size") || "16px");
		},
		'DOMCharacterDataModified':	function(oEvent) {
			this.$getContainer("label").string	= oEvent.target.data.replace(/^\s+/, '').replace(/\s+$/, '');
		}
	};

	cSVGElement_text.setFontSize	= function(oElement, sFontSize) {
		var aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1];

		oElement.$getContainer("shape").style.marginTop	=-(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35) + "px";
		oElement.$getContainer("label").style.fontSize	= Math.round(nFontSizeValue * oElement.getAspectValue()) + sFontSizeUnit;
	};

	cSVGElement_text.textAnchorToAlign	= function(sTextAnchor) {
		return {"start": "left", "middle": "center", "end": "right"/*, "inherit": "left"*/}[sTextAnchor] || "left";
	};

	// presentation
	cSVGElement_text.prototype.$getTagOpen	= function() {
		var sFontFamily	= cSVGElement.getStyle(this, "font-family") || "Times New Roman",
			sFontWeight	= cSVGElement.getStyle(this, "font-weight"),
			sTextAnchor	= cSVGElement.getStyle(this, "text-anchor");

		return '<svg2vml:group class="svg-text' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="top:0;left:0;width:100%;height:100%;position:absolute;">\
					<svg2vml:shape class="svg-text--shape"\
						style="left:' + (this.getAttribute("x") || "0") + 'px; top:' + (this.getAttribute("y") || "0") + 'px; width:100%; height:100%;"\
						path="m 0,0 l 100,0 xe" allowoverlap="true"\
					>' + cSVGElement.getTagStyle(this) + '\
						<svg2vml:path textpathok="true" />\
						<svg2vml:textpath on="true" xscale="true" class="svg-text--label"\
							style="v-text-align:' + cSVGElement_text.textAnchorToAlign(sTextAnchor) + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + '" />\
					</svg2vml:shape>';
	};

	cSVGElement_text.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

// Register Element with language
oSVGNamespace.setElement("text", cSVGElement_text);
var cSVGElement_textPath	= function(){};
cSVGElement_textPath.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE
	// handlers
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
				// path
				var oTextPath = this.ownerDocument.getElementById(this.getAttribute("xlink:href").substr(1));
				if (oTextPath) {
					oText.$getContainer("shape").path	= cSVGElement_path.convert(oTextPath.getAttribute("d"));

					// Apply fill/stroke etc
					if (!oText.getAttribute("fill"))
						if (sValue = (this.getAttribute("fill") || oText.getAttribute("fill")))
							oText.setAttribute("fill", sValue);

					if (!oText.getAttribute("stroke"))
						if (sValue = (this.getAttribute("stroke") || oText.getAttribute("stroke")))
							oText.setAttribute("stroke", sValue);


				}
				// text
				if (this.firstChild instanceof AMLCharacterData)
					oText.$getContainer("label").string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '');
			}
		}
	};

	// presentation
	cSVGElement_textPath.prototype.$getTagOpen	= function() {
		return '<span class="svg-textPath' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="display:none">';
	};

	cSVGElement_textPath.prototype.$getTagClose	= function() {
		return '</span>';
	};
};

// Register Element with language
oSVGNamespace.setElement("textPath", cSVGElement_textPath);
var cSVGElement_title	= function(){};
cSVGElement_title.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// presentation
	cSVGElement_title.prototype.$getTagOpen	= function() {
		return '';
	};

	cSVGElement_title.prototype.$getTagClose	= function() {
		return '';
	};
};

// Register Element with language
oSVGNamespace.setElement("title", cSVGElement_title);
var cSVGElement_tspan	= function(){};
cSVGElement_tspan.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE
	cSVGElement_tspan.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					//
					case "x":
					case "y":
						oElement.style[oEvent.attrName == "x" ? "left" : "top"]	= oEvent.newValue + "px";
						break;
					//
					default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var oLabel	= this.$getContainer("label");
			if (this.firstChild instanceof AMLCharacterData)
				oLabel.string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '');

			var sValue;

			// Apply gradients
			if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);

			// Apply font-size
			cSVGElement_tspan.setFontSize(this, cSVGElement.getStyle(this, "font-size") || "16px");
		}
	};

	cSVGElement_tspan.setFontSize	= function(oElement, sFontSize) {
		var aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1];

		oElement.$getContainer().style.marginTop	=-(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35) + "px";
		oElement.$getContainer("label").style.fontSize	= Math.round(nFontSizeValue * oElement.getAspectValue()) + sFontSizeUnit;
	};

	// presentation
	cSVGElement_tspan.prototype.$getTagOpen	= function() {
		var sFontFamily	= cSVGElement.getStyle(this, "font-family") || "Times New Roman",
			sFontWeight	= cSVGElement.getStyle(this, "font-weight"),
			sTextAnchor	= cSVGElement.getStyle(this, "text-anchor");

		return '<svg2vml:shape class="svg-tspan' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="left:' + (this.getAttribute("x") || "0") + 'px; top:' + (this.getAttribute("y") || "0") + 'px; width:100%; height:100%;"\
					path="m 0,0 l 100,0 x" allowoverlap="true"\
				>' + cSVGElement.getTagStyle(this) + '\
					<svg2vml:path textpathok="true" />\
					<svg2vml:textpath on="true" xscale="true" class="svg-tspan--label"\
						style="v-text-align:' + cSVGElement_text.textAnchorToAlign(sTextAnchor) + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + '" />\
					<span style="display:none">';
	};

	cSVGElement_tspan.prototype.$getTagClose	= function() {
		return '	</span>\
				</svg2vml:shape>';
	};
};

// Register Element with language
oSVGNamespace.setElement("tspan", cSVGElement_tspan);
var cSVGElement_use	= function(){};
cSVGElement_use.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE
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

	// presentation
	cSVGElement_use.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-path' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="top:0;left:0;height:100%;width:100%;"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_use.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element with language
oSVGNamespace.setElement("use", cSVGElement_use);

})()