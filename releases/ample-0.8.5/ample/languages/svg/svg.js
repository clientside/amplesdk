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
	cSVGElement.prototype.getAttribute	= function(sName) {
		// 1) first check if attribute specified
		var sValue = AMLElement.prototype.getAttribute.call(this, sName);
		if (sValue == "" && sName != "style") {
			switch (sName) {
				case "opacity":
				case "fill":
				case "fill-opacity":
				case "stroke":
				case "stroke-width":
				case "stroke-opacity":
				case "stroke-linejoin":
/*
					// 2) second check CSS style value
					var oElement	= this.$getContainer(),
						sStyle;
					if (oElement && (sStyle = oElement.currentStyle[sName]))
						return sStyle;
*/
					// 2) second check if style specified
					var sStyle;
					if (sStyle = AMLElement.prototype.getAttribute.call(this, "style")) {
						var aStyles	= sStyle.split(/;/g);
						for (var nIndex = 0, nLength = aStyles.length; nIndex < nLength; nIndex++)
							if ((aStyle = aStyles[nIndex].match(/\s*([\w-]+)\s*:\s*(.+)\s*/i)) && aStyle[1] == sName)
								return aStyle[2];
					}

					// 3) third check if parent is group
					if (this.parentNode instanceof cSVGElement_g)
						return this.parentNode.getAttribute(sName);
			}
		}
		return sValue;
	};

	cSVGElement.prototype.setAttribute	= function(sName, sValue) {
		var oElement	= this.$getContainer();
		switch (sName) {
			case "style":
				// TODO: style attribute
				break;
			case "opacity":
				if (this.getAttribute("fill-opacity") == "")
					oElement.fill.opacity	= sValue;
				if (this.getAttribute("stroke-opacity") == "")
					oElement.stroke.opacity	= sValue;
				break;
			case "fill":
				oElement.fill.on	= sValue != "none";
				var aValue, oGradient;
				if (aValue = sValue.match(/url\(#(\w+)\)/)) {
					if (oGradient = this.ownerDocument.getElementById(aValue[1])) {
						if (oGradient instanceof cSVGElement_linearGradient || oGradient instanceof cSVGElement_radialGradient) {
							if (oGradient instanceof cSVGElement_linearGradient) {
								oElement.fill.type		= "gradient";
							}
							else {
								oElement.fill.type		= "gradientradial";
//								oElement.fill.focus		= "100%";
								oElement.fill.focusposition	= "0.5 0.5";
								oElement.fill.focussize		= "0 0";
							}

							var aStops	= oGradient.getStops(),
								iAngle	= oGradient.getAngle(),
								aColors	= [];
							for (var i = 0, oStop; i < aStops.length; i++) {
								oStop	= aStops[i];
								if (oStop[0] == "0%") {
									oElement.fill.color		= oStop[1];	// color
									oElement.fill.opacity	= oStop[2];	// opacity
								}
								else
								if (oStop[0] == "100%") {
									oElement.fill.color2	= oStop[1];
									oElement.fill.opacity2	= oStop[2];
								}
								else
									aColors.push(oStop[0] + " " + oStop[1]);
							}
							oElement.fill.colors.value	= aColors.join(", ");
							oElement.fill.method	= "sigma";
							oElement.fill.angle		= iAngle;
						}
						else
						if (oGradient instanceof cSVGElement_pattern) {
							// TODO: looks to be impossible to do
						}
					}
				}
				else
					oElement.fill.color	= sValue;
				break;
			case "fill-opacity":
				oElement.fill.opacity	= sValue;
				break;
			case "stroke":
				oElement.stroke.color	= sValue;
				break;
			case "stroke-width":
				oElement.stroke.weight	= sValue;
				break;
			case "stroke-opacity":
				oElement.stroke.opacity	= sValue;
				break;
			case "stroke-linejoin":
				oElement.stroke.joinStyle	= sValue;
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
			// transform
			case "transform":
				var aCommands	= sValue.match(/\w+\([^\)]+\s*\)/g);
				if (aCommands) {
					for (var i = 0; i < aCommands.length; i++) {
						var aCommand	= aCommands[i].match(/(\w+)\(([^\)]+)\)/),
							sCommand	= aCommand[1],
							aParameters	= aCommand[2].split(/[\s,]/);

						if (sCommand == "translate") {	// <tx> [<ty>]
							var iCoordX	= -Math.round(aParameters[0]),
								iCoordY	= aParameters.length > 1 ?-Math.round(aParameters[1]) : 0;

							oElement.style.marginLeft	= -iCoordX;
							oElement.style.marginTop	= -iCoordY;
						}
						else {
							if (sCommand == "matrix") {
								var iCoordX	= -aParameters[4],
									iCoordY	= -aParameters[5];

								oElement.style.marginLeft	=-iCoordX + "px";
								oElement.style.marginTop	=-iCoordY + "px";

								// if the matrix is tranlate-kind we will not go further (adding filter would break aliasing)
								if (aParameters[0] == 1 && aParameters[3] == 1 && aParameters[1] == 0 && aParameters[2] == 0)
									break;
							}

							switch (sCommand) {
								case "matrix":		// (<a> <b> <c> <d> <e> <f>)
									oElement.skew.on	= true;
									oElement.skew.matrix= aParameters[0] + "," + aParameters[1] + "," + aParameters[2] + "," + aParameters[3];
									break;

								case "scale":		// <sx> [<sy>]
									var iScaleX	= aParameters[0] * 1.0,
										iScaleY	= aParameters.length > 1 ? aParameters[1] * 1.0 : iScaleX;

									oElement.skew.on	= true;
									oElement.skew.matrix= iScaleX + ",0,0," + iScaleY;
									break;

								case "rotate":		// <rotate-angle> [<cx> <cy>]
									var iAngle	= aParameters[0] * Math.PI / 180,
										iCos	= Math.cos(iAngle).toFixed(3),
										iSin	= Math.sin(iAngle).toFixed(3);

									oElement.skew.on	= true;
									oElement.skew.matrix= iCos + "," + (-iSin) + "," + iSin + "," + iCos;

			//						oShadow.style.left	= Math.round((this.boundElement.getAttribute("x") || 0) - this.boundElement.getAttribute("height") * iSin);
									break;

								case "skewX":		// <skew-angle>
								case "skewY":		// <skew-angle>
									var iAngle	= aParameters[0] * Math.PI / 180,
										iTan	= Math.tan(iAngle);

									oElement.skew.on	= true;
									oElement.skew.matrix= "1," + (sCommand == "skewX" ? iTan : 0) + "," + (sCommand == "skewY" ? iTan : 0) + ",1";
									break;
							}
						}
					}
				}
				break;
		}
		AMLElement.prototype.setAttribute.call(this, sName, sValue);
	};

	cSVGElement.getFill			= function(oElement, sValue) {

	};

	cSVGElement.getTransform	= function(oElement) {
		return "1,0,0,1";
	};

	cSVGElement.getTagStyle	= function(oElement) {
		var sOpacity		= oElement.getAttribute("opacity"),
			sFill			= oElement.getAttribute("fill"),
			sFillOn			= sFill && sFill != "none" ? "true" : "false",
			sFillOpacity	= oElement.getAttribute("fill-opacity") || sOpacity,
			sStroke			= oElement.getAttribute("stroke"),
			sStrokeOn		= sStroke && sStroke != "none" ? "true" : "false",
			sStrokeOpacity	= oElement.getAttribute("stroke-opacity") || sOpacity,
			sStrokeWidth	= oElement.getAttribute("stroke-width"),
			sStrokeLineJoin	= oElement.getAttribute("stroke-linejoin"),
			sTransform		= cSVGElement.getTransform(oElement),
			sTransformOn	= sTransform ? "true" : "false";
		return '<svg2vml:fill on="' + sFillOn + '" color="' + (sFill || 'black') + '"\
					' + (sFillOpacity ? ' opacity="' + sFillOpacity + '"' : '') + '\
				/>\
				<svg2vml:stroke on="' + sStrokeOn + '" color="' + (sStroke || 'black') + '"\
					' + (sStrokeOpacity ? ' opacity="' + sStrokeOpacity + '"' : '') + '\
					' + (sStrokeWidth ? ' weight="' + sStrokeWidth + '"' : '') + '\
					' + (sStrokeLineJoin ? ' joinStyle="' + sStrokeLineJoin + '"' : '') + '\
				/>\
				<svg2vml:skew on="' + sTransformOn + '"\
					' + (sTransform ? ' matrix="' + sTransform + '"' : '') + '/>';
	};

	cSVGElement.parseUnit	= function(sValue) {
		var aValue	= sValue.match(/(^\d*(?:.\d+))\s*([a-z%]+)?$/);
		return aValue ? [aValue[1], aValue[2] || ''] : [0, ''];
	};
}
else {
		// handlers
	cSVGElement.prototype.setAttribute	= function(sName, sValue) {
		// Map attribute value
		this.$getContainer().setAttribute(sName, sValue);

		//
		AMLElement.prototype.setAttribute.call(this, sName, sValue);
	};

	// Default Element Render: open
	cSVGElement.prototype.$getTagOpen	= function()
	{
		var sHtml   = '<' + this.tagName;
		for (var sName in this.attributes)
			sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
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
		return '<a class="svg-a' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="width:' + this.getAttribute("width") + 'px;height:' + this.getAttribute("height") + 'px;left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;"\
					href="' + this.getAttribute("href") + '"\
				>';
	};

	cSVGElement_a.prototype.$getTagClose	= function() {
		return '</a>';
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
				}
			}
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
var cSVGElement_defs	= function(){};
cSVGElement_defs.prototype	= new cSVGElement;

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
				}
			}
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

	// handlers
	cSVGElement_g.prototype.setAttribute	= function(sName, sValue) {
		switch (sName) {
			case "transform":
				var oElement	= this.$getContainer();
				var aCommands	= sValue.match(/\w+\([^\)]+\s*\)/g),
					sFilterName	= "Matrix",	// progid:
					aFilters	= [];
				for (var i = 0; i < aCommands.length; i++) {
					var aCommand	= aCommands[i].match(/(\w+)\(([^\)]+)\)/),
						sCommand	= aCommand[1],
						aParameters	= aCommand[2].split(/[\s,]/);

					if (sCommand == "translate") {	// <tx> [<ty>]
						var iCoordX	= -Math.round(aParameters[0]),
							iCoordY	= aParameters.length > 1 ?-Math.round(aParameters[1]) : 0;

						oElement.coordOrigin	= iCoordX + "," + iCoordY;
					}
					else {
						if (sCommand == "matrix") {
							var iCoordX	= -aParameters[4],
								iCoordY	= -aParameters[5];

							oElement.coordOrigin	= iCoordX + "," + iCoordY;

							// if the matrix is tranlate-kind we will not go further (adding filter would break aliasing)
							if (aParameters[0] == 1 && aParameters[3] == 1 && aParameters[1] == 0 && aParameters[2] == 0)
								break;
						}

						switch (sCommand) {
							case "matrix":		// (<a> <b> <c> <d> <e> <f>)
								aFilters[aFilters.length]	= sFilterName + "(sizingMethod='auto expand',M11=" + aParameters[0] + ",M21=" + aParameters[1] + ",M12=" + aParameters[2] + ",M22=" + aParameters[3] + ")";
								break;

							case "scale":		// <sx> [<sy>]
								var iScaleX	= aParameters[0] * 1.0,
									iScaleY	= aParameters.length > 1 ? aParameters[1] * 1.0 : iScaleX;
								aFilters[aFilters.length]	= sFilterName + "(sizingMethod='auto expand',M11=" + iScaleX + ",M22=" + iScaleY + ")";
								break;

							case "rotate":		// <rotate-angle> [<cx> <cy>]
								oElement.style.rotation	= aParameters[0];
								break;

							case "skewX":		// <skew-angle>
							case "skewY":		// <skew-angle>
								var iAngle	= aParameters[0] * Math.PI / 180,
									iTan	= Math.tan(iAngle);
								aFilters[aFilters.length]	= sFilterName + "(sizingMethod='auto expand'," + (sCommand == "skewX" ? "M12" : "M21") + "=" + iTan + ")";
								break;
						}
					}
				}
				AMLElement.prototype.setAttribute.call(this, sName, sValue);
				// Apply filter if needed
				oElement.style.filter	= aFilters.join('');
				break;

			default:
				cSVGElement.prototype.setAttribute.call(this, sName, sValue);
		}
	};
	// Class Event Handlers
	cSVGElement_g.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue	= this.getAttribute("transform");
			if (sValue != "")
				this.setAttribute("transform", sValue);
		}
	};

	// presentation
	cSVGElement_g.prototype.$getTagOpen	= function() {
		// Keep left:0 and top:0
		return '<svg2vml:group class="svg-g' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="top:0;left:0;width:100%;height:100%;"\
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
					case "src":
						oElement.firstChild.src	= oEvent.newValue;
						break;
				}
			}
		}
	};

	// presentation
	cSVGElement_image.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-image' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="width:' + this.getAttribute("width") + 'px;height:' + this.getAttribute("height") + 'px;left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;"\
				>\
				<svg2vml:imagedata src="' + this.getAttribute("src")+ '"/>';
	};

	cSVGElement_image.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
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
				}
			}
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

	cSVGElement_linearGradient.prototype.getStops	= function() {
		var aStops	= [];
		for (var nIndex = 0; oElement = this.childNodes[nIndex]; nIndex++)
			aStops.push([oElement.getAttribute("offset"), oElement.getAttribute("stop-color"), oElement.getAttribute("stop-opacity") || "1"]);
		return aStops;
	};
	cSVGElement_linearGradient.prototype.getAngle	= function() {
		return 0;
	};
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
				}
			}
		}
	};

	cSVGElement_path.convert	= function(sValue) {
		var aCommands	= sValue.match(/[a-z][^a-z]*/ig),
			iStartX		= 0,
			iStartY		= 0,
			iCurrentX	= 0,
			iCurrentY	= 0,
			sPath		= "";

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
					sPath	+= "m" + aParameters + " ";
					break;

				case "m":
					iCurrentX	+= aParameters[0];
					iCurrentY	+= aParameters[1];
					iStartX		= iCurrentX;
					iStartY		= iCurrentY;
					sPath	+= "t" + aParameters + " ";
					break;

				// lineto (x y)+
				case "L":
					iCurrentX	= aParameters[aParameters.length - 2];
					iCurrentY	= aParameters[aParameters.length - 1];
					sPath	+= "l" + aParameters + " ";
					break;

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
					iCurrentX	= aParameters[4];
					iCurrentY	= aParameters[5];
					sPath	+= "c" + aParameters + " ";
					break;

				case "c":
					iCurrentX	+= aParameters[4];
					iCurrentY	+= aParameters[5];
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
				case "a":
				case "A":
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
/*
alert("<br /><div style='font-weight:bold; color:" + this.getSVGStyleValueInherited("stroke")+ "'>&gt; " + this.boundElement.getAttribute("d") + "</div>");
alert(["a, b:", a, b]);
alert(["x, y:", x, y]);
alert(["from (x, y, angle):", iFromX, iFromY, Math.round(180 * iAngleFrom / Math.PI)]);
alert(["to (x, y, angle):", iToX, iToY, Math.round(180 * iAngleTo / Math.PI)]);
alert(["center:", iCenterX, iCenterY]);
*/
//										sPath	+= "l" + iToX + " " + iToY + " ";
						sPath	+= /*(bSweep ? "wa" : */"at"/*)*/ + iLeft + "," + iTop + "," + iRight + "," + iBottom + "," + iFromX + "," + iFromY + "," + iToX + "," + iToY + " ";

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
				}
			}
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
				}
			}
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
	cSVGElement_radialGradient.prototype.getStops	= function() {
		var aStops	= [];
		for (var nIndex = 0; oElement = this.childNodes[nIndex]; nIndex++)
			aStops.push([oElement.getAttribute("offset"), oElement.getAttribute("stop-color"), oElement.getAttribute("stop-opacity") || "1"]);
		return aStops;
	};
	cSVGElement_radialGradient.prototype.getAngle	= function() {
		return 0;
	};
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
				var oElement	= this.$getContainer(),
					oStyle		= oElement.style;
				switch (oEvent.attrName) {
					case "rx":
					case "ry":
						// TODO: Cannot be accessed at the runtime
						break;
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			this.setAttribute("fill", this.getAttribute("fill"));
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
				}
			}
		}
	};

	// presentation
	cSVGElement_svg.prototype.$getTagOpen	= function() {
		var aViewBox= this.getAttribute("viewBox").split(/[\s,]/),
			sWidth	= this.getAttribute("width"),
			sHeight	= this.getAttribute("height");
		// Keep left:0 and top:0
		return '<div class="svg-svg' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="position:relative;display:inline-block;width:' + sWidth + ';height:' + sHeight + ';">\
					<svg2vml:group style="position:absolute;top:0;left:0;width:' + sWidth + ';height:' + sHeight + ';"\
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

	// presentation
	cSVGElement_text.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-text' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="width:' + this.getAttribute("width") + 'px;height:' + this.getAttribute("height") + 'px;left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;"\
				>' + cSVGElement.getTagStyle(this) + '\
					<svg2vml:textBox>';
	};

	cSVGElement_text.prototype.$getTagClose	= function() {
		return '	</svg2vml:textBox>\
				</svg2vml:shape>';
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
		}
	};

	// presentation
	cSVGElement_textPath.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-textPath' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="width:' + this.getAttribute("width") + 'px;height:' + this.getAttribute("height") + 'px;left:' + this.getAttribute("x") + 'px;top:' + this.getAttribute("y") + 'px;"\
				>' + cSVGElement.getTagStyle(this) + '\
					<svg2vml:textPath xlink:href="' + this.getAttribute("xlink:href") + '">';
	};

	cSVGElement_textPath.prototype.$getTagClose	= function() {
		return '	<svg2vml:textPath>\
				</svg2vml:shape>';
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

	// presentation
	cSVGElement_tspan.prototype.$getTagOpen	= function() {
		return '<span class="svg-tspan' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '">';
	};

	cSVGElement_tspan.prototype.$getTagClose	= function() {
		return '</span>';
	};
};

// Register Element with language
oSVGNamespace.setElement("tspan", cSVGElement_tspan);
var cSVGElement_use	= function(){};
cSVGElement_use.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	// presentation
	cSVGElement_use.prototype.$getTagOpen	= function() {
		return '';
	};

	cSVGElement_use.prototype.$getTagClose	= function() {
		return '';
	};
};

// Register Element with language
oSVGNamespace.setElement("use", cSVGElement_use);

})()