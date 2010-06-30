/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

(function () {


var oChartNamespace	= new AMLNamespace;

ample.domConfig.setNamespace("http://www.amplesdk.com/ns/chart", oChartNamespace);



var cChartElement	= function(){};
cChartElement.prototype	= new AMLElement;

cChartElement.useVML	= !document.implementation || !document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");

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

						if (!cChartElement.hQuadratic[sCommand])
				aQuadratic	= null;
			else
			if (!cChartElement.hCubic[sCommand])
				aCubic		= null;
		}

		return aPath.join('') + "e";
	};

	cChartElement.applyCSS	= function(oElementDOM) {
		var sValue,
			sOpacity	= cChartElement.getCSSProperty(oElementDOM, "opacity") || "1";
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
						case "opacity":
					cChartElement.setStyle(oElementDOM, "fill-" + sName, sValue);
					cChartElement.setStyle(oElementDOM, "stroke-" + sName, sValue);
				break;
						case "fill":
				var aValue, oGradient;
				if (aValue = sValue.match(/url\(#([\w-]+)\)/)) {
				}
				else
					oElementDOM.fill.color	= sValue in oChartElement_colors ? 'rgb(' + oChartElement_colors[sValue] + ')' : sValue;
				break;
			case "fill-opacity":
				if (oElementDOM.fill.opacity != sValue)
					oElementDOM.fill.opacity	= sValue;
				break;
						case "stroke":
				oElementDOM.stroke.color	= sValue in oChartElement_colors ? 'rgb(' + oChartElement_colors[sValue] + ')' : sValue;
				break;
			case "stroke-width":
				var aStroke	= sValue.match(/([\d.]+)(.*)/),
					nStrokeWidth	= aStroke[1] * 1,
					sStrokeUnit		= aStroke[2] || 'px';
				oElementDOM.stroke.weight	= nStrokeWidth + sStrokeUnit;
				break;
			case "stroke-opacity":
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
						case "marker-start":
				oElementDOM.stroke.startarrow	= sValue == "none" ? "none" : "classic";
				break;
			case "marker-end":
				oElementDOM.stroke.endarrow	= sValue == "none" ? "none" : "classic";
				break;
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
		return {"middle": "center", "end": "right"}[sTextAnchor] || "left";
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

oChartNamespace.setElement("#element", cChartElement);


var cChartElement_bar	= function(){};
cChartElement_bar.prototype	= new cChartElement;

cChartElement_bar.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		this.refresh();
	}
};

cChartElement_bar.prototype.refresh	= function() {
	var bColumn	= this.getAttribute("orient") == "horizontal";

		var aData	= [],
		nGroupMax	=-Infinity,
		nGroupMin	= Infinity,
		aSumAll	= [],
		nSumMax	=-Infinity,
		nSumMin	= Infinity;
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup, aGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
		aGroup	= [];
		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem, nValue; oItem = oGroup.childNodes[nItem]; nItem++) {
			nValue	= oItem.getAttribute("value") * 1;
			if (nValue > nGroupMax)
				nGroupMax	= nValue;
			if (nValue < nGroupMin)
				nGroupMin	= nValue;
			aGroup.push(nValue);
						if (aSumAll.length < nItem + 1)
				aSumAll[nItem]	= 0;
			aSumAll[nItem]	+= nValue;
						if (aSumAll[nItem] > nSumMax)
				nSumMax	= aSumAll[nItem];
			if (aSumAll[nItem] < nSumMin)
				nSumMin	= aSumAll[nItem];
		}
		aData.push(aGroup);
	}

	if (bColumn) {
				var d	= [];
		for (var nIndex = 0, nLength = 10; nIndex < nLength; nIndex++)
			d.push("M" + (50 + 10 + 400 * nIndex / nLength) + ",50 V250 z ");
		cChartElement.setPath(this.$getContainer("grid"), d.join(''));

				var oParent	= this.$getContainer("xAxisItems"),
			oElement,
			d	= [];
		for (var x = 0, l = oParent.childNodes.length; x < l; x++)
			oParent.removeChild(oParent.childNodes[x]);
		for (var nIndex = 0, nLength = 10; nIndex < nLength + 1; nIndex++) {

			d.push("M" +(50 + 400 * nIndex / nLength)+ "," + 250 + "v5 z");
		}
		cChartElement.setPath(this.$getContainer("xAxisMarks"), d.join(' '));

				var oParent	= this.$getContainer("yAxisItems"),
			aAxisValueLabels	= this.getAttribute("xAxisValueLabels").split(","),
			oElement,
			d	= [];
		for (var x = 0, l = oParent.childNodes.length; x < l; x++)
			oParent.removeChild(oParent.childNodes[x]);
		for (var nIndex = 0, nLength = aData[0].length; nIndex < nLength + 1; nIndex++) {
			if (nIndex != nLength) {

			}
			d.push("M" + 50 + "," + (250 - 200 * nIndex / nLength)+ "h-5 z");
		}
		cChartElement.setPath(this.$getContainer("yAxisMarks"), d.join(' '));
	}
	else {
				var d	= [];
		for (var nIndex = 0, nLength = 5; nIndex < nLength; nIndex++)
			d.push("M50," + (250 - 10 - 200 * nIndex / nLength) + "H450 z ");
		cChartElement.setPath(this.$getContainer("grid"), d.join(''));

				var oParent	= this.$getContainer("xAxisItems"),
			aAxisValueLabels	= this.getAttribute("xAxisValueLabels").split(","),
			oElement,
			d	= [];
		for (var x = 0, l = oParent.childNodes.length; x < l; x++)
			oParent.removeChild(oParent.childNodes[x]);
		for (var nIndex = 0, nLength = aData[0].length; nIndex < nLength + 1; nIndex++) {
			if (nIndex != nLength) {

			}
			d.push("M" +(50 + 400 * nIndex / nLength)+ "," + 250 + "v5 z");
		}
		cChartElement.setPath(this.$getContainer("xAxisMarks"), d.join(' '));

				var oParent	= this.$getContainer("yAxisItems"),
			oElement,
			d	= [];
		for (var x = 0, l = oParent.childNodes.length; x < l; x++)
			oParent.removeChild(oParent.childNodes[x]);
		for (var nIndex = 0, nLength = 10; nIndex < nLength + 1; nIndex++) {

			d.push("M" + 50 + "," + (250 - 200 * nIndex / nLength)+ "h-5 z");
		}
		cChartElement.setPath(this.$getContainer("yAxisMarks"), d.join(' '));
	}

		var nOffsetItem		= 2,
		nOffsetGroup	= 4;

		var aSumUp	= [];
	for (var nGroup = 0, nGroups = aData.length, oGroup; nGroup < nGroups; nGroup++) {
				oGroup = this.childNodes[nGroup];

				var d,
			nValue,
			nWeightGroup, nWeightItem;

		for (var nItem = 0, nItems = aData[nGroup].length, oItem; nItem < nItems; nItem++) {
						oItem = oGroup.childNodes[nItem];

						if (aSumUp.length < nItem + 1)
				aSumUp[nItem]	= 0;

						if (bColumn) {
				if (this.getAttribute("type") == "stack") {
					nWeightGroup	= 200 / nItems - nOffsetGroup;
					nWeightItem		= nWeightGroup - nOffsetItem;
					nValue	= 400 * aData[nGroup][nItem] / nSumMax;
															d	=	"M" + (50 + 400 * aSumUp[nItem] / nSumMax) + "," + (250 - (nWeightGroup + nOffsetGroup) * nItem - (nOffsetItem + nOffsetGroup) / 2) +
							"h" + nValue + " " +
							"v-" + nWeightItem + " " +
							"h-" + nValue + " " +
							"v" + nWeightItem + " z";
				}
				else
				if (this.getAttribute("type") == "percentage") {
					nWeightGroup	= 200 / nItems - nOffsetGroup;
					nWeightItem		= nWeightGroup - nOffsetItem;
					nValue	= 400 * aData[nGroup][nItem] / aSumAll[nItem];
															d	=	"M" + (50 + 400 * aSumUp[nItem] / aSumAll[nItem]) + "," + (250 - (nWeightGroup + nOffsetGroup) * nItem - (nOffsetItem + nOffsetGroup) / 2) +
							"h" + nValue + " " +
							"v-" + nWeightItem + " " +
							"h-" + nValue + " " +
							"v" + nWeightItem + " z";
				}
				else {
					nWeightGroup	= 200 / nItems - nOffsetGroup;
					nWeightItem		= nWeightGroup / nGroups - nOffsetItem;
					nValue	= 400 * aData[nGroup][nItem] / nGroupMax;
										d	=	"M50," + (250 - (nWeightGroup + nOffsetGroup) * nItem - (nOffsetItem + nOffsetGroup) / 2 - (nWeightItem + nOffsetItem) * nGroup) + " " +
							"h" + nValue + " " +
							"v-" + nWeightItem + " " +
							"h-" + nValue + " " +
							"v" + nWeightItem + " z";
									}
			}
						else {
				if (this.getAttribute("type") == "stack") {
					nWeightGroup	= 400 / nItems - nOffsetGroup;
					nWeightItem		= nWeightGroup - nOffsetItem;
					nValue	= 200 * aData[nGroup][nItem] / nSumMax;
										d	=	"M" + (50 + (nWeightGroup + nOffsetGroup) * nItem + (nOffsetItem + nOffsetGroup) / 2) + "," + (250 - 200 * aSumUp[nItem] / nSumMax) +
							"v-" + nValue + " " +
							"h" +  nWeightItem + " " +
							"v" + nValue + " " +
							"h-" + nWeightItem + " z";
				}
				else
				if (this.getAttribute("type") == "percentage") {
					nWeightGroup	= 400 / nItems - nOffsetGroup;
					nWeightItem		= nWeightGroup - nOffsetItem;
					nValue	= 200 * aData[nGroup][nItem] / aSumAll[nItem];
										d	=	"M" + (50 + (nWeightGroup + nOffsetGroup) * nItem + (nOffsetItem + nOffsetGroup) / 2) + "," + (250 - 200 * aSumUp[nItem] / aSumAll[nItem]) +
							"v-" + nValue + " " +
							"h" +  nWeightItem + " " +
							"v" + nValue + " " +
							"h-" + nWeightItem + " z";
				}
				else {
					nWeightGroup	= 400 / nItems - nOffsetGroup;
					nWeightItem		= nWeightGroup / nGroups - nOffsetItem;
					nValue	= 200 * aData[nGroup][nItem] / nGroupMax;
										d	=	"M" + (50 + (nWeightGroup + nOffsetGroup) * nItem + (nOffsetItem + nOffsetGroup) / 2 + (nWeightItem + nOffsetItem) * nGroup) + ",250 " +
							"v-" + nValue + " " +
							"h" + nWeightItem + " " +
							"v" + nValue + " " +
							"h-" + nWeightItem + " z";
									}
			}

			cChartElement.setPath(oItem.$getContainer("path"), d);
			cChartElement.setPath(oItem.$getContainer("shadow"), d);

						aSumUp[nItem]	+= aData[nGroup][nItem];
		}

				var nXPath	= 480,
			nYPath	=(50 + (nGroups - nGroup) * 20);
		cChartElement.setPath(oGroup.$getContainer("path"), "M" + (nXPath - 5) + "," + (nYPath - 5) + "h10 v10 h-10 v-10 z");
		cChartElement.setTextPosition(oGroup.$getContainer("label"),
										nXPath + 20,
										nYPath + 5);
	}
};

if (!cChartElement.useVML) {
	cChartElement_bar.prototype.$getTagOpen	= function() {
		return '<div class="c-bar' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
					<svg:svg class="c-bar--canvas" viewBox="0 0 600 300" width="600px" height="300px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
						<svg:text class="c-bar--title" y="30" x="300">' + this.getAttribute("title")+ '</svg:text>\
						<svg:rect x="460" y="50" width="120" height="120" rx="10" class="c-legend"/>\
						<svg:path class="c-grid c-bar--grid"/>\
						<svg:g class="c-xAxis">\
							<svg:path class="c-bar--xAxis" d="m50,250 h400,0" style="fill:none"/>\
							<svg:path id="x' + this.uniqueID + '" d="m300,280 h400,0" style="fill:none;stroke:none"/>\
							<svg:text class="c-xAxis--label c-bar--xAxisLabel"><svg:textPath xlink:href="#x' + this.uniqueID + '">' + this.getAttribute("xAxisLabel")+ '</svg:textPath></svg:text>\
							<svg:path class="c-xAxis--marks c-bar--xAxisMarks" xtransform="translate(0,2)"/>\
							<svg:g class="c-xAxis--scale c-bar--xAxisItems" style="stroke:none" transform="translate(-3,0)"/>\
						</svg:g>\
						<svg:g class="c-yAxis">\
							<svg:path class="c-bar--yAxis" d="m50,250 v0,-200" style="fill:none"/>\
							<svg:path id="y' + this.uniqueID + '" d="m20,200 v0,-200" style="fill:none;stroke:none"/>\
							<svg:text class="c-yAxis--label c-bar--yAxisLabel"><svg:textPath xlink:href="#y' + this.uniqueID + '">' + this.getAttribute("yAxisLabel")+ '</svg:textPath></svg:text>\
							<svg:path class="c-yAxis--marks c-bar--yAxisMarks" xtransform="translate(-2,0)" />\
							<svg:g class="c-yAxis--scale c-bar--yAxisItems" style="stroke:none" transform="translate(0,3)"/>\
						</svg:g>\
						<svg:g class="c-bar--gateway">';
	};

	cChartElement_bar.prototype.$getTagClose	= function() {
		return '		</svg:g>\
					</svg:svg>\
				</div>';
	};
}
else {
		(function() {
		var fHandler	= cChartElement_bar.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_bar.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			fHandler.call(this, oEvent);
						cChartElement_bar.recalcCSS(this);
						var that	= this;
			setTimeout(function() {
				var oCanvas	= that.$getContainer("canvas");
				if (oCanvas)
					oCanvas.style.display	= "";
			});
		};
	})();

	cChartElement_bar.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("title"));
		cChartElement.applyCSS(oElement.$getContainer("legend"));
		cChartElement.applyCSS(oElement.$getContainer("grid"));
		cChartElement.applyCSS(oElement.$getContainer("xAxis"));
		cChartElement.applyCSS(oElement.$getContainer("xAxisLabel"));
		cChartElement.applyCSS(oElement.$getContainer("xAxisMarks"));
		cChartElement.applyCSS(oElement.$getContainer("yAxis"));
		cChartElement.applyCSS(oElement.$getContainer("yAxisLabel"));
		cChartElement.applyCSS(oElement.$getContainer("yAxisMarks"));
	};

	cChartElement_bar.prototype.$getTagOpen	= function() {
		return '<div class="c-bar' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;width:600px;height:300px;' + this.getAttribute("style") + '">\
					<chart2vml:group class="c-bar--canvas" style="position:absolute;width:600px;height:300px;display:none;" coordOrigin="0 0" coordSize="600 300">\
						<chart2vml:shape class="c-bar--title" path="m0,0 l600,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + this.getAttribute("title")+ '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:roundrect style="left:460px;top:50px;width:120px;height:120px" rx="10" class="c-legend c-bar--legend" filled="true"/>\
						<chart2vml:shape class="c-grid c-bar--grid" style="position:absolute;width:100%;height:100%"/>\
						<chart2vml:group class="c-xAxis" style="position:absolute;width:100%;height:100%">\
							<chart2vml:shape class="c-bar--xAxis" path="m50,250 r400,0 e" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:shape class="c-xAxis--label c-bar--xAxisLabel" path="m50,280 r400,0 e" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
								<chart2vml:path textpathok="true" />\
								<chart2vml:textpath on="true" string="' + this.getAttribute("xAxisLabel")+ '" style="v-text-align:right"/>\
							</chart2vml:shape>\
							<chart2vml:shape class="c-xAxis--marks c-bar--xAxisMarks" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:group class="c-xAxis--scale c-bar--xAxisItems" style="top:3px"/>\
						</chart2vml:group>\
						<chart2vml:group class="c-yAxis" style="position:absolute;width:100%;height:100%">\
							<chart2vml:shape class="c-bar--yAxis" path="m50,250 r0,-200 e" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:shape class="c-yAxis--label c-bar--yAxisLabel" path="m20,250 r0,-200 e" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
								<chart2vml:path textpathok="true" />\
								<chart2vml:textpath on="true" string="' + this.getAttribute("yAxisLabel")+ '" style="v-text-align:right"/>\
							</chart2vml:shape>\
							<chart2vml:shape class="c-yAxis--marks c-bar--yAxisMarks" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:group class="c-yAxis--scale c-bar--yAxisItems" style="top:3px"/>\
						</chart2vml:group>\
						<chart2vml:group class="c-bar--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_bar.prototype.$getTagClose	= function() {
		return '		</chart2vml:group>\
					</chart2vml:group>\
				</div>';
	};
}

oChartNamespace.setElement("bar", cChartElement_bar);


var cChartElement_bubble	= function(){};
cChartElement_bubble.prototype	= new cChartElement;

cChartElement_bubble.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		this.refresh();
	}
};

cChartElement_bubble.prototype.refresh	= function() {
		var aData	= [],
		nXMax	=-Infinity,
		nXMin	= Infinity,
		nYMax	=-Infinity,
		nYMin	= Infinity,
		nZMax	=-Infinity,
		nZMin	= Infinity;
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup, aGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
		aGroup	= [];
		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem, aValue, nX, nY; oItem = oGroup.childNodes[nItem]; nItem++) {
			aValue	= oItem.getAttribute("value").split(',');
			nX	= aValue[0] * 1;
			nY	= aValue[1] * 1;
			nZ	= aValue[2] * 1;
			if (nX > nXMax)
				nXMax	= nX;
			if (nX < nXMin)
				nXMin	= nX;
			if (nY > nYMax)
				nYMax	= nY;
			if (nY < nYMin)
				nYMin	= nY;
			if (nZ > nZMax)
				nZMax	= nZ;
			if (nZ < nZMin)
				nZMin	= nZ;
			aGroup.push([nX, nY, nZ]);
		}
		aData.push(aGroup);
	}

		for (var nGroup = 0, nGroups = aData.length, oGroup; nGroup < nGroups; nGroup++) {
				oGroup = this.childNodes[nGroup];

				var nX, nY, nSize,
			d;
		for (var nItem = 0, nItems = aData[nGroup].length; nItem < nItems; nItem++) {
			nX	= 50 + 400 * (nXMax - aData[nGroup][nItem][0]) / (nXMax - nXMin);
			nY	= 250 - 200 * (nYMax - aData[nGroup][nItem][1]) / (nYMax - nYMin);
			nSize	= 10 + 20 * aData[nGroup][nItem][2] / (nZMax - nZMin);
			d	= "M" + (nX - nSize) + "," + nY +
					"a" + nSize + "," + nSize + " 0 0,0 " + nSize * 2 + ",0 " +
					"a" + nSize + "," + nSize + " 0 0,0-" + nSize * 2 + ",0 " +
					"z";

			cChartElement.setPath(oGroup.childNodes[nItem].$getContainer("path"), d);
			cChartElement.setPath(oGroup.childNodes[nItem].$getContainer("shadow"), d);
		}

				var nXPath	= 480,
			nYPath	=(50 + (nGroups - nGroup) * 20);
		cChartElement.setPath(oGroup.$getContainer("path"), "M" + (nXPath - 5) + "," + (nYPath - 5) + "h10 v10 h-10 v-10 z");
		cChartElement.setTextPosition(oGroup.$getContainer("label"),
										nXPath + 20, nYPath + 5);
	}
};

if (!cChartElement.useVML) {
	cChartElement_bubble.prototype.$getTagOpen	= function() {
		return '<div class="c-bubble' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
					<svg:svg class="c-bubble--canvas" viewBox="0 0 600 300" width="600px" height="300px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
						<svg:text class="c-bubble--title" y="30" x="300">' + this.getAttribute("title")+ '</svg:text>\
						<svg:rect x="460" y="50" width="120" height="120" rx="10" class="c-legend"/>\
						<svg:path class="c-grid c-bubble--grid"/>\
						<svg:g class="c-xAxis">\
							<svg:path class="c-bubble--xAxis" d="M50,250 h400" style="fill:none"/>\
							<svg:path id="x' + this.uniqueID + '" d="M300,280 h400" style="fill:none;stroke:none"/>\
							<svg:text class="c-xAxis--label c-bubble--xAxisLabel"><svg:textPath xlink:href="#x' + this.uniqueID + '">' + this.getAttribute("yAxisLabel")+ '</svg:textPath></svg:text>\
						</svg:g>\
						<svg:g class="c-yAxis">\
							<svg:path class="c-bubble--yAxis" d="M50,250 v-200" style="fill:none"/>\
							<svg:path id="y' + this.uniqueID + '" d="M30,200 v-200" style="fill:none;stroke:none"/>\
							<svg:text class="c-yAxis--label c-bubble--yAxisLabel"><svg:textPath xlink:href="#y' + this.uniqueID + '">' + this.getAttribute("yAxisLabel")+ '</svg:textPath></svg:text>\
						</svg:g>\
						<svg:g class="c-bubble--gateway">';
	};

	cChartElement_bubble.prototype.$getTagClose	= function() {
		return '		</svg:g>\
					</svg:svg>\
				</div>';
	};
}
else {
		(function() {
		var fHandler	= cChartElement_bubble.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_bubble.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			fHandler.call(this, oEvent);
						cChartElement_bubble.recalcCSS(this);
						var that	= this;
			setTimeout(function() {
				var oCanvas	= that.$getContainer("canvas");
				if (oCanvas)
					oCanvas.style.display	= "";
			});
		};
	})();

	cChartElement_bubble.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("title"));
		cChartElement.applyCSS(oElement.$getContainer("legend"));
		cChartElement.applyCSS(oElement.$getContainer("grid"));
		cChartElement.applyCSS(oElement.$getContainer("xAxis"));
		cChartElement.applyCSS(oElement.$getContainer("xAxisLabel"));
		cChartElement.applyCSS(oElement.$getContainer("xAxisMarks"));
		cChartElement.applyCSS(oElement.$getContainer("yAxis"));
		cChartElement.applyCSS(oElement.$getContainer("yAxisLabel"));
		cChartElement.applyCSS(oElement.$getContainer("yAxisMarks"));
	};

	cChartElement_bubble.prototype.$getTagOpen	= function() {
		return '<div class="c-bubble' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;width:600px;height:300px;' + this.getAttribute("style") + '">\
					<chart2vml:group class="c-bubble--canvas" style="position:absolute;width:600px;height:300px;display:none;" coordOrigin="0 0" coordSize="600 300">\
						<chart2vml:shape class="c-bubble--title" path="m0,0 l600,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + this.getAttribute("title")+ '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:roundrect style="left:460px;top:50px;width:120px;height:120px" rx="10" class="c-legend c-bubble--legend" filled="true"/>\
						<chart2vml:shape class="c-grid c-bubble--grid" style="position:absolute;width:100%;height:100%"/>\
						<chart2vml:group class="c-xAxis" style="position:absolute;width:100%;height:100%">\
							<chart2vml:shape class="c-bubble--xAxis" path="m50,250 r400,0 e" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:shape class="c-xAxis--label c-bubble--xAxisLabel" path="m50,280 r400,0 e" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
								<chart2vml:path textpathok="true" />\
								<chart2vml:textpath on="true" string="' + this.getAttribute("xAxisLabel")+ '" style="v-text-align:right"/>\
							</chart2vml:shape>\
							<chart2vml:shape class="c-xAxis--marks c-bubble--xAxisMarks" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:group class="c-xAxis--scale c-bubble--xAxisItems" style="top:3px"/>\
						</chart2vml:group>\
						<chart2vml:group class="c-yAxis" style="position:absolute;width:100%;height:100%">\
							<chart2vml:shape class="c-bubble--yAxis" path="m50,250 r0,-200 e" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:shape class="c-yAxis--label c-bubble--yAxisLabel" path="m20,250 r0,-200 e" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
								<chart2vml:path textpathok="true" />\
								<chart2vml:textpath on="true" string="' + this.getAttribute("yAxisLabel")+ '" style="v-text-align:right"/>\
							</chart2vml:shape>\
							<chart2vml:shape class="c-yAxis--marks c-bubble--yAxisMarks" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:group class="c-yAxis--scale c-bubble--yAxisItems" style="top:3px"/>\
						</chart2vml:group>\
						<chart2vml:group class="c-bubble--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_bubble.prototype.$getTagClose	= function() {
		return '		</chart2vml:group>\
					</chart2vml:group>\
				</div>';
	};
}

oChartNamespace.setElement("bubble", cChartElement_bubble);


var cChartElement_chart	= function(){};
cChartElement_chart.prototype	= new cChartElement;
cChartElement_chart.prototype.from	= 0;
cChartElement_chart.prototype.to	= 1;

cChartElement_chart.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		this.refresh();
	},
	'mousewheel':	function(oEvent) {
		var nOffset	= oEvent.wheelDelta / 300;
		if (this.from - nOffset >= 0)
			this.from	-= nOffset;
		else
			this.from	= 0;
		if (this.to + nOffset <= 1)
			this.to		+= nOffset;
		else
			this.to	= 1;
				this.zoom();
				oEvent.preventDefault();
	},
	'keydown':	function(oEvent) {
		var sKeyIdentifier	= oEvent.keyIdentifier;
		if (sKeyIdentifier == "Left" || sKeyIdentifier == "Right") {
			var nOffset	=(sKeyIdentifier == "Left" ? -1 : 1) * (this.to - this.from) / 100;
			if (this.from + nOffset >= 0)
				this.from	+= nOffset;
			else
				this.from	= 0;
			if (this.to + nOffset <= 1)
				this.to		+= nOffset;
			else
				this.to	= 1;
						this.zoom();
						oEvent.preventDefault();
		}
	}
};

cChartElement_chart.prototype.zoom	= function() {
		var d	= [];
	for (var x = 1; x < 10; x++)
		d.push("M" + (50 + x * 100 * (1 - (this.to - this.from))) + ",50 v200 z ");
	for (var y = 1; y < 10; y++)
		d.push("M50," + (250 - y * 100 * (1 - (this.to - this.from))) + "h400 z ");
	this.$getContainer("grid").setAttribute("d", d.join(''));
	this.$getContainer("throbber").style.width	= (this.to - this.from) * 500 + "px";
	this.$getContainer("throbber").style.left	= (this.from * 500) + "px";

		var aValue	= this.getAttribute("data").split(";"),
		aData	= [];
	for (var nItem = 0; nItem < aValue.length; nItem++)
		aData.push(aValue[nItem].split(","));

	var d	= [];
	for (var nItem = 0, nFrom = Math.floor(this.from * aData.length), nTo = Math.floor(this.to * aData.length); nItem < nTo - nFrom + 1; nItem++)
		d.push("L" + (50 + 500 * nItem / (nTo - nFrom)) + "," + 3 * (100 - (aData[nFrom + nItem] ? aData[nFrom + nItem][1] : 0)));
	this.$getContainer("view").setAttribute("d", "M50,300" + d.join("") + " L550,300" + "z");
	this.$getContainer("fragment").setAttribute("d", "M" + (50 + this.from * 500) + ",0 h" + ((this.to - this.from) * 500) + " v100 h-" + ((this.to - this.from) * 500) + " z");
};

cChartElement_chart.prototype.refresh	= function() {
	var aValue	= this.getAttribute("data").split(";"),
		aData	= [];
	for (var nItem = 0; nItem < aValue.length; nItem++)
		aData.push(aValue[nItem].split(","));

		var d	= [];
	for (var nItem = 0, nLength = aData.length; nItem < 500; nItem++)
		d.push("L" + (50 + nItem) + "," + (100 - aData[Math.floor(nLength * nItem / 500)][1]));

	this.$getContainer("preview").setAttribute("d", "M50,100" + d.join("") + " L550,100" + "z");

	};

cChartElement_chart.prototype._mouseX	= 0;
cChartElement_chart.prototype._throbberLeft	= 0;
cChartElement_chart.prototype._throbberWidth= 0;

cChartElement_chart.prototype._onThrobberDown	= function(oEvent) {
	this._mouseX	= oEvent.clientX;
	this._throbberLeft	= parseInt(this.$getContainer("throbber").style.left);
	this._throbberWidth	= parseInt(this.$getContainer("throbber").style.width);

	this.setCapture(true);
	this.addEventListener("mousemove", cChartElement_chart.prototype._onThrobberMove);
	this.addEventListener("mouseup", function(oEvent) {
		this.releaseCapture();
		this.removeEventListener(oEvent.type, arguments.callee);
		this.removeEventListener("mousemove", cChartElement_chart.prototype._onThrobberMove);
	});
};

cChartElement_chart.prototype._onThrobberMove	= function(oEvent) {
	var oThrobber	= this.$getContainer("throbber"),
		nLeft		= this._throbberLeft + oEvent.clientX - this._mouseX;
	if (nLeft < 0)
		nLeft	= 0;
	else
	if (nLeft > 500 - this._throbberWidth)
		nLeft	= 500 - this._throbberWidth;

		this.from	= nLeft / 500;
	this.to		=(this._throbberWidth + nLeft) / 500;
	this.zoom();
};

cChartElement_chart.prototype._onLeftGrippyDown	= function(oEvent) {
	this._mouseX	= oEvent.clientX;
	this._throbberLeft	= parseInt(this.$getContainer("throbber").style.left);
	this._throbberWidth	= parseInt(this.$getContainer("throbber").style.width);

	this.setCapture(true);
	this.addEventListener("mousemove", cChartElement_chart.prototype._onLeftGrippyMove);
	this.addEventListener("mouseup", function(oEvent) {
		this.releaseCapture();
		this.removeEventListener(oEvent.type, arguments.callee);
		this.removeEventListener("mousemove", cChartElement_chart.prototype._onLeftGrippyMove);
	});

		if (oEvent.stopPropagation)
		oEvent.stopPropagation();
	else
		oEvent.cancelBubble	= true;
};

cChartElement_chart.prototype._onLeftGrippyMove	= function(oEvent) {
	var oThrobber	= this.$getContainer("throbber"),
		nWidth		= this._throbberWidth -(oEvent.clientX - this._mouseX);
	if (nWidth < 3)
		nWidth	= 3;
	else
	if (nWidth > this._throbberWidth + this._throbberLeft)
		nWidth	= this._throbberWidth + this._throbberLeft;

		this.from	= (this._throbberWidth + this._throbberLeft - nWidth) / 500;
	this.zoom();
};

cChartElement_chart.prototype._onRightGrippyDown	= function(oEvent) {
	this._mouseX	= oEvent.clientX;
	this._throbberLeft	= parseInt(this.$getContainer("throbber").style.left);
	this._throbberWidth	= parseInt(this.$getContainer("throbber").style.width);

	this.setCapture(true);
	this.addEventListener("mousemove", cChartElement_chart.prototype._onRightGrippyMove);
	this.addEventListener("mouseup", function(oEvent) {
		this.releaseCapture();
		this.removeEventListener(oEvent.type, arguments.callee);
		this.removeEventListener("mousemove", cChartElement_chart.prototype._onRightGrippyMove);
	});

		if (oEvent.stopPropagation)
		oEvent.stopPropagation();
	else
		oEvent.cancelBubble	= true;
};

cChartElement_chart.prototype._onRightGrippyMove	= function(oEvent) {
	var oThrobber	= this.$getContainer("throbber"),
		nWidth		= this._throbberWidth +(oEvent.clientX - this._mouseX);
	if (nWidth < 3)
		nWidth	= 3;
	else
	if (nWidth > 500 - this._throbberLeft)
		nWidth	= 500 - this._throbberLeft;

		this.to	= (this._throbberLeft + nWidth) / 500;
	this.zoom();
};

cChartElement_chart._onLeftButtonDown	= function() {
	this.setCapture(true);
	this.addEventListener("mouseup", function(oEvent) {
		this.releaseCapture();
		this.removeEventListener(oEvent.type, arguments.callee);
	});
};

cChartElement_chart._onRightButtonDown	= function() {
	this.setCapture(true);
	this.addEventListener("mouseup", function(oEvent) {
		this.releaseCapture();
		this.removeEventListener(oEvent.type, arguments.callee);
	});
};

cChartElement_chart.prototype._from	= 0;
cChartElement_chart.prototype._to	= 1;
cChartElement_chart.prototype._onViewDown	= function(oEvent) {
	this._mouseX	= oEvent.clientX;
	this._from	= this.from;
	this._to	= this.to;

	this.setCapture(true);
	this.addEventListener("mousemove", cChartElement_chart.prototype._onViewMove);
	this.addEventListener("mouseup", function(oEvent) {
		this.releaseCapture();
		this.removeEventListener(oEvent.type, arguments.callee);
		this.removeEventListener("mousemove", cChartElement_chart.prototype._onViewMove);
	});
};

cChartElement_chart.prototype._onViewMove	= function(oEvent) {
	var nOffset	= (this._to - this._from) * (oEvent.clientX - this._mouseX) / 500;
	if (this._from - nOffset > 0)
		this.from	= this._from - nOffset;
	else
		this.from	= 0;
	if (this._to - nOffset < 1)
		this.to		= this._to - nOffset;
	else
		this.to		= 1;
		this.zoom();
};

cChartElement_chart.prototype.$getTagOpen	= function() {
	return '<div class="c-chart' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
				<div onmousedown="ample.$instance(this)._onViewDown(event); return false" style="height:300px">\
					<svg:svg class="c-chart--canvas" viewBox="0 0 600 300" width="600px" height="300px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
						<svg:text class="c-chart--title" y="30" x="300">' + this.getAttribute("title")+ '</svg:text>\
						<svg:path class="c-grid c-chart--grid"/>\
						<svg:path class="c-chart--view" style="fill:lightblue;fill-opacity:0.5;"/>\
					</svg:svg>\
				</div>';
};

cChartElement_chart.prototype.$getTagClose	= function() {
	return '	<div class="c-scrollbar" style="position:relative; background-color: silver; height:20px; width:600px;">\
					<div class="c-scrollbar--button-left" style="position:absolute; left: 10px; width:20px; height:20px; background-color: brown"></div>\
					<div class="c-scrollbar--button-right" style="position:absolute; right: 10px; width:20px; height:20px; background-color: brown"></div>\
					<div class="c-scrollbar--throbber" style="position:absolute; left:0; width:500px; height:20px; padding-left:20px; padding-right:20px; margin-left:30px; background-color: white;" onmousedown="ample.$instance(this)._onThrobberDown(event); return false">\
						<div class="c-scrollbar--grippy-left" style="position:absolute; left: 0px; width:20px; height:20px; background-color: green" onmousedown="ample.$instance(this)._onLeftGrippyDown(event); return false"></div>\
						<div class="c-scrollbar--grippy-right" style="position:absolute; right: 0px; width:20px; height:20px; background-color: green" onmousedown="ample.$instance(this)._onRightGrippyDown(event); return false"></div>\
					</div>\
				</div>\
				<div>\
					<svg:svg class="c-chart--canvas2" viewBox="0 0 600 100" width="600px" height="100px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
						<svg:path class="c-chart--preview" style="fill:gray"/>\
						<svg:path class="c-chart--fragment" style="fill:lightblue;opacity:0.5"/>\
					</svg:svg>\
				</div>\
			</div>';
};

oChartNamespace.setElement("chart", cChartElement_chart);


var cChartElement_doughnut	= function(){};
cChartElement_doughnut.prototype	= new cChartElement;

cChartElement_doughnut.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		this.refresh();
	}
};

cChartElement_doughnut.prototype.refresh	= function() {
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
				var nSumAll	= 0,
			nSumUp	= 0;
		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem; oItem = oGroup.childNodes[nItem]; nItem++)
			nSumAll	+= oItem.getAttribute("value") * 1;

		var cX	= 150,
			cY	= 150,
			nWidth	= 100 /(nGroups + 0.5);

		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem; oItem = oGroup.childNodes[nItem]; nItem++) {
						var	nInnerR	=(nGroup + 0.5 )* nWidth,
				nOuterR	= nInnerR + nWidth,
				nAngleFrom	=-Math.PI / 2 + 2 * Math.PI * nSumUp / nSumAll,
				nAngleTo	=-Math.PI / 2 + 2 * Math.PI *(nSumUp + oItem.getAttribute("value") * 1) / nSumAll;

			var d	= [];
						d.push("M" + (cX + nInnerR * Math.cos(nAngleFrom)) + "," +(cY + nInnerR * Math.sin(nAngleFrom)));
						d.push("L" + (cX + nOuterR * Math.cos(nAngleFrom)) + "," +(cY + nOuterR * Math.sin(nAngleFrom)));
						d.push("A" + nOuterR + "," + nOuterR + " 0 " + (nAngleTo - nAngleFrom >= Math.PI ? 1 : 0)+ ",1 " + (cX + nOuterR * Math.cos(nAngleTo)) + "," +(cY + nOuterR * Math.sin(nAngleTo)));
						d.push("L" + (cX + nInnerR * Math.cos(nAngleTo)) + "," +(cY + nInnerR * Math.sin(nAngleTo)));
						d.push("A" + nInnerR + "," + nInnerR + " 0 " + (nAngleTo - nAngleFrom >= Math.PI ? 1 : 0)+ ",0 " + (cX + nInnerR * Math.cos(nAngleFrom)) + "," +(cY + nInnerR * Math.sin(nAngleFrom)));

			cChartElement.setPath(oItem.$getContainer("path"), d.join('') + "z");
			
						var nTextR	=(nOuterR + nInnerR)/2 - 5,
				nAngleFromText	= nAngleFrom + Math.PI / 90;
			cChartElement.setPath(oItem.$getContainer("textPath"),	"M" + (cX + nTextR * Math.cos(nAngleFromText)) + "," +(cY + nTextR * Math.sin(nAngleFromText)) + ' ' +
																	"A" + nTextR + "," + nTextR + " 0 " + (nAngleTo - nAngleFrom > Math.PI ? 1 : 0) + ",1 " + (cX + nTextR * Math.cos(nAngleTo)) + "," +(cY + nTextR * Math.sin(nAngleTo))+
																"z");
						nSumUp	+= oItem.getAttribute("value") * 1;
		}
	}
};

if (!cChartElement.useVML) {
	cChartElement_doughnut.prototype.$getTagOpen	= function() {
		return '<div class="c-doughnut' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
					<svg:svg class="c-doughnut--canvas" viewBox="0 0 300 300" width="300px" height="300px" xmlns:svg="http://www.w3.org/2000/svg">\
						<svg:text class="c-doughnut--title" y="30" x="150">' + this.getAttribute("title")+ '</svg:text>\
						<svg:g class="c-doughnut--gateway">';
	};

	cChartElement_doughnut.prototype.$getTagClose	= function() {
		return '		</svg:g>\
					</svg:svg>\
				</div>';
	};
}
else {
		(function() {
		var fHandler	= cChartElement_doughnut.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_doughnut.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			fHandler.call(this, oEvent);
						cChartElement_doughnut.recalcCSS(this);
						var that	= this;
			setTimeout(function() {
				var oCanvas	= that.$getContainer("canvas");
				if (oCanvas)
					oCanvas.style.display	= "";
			});
		};
	})();

	cChartElement_doughnut.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("title"));
	};

	cChartElement_doughnut.prototype.$getTagOpen	= function() {
		return '<div class="c-doughnut' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;width:300px;height:300px;' + this.getAttribute("style") + '">\
					<chart2vml:group class="c-doughnut--canvas" style="position:absolute;width:300px;height:300px;display:none;" coordOrigin="0 0" coordSize="300 300">\
						<chart2vml:shape class="c-doughnut--title" path="m0,0 l300,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + this.getAttribute("title")+ '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:group class="c-doughnut--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_doughnut.prototype.$getTagClose	= function() {
		return '		</chart2vml:group>\
					</chart2vml:group>\
				</div>';
	};
}

oChartNamespace.setElement("doughnut", cChartElement_doughnut);


var cChartElement_funnel	= function(){};
cChartElement_funnel.prototype	= new cChartElement;

cChartElement_funnel.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		this.refresh();
	}
};

cChartElement_funnel.prototype.refresh	= function() {
		var nSumAll	= 0;
	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++)
		nSumAll	+= oElement.getAttribute("value") * 1;

	var nSumUp	= 0,
		nLeft	= 150,
		nTop	= 50,
		nHeight		= 200,
		nWidthTop	= 100,
		nWidthBottom	= 20;

	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++) {
				var	nCFrom	= nSumUp / nSumAll,
			nCTo	=(nSumUp + oElement.getAttribute("value") * 1) / nSumAll;

		var d	= [];
				d.push("M" + (nLeft + nWidthTop + nCFrom * (nWidthBottom - nWidthTop)) + "," + (nTop + nCFrom * nHeight));
				d.push("L" + (nLeft + nWidthTop + nCTo * (nWidthBottom - nWidthTop)) + "," + (nTop + nCTo * nHeight));
				d.push("L" + (nLeft - nWidthTop - nCTo * (nWidthBottom - nWidthTop)) + "," + (nTop + nCTo * nHeight));
				d.push("L" + (nLeft - nWidthTop - nCFrom * (nWidthBottom - nWidthTop)) + "," + (nTop + nCFrom * nHeight));

		cChartElement.setPath(oElement.$getContainer("path"), d.join('') + "z");

				nSumUp	+= oElement.getAttribute("value") * 1;
	}
};

if (!cChartElement.useVML) {
	cChartElement_funnel.prototype.$getTagOpen	= function() {
		return '<div class="c-funnel' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
					<svg:svg class="c-funnel--canvas" viewBox="0 0 300 300" width="300px" height="300px" xmlns:svg="http://www.w3.org/2000/svg">\
						<svg:text class="c-funnel--title" y="30" x="150">' + this.getAttribute("title")+ '</svg:text>\
						<svg:g class="c-funnel--gateway">';
	};

	cChartElement_funnel.prototype.$getTagClose	= function() {
		return '		</svg:g>\
					</svg:svg>\
				</div>';
	};
}
else {
		(function() {
		var fHandler	= cChartElement_funnel.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_funnel.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			fHandler.call(this, oEvent);
						cChartElement_funnel.recalcCSS(this);
						var that	= this;
			setTimeout(function() {
				var oCanvas	= that.$getContainer("canvas");
				if (oCanvas)
					oCanvas.style.display	= "";
			});
		};
	})();

	cChartElement_funnel.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("title"));
	};

	cChartElement_funnel.prototype.$getTagOpen	= function() {
		return '<div class="c-funnel' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;width:300px;height:300px;' + this.getAttribute("style") + '">\
					<chart2vml:group class="c-funnel--canvas" style="position:absolute;width:300px;height:300px;display:none;" coordOrigin="0 0" coordSize="300 300">\
						<chart2vml:shape class="c-funnel--title" path="m0,0 l300,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + this.getAttribute("title")+ '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:group class="c-funnel--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_funnel.prototype.$getTagClose	= function() {
		return '		</chart2vml:group>\
					</chart2vml:group>\
				</div>';
	};
}

oChartNamespace.setElement("funnel", cChartElement_funnel);


var cChartElement_group	= function(){};
cChartElement_group.prototype	= new cChartElement;
cChartElement_group.prototype.$hoverable	= true;

cChartElement_group.handlers	= {
	'DOMAttrModified':	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "selected":
					this.$setPseudoClass("selected", oEvent.newValue == "true");
			}
		}
	},
	'click':	function(oEvent) {
		this.setAttribute("selected", this.getAttribute("selected") == "true" ? "false" : "true");
	}
};

if (!cChartElement.useVML) {
	cChartElement_group.prototype.$getTagOpen	= function() {
		return '<svg:g class="c-group c-group_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" \
					style="' + this.getAttribute("style") + '">\
					<svg:path class="c-group--path" />\
					<svg:path class="c-group--shadow" style="fill:none;stroke-linejoin:round" transform="translate(2, 2)"/>\
					<svg:path class="c-group--line" style="fill:none;stroke-linejoin:round"/>\
					<svg:path class="c-group--area" style="stroke:none"/>\
					<svg:text class="c-group--label" style="stroke:none">' + this.getAttribute("label")+ '</svg:text>\
					<svg:g class="c-group--gateway">';
	};

	cChartElement_group.prototype.$getTagClose	= function() {
		return '	</svg:g>\
				</svg:g>';
	};
}
else {
		(function() {
		var fHandler	= cChartElement_group.handlers['DOMAttrModified'];
		cChartElement_group.handlers['DOMAttrModified']	= function(oEvent) {
			fHandler.call(this, oEvent);
						if (oEvent.target == this && oEvent.attrName == "selected") {
				cChartElement_group.recalcCSS(this);
								for (var nIndex = 0, nLength = this.childNodes.length; nIndex < nLength; nIndex++)
					cChartElement_item.recalcCSS(this.childNodes[nIndex]);
			}
		};
	})();

	cChartElement_group.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("label"));
		cChartElement.applyCSS(oElement.$getContainer("path"));
		cChartElement.applyCSS(oElement.$getContainer("shadow"));
		cChartElement.applyCSS(oElement.$getContainer("line"));
		cChartElement.applyCSS(oElement.$getContainer("area"));
	};

	cChartElement_group.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
		cChartElement_group.recalcCSS(this);
	};

	cChartElement_group.handlers['mouseenter']	=
	cChartElement_group.handlers['mouseleave']	= function(oEvent) {
		cChartElement_group.recalcCSS(this);
				for (var nIndex = 0, nLength = this.childNodes.length; nIndex < nLength; nIndex++)
			cChartElement_item.recalcCSS(this.childNodes[nIndex]);
	};

	cChartElement_group.prototype.$getTagOpen	= function() {
		return '<chart2vml:group class="c-group c-group_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" \
					style="position:absolute;width:100%;height:100%;' + this.getAttribute("style") + '">\
					<chart2vml:shape class="c-group--shadow" filled="false" style="position:absolute;width:100%;height:100%;margin-left:2px;margin-top:2px;"/>\
					<chart2vml:shape class="c-group--path" style="position:absolute;width:100%;height:100%" />\
					<chart2vml:shape class="c-group--line" filled="false" style="position:absolute;width:100%;height:100%"/>\
					<chart2vml:shape class="c-group--area" stroked="false" fillcolor="black" style="position:absolute;width:100%;height:100%"/>\
					<chart2vml:shape path="m0,0 l100,0" class="c-group--label" stroked="false" fillcolor="black" allowoverlap="true" style="position:absolute;width:100%;height:100%;margin-left:0;margin-top:0">\
						<chart2vml:path textpathok="true" />\
						<chart2vml:textpath on="true" string="' + this.getAttribute("label")+ '" style="v-text-align:left" />\
					</chart2vml:shape>\
					<chart2vml:group class="c-group--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_group.prototype.$getTagClose	= function() {
		return '	</chart2vml:group>\
				</chart2vml:group>';
	};
}

oChartNamespace.setElement("group", cChartElement_group);


var cChartElement_item	= function(){};
cChartElement_item.prototype	= new cChartElement;
cChartElement_item.prototype.$hoverable	 = true;

cChartElement_item.handlers	= {

};

if (!cChartElement.useVML) {
	cChartElement_item.prototype.$getTagOpen	= function() {
		return '<svg:g class="c-item c-item_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
					<svg:path class="c-item--shadow" style="stroke-linejoin:round" transform="translate(2,2)"/>\
					<svg:path class="c-item--path"/>\
					<svg:path class="c-item--textPath" d="m0,0 h600" id="p' + this.uniqueID + '" style="fill:none;stroke:none"/>\
					<svg:text class="c-item--label" style="stroke:none;"><svg:textPath xlink:href="#p' + this.uniqueID + '">' + this.getAttribute("value")+ '</svg:textPath></svg:text>\
				</svg:g>';
	};
}
else {
	cChartElement_item.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("label"));
		cChartElement.applyCSS(oElement.$getContainer("path"));
		cChartElement.applyCSS(oElement.$getContainer("shadow"));
	};

	cChartElement_item.handlers['DOMNodeInsertedIntoDocument']	=
	cChartElement_item.handlers['mouseenter']	=
	cChartElement_item.handlers['mouseleave']	= function(oEvent) {
		cChartElement_item.recalcCSS(this);
	};

	cChartElement_item.prototype.$getTagOpen	= function() {
		return '<chart2vml:group class="c-item c-item_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="position:absolute;width:100%;height:100%">\
					<chart2vml:shape class="c-item--shadow" style="position:absolute;width:100%;height:100%;margin-top:2px;margin-left:2px;"/>\
					<chart2vml:shape class="c-item--path" fillcolor="black" style="position:absolute;height:100%;width:100%"/>\
					<chart2vml:shape class="c-item--textPath c-item--label" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
						<chart2vml:path textpathok="true" />\
						<chart2vml:textpath on="true" string="' + this.getAttribute("value")+ '" style="v-text-align:left"/>\
					</chart2vml:shape>\
				</chart2vml:group>';
	};
}

oChartNamespace.setElement("item", cChartElement_item);


var cChartElement_line	= function(){};
cChartElement_line.prototype	= new cChartElement;

cChartElement_line.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		this.refresh();
	}
};

cChartElement_line.prototype.refresh	= function() {
	var bArea	= this.getAttribute("area") == "true";

		var aData	= [],
		nXMax	=-Infinity,
		nXMin	= Infinity,
		nYMax	=-Infinity,
		nYMin	= Infinity,
		aYSumAll	= [],
		nYSumMax	=-Infinity,
		nYSumMin	=-Infinity;
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup, aGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
		aGroup	= [];
		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem, aValue, nX, nY; oItem = oGroup.childNodes[nItem]; nItem++) {
			aValue	= oItem.getAttribute("value").split(',');
			nX	= aValue[0] * 1;
			nY	= aValue[1] * 1;
			if (nX > nXMax)
				nXMax	= nX;
			if (nX < nXMin)
				nXMin	= nX;
			if (nY > nYMax)
				nYMax	= nY;
			if (nY < nYMin)
				nYMin	= nY;
			aGroup.push([nX, nY]);
						if (aYSumAll.length < nItem + 1)
				aYSumAll[nItem]	= 0;
			aYSumAll[nItem]	+= nY;
						if (aYSumAll[nItem] > nYSumMax)
				nYSumMax	= aYSumAll[nItem];
			if (aYSumAll[nItem] < nYSumMin)
				nYSumMin	= aYSumAll[nItem];
		}
		aData.push(aGroup);
	}

		var d	= [];
	for (var x = 1; x < 8; x++)
		d.push("M" + (50 + x * 50) + ",50 v200 z ");
	for (var y = 1; y < 4; y++)
		d.push("M50," + (250 - y * 50) + "h400 z ");
	cChartElement.setPath(this.$getContainer("grid"), d.join(''));

	var aYSumUp	=[],
		nYFromPrev = 250, nYToPrev = 250, dPrev = [];
		for (var nGroup = 0, nGroups = aData.length, oGroup; nGroup < nGroups; nGroup++) {
				oGroup = this.childNodes[nGroup];

				var nXFrom, nYFrom,
			nXTo, nYTo,
			nX, nY,	d = [];
		for (var nItem = 0, nItems = aData[nGroup].length; nItem < nItems; nItem++) {
						if (aYSumUp.length < nItem + 1)
				aYSumUp[nItem]	= 0;
						aYSumUp[nItem]	+= aData[nGroup][nItem][1];

			if (this.getAttribute("type") == "stack") {
				nX	= 50 + aData[nGroup][nItem][0] * 400 / nXMax;
				nY	= 250- aYSumUp[nItem] * 200 / nYSumMax;
			}
			else
			if (this.getAttribute("type") == "percentage") {
				nX	= 50 + aData[nGroup][nItem][0] * 400 / nXMax;
				nY	= 250- 200 * aYSumUp[nItem] / aYSumAll[nItem];
			}
			else {
				nX	= 50 + aData[nGroup][nItem][0] * 400 / nXMax;
				nY	= 250- aData[nGroup][nItem][1] * 200 / nYMax;
			}

						if (!bArea)
				cChartElement.setPath(oGroup.childNodes[nItem].$getContainer("path"), cChartElement_line.getMarkerPath(nX, nY, nGroup));
						d.push(nX + "," + nY + " ");

			if (!nItem) {
				nXFrom	= nX;
				nYFrom	= nY;
			}
			else
			if (nItem == nItems - 1) {
				nXTo	= nX;
				nYTo	= nY;
			}
		}

				cChartElement.setPath(oGroup.$getContainer("line"), "M" + nXFrom + "," + nYFrom + " L" + d.join(''));
		cChartElement.setPath(oGroup.$getContainer("shadow"), "M" + nXFrom + "," + nYFrom + " L" + d.join(''));
		if (bArea)
			cChartElement.setPath(oGroup.$getContainer("area"), "M" + nXFrom + "," + nYFromPrev + " L" + d.join('') + (this.hasAttribute("type") ? dPrev.reverse().join('') : '') + " L" + nXTo + "," + nYToPrev + "z");

				var nXPath	= 480,
			nYPath	=(50 + (nGroups - nGroup) * 20),
			sLine	= this.getAttribute("area") == "true" ? "h20" : " h7 z M" + (nXPath + 10) + "," + nYPath + " h-7";
		cChartElement.setPath(oGroup.$getContainer("path"), "M" + (nXPath - 10) + "," + nYPath + sLine + "z" + (this.getAttribute("area") == "true" ? '' : cChartElement_line.getMarkerPath(nXPath, nYPath, nGroup)));
		cChartElement.setTextPosition(oGroup.$getContainer("label"),
										nXPath + 20,
										nYPath + 5);

				if (this.hasAttribute("type")) {
			nYFromPrev	= nYFrom;
			nYToPrev	= nYTo;
			dPrev	= d;
		}
	}
};

if (!cChartElement.useVML) {
	cChartElement_line.prototype.$getTagOpen	= function() {
		return '<div class="c-line' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
					<svg:svg class="c-line--canvas" viewBox="0 0 600 300" width="600px" height="300px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
						<svg:text class="c-line--title" y="30" x="300">' + this.getAttribute("title")+ '</svg:text>\
						<svg:rect x="460" y="50" width="120" height="120" rx="10" class="c-legend"/>\
						<svg:path class="c-grid c-line--grid"/>\
						<svg:g class="c-xAxis">\
							<svg:path class="c-line--xAxis" d="m50,250 h400,0" style="fill:none"/>\
							<svg:path id="x' + this.uniqueID + '" d="m300,280 h400,0" style="fill:none;stroke:none"/>\
							<svg:text class="c-xAxis--label c-line--xAxisLabel"><svg:textPath xlink:href="#x' + this.uniqueID + '">' + this.getAttribute("xAxisLabel")+ '</svg:textPath></svg:text>\
						</svg:g>\
						<svg:g class="c-yAxis">\
							<svg:path class="c-line--yAxis" d="m50,250 v0,-200" style="fill:none"/>\
							<svg:path id="y' + this.uniqueID + '" d="m30,200 v0,-200" style="fill:none;stroke:none"/>\
							<svg:text class="c-yAxis--label c-line--yAxisLabel"><svg:textPath xlink:href="#y' + this.uniqueID + '">' + this.getAttribute("yAxisLabel")+ '</svg:textPath></svg:text>\
						</svg:g>\
						<svg:g class="c-line--gateway">';
	};

	cChartElement_line.prototype.$getTagClose	= function() {
		return '		</svg:g>\
					</svg:svg>\
				</div>';
	};
}
else {
		(function() {
		var fHandler	= cChartElement_line.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_line.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			fHandler.call(this, oEvent);
						cChartElement_line.recalcCSS(this);
						var that	= this;
			setTimeout(function() {
				var oCanvas	= that.$getContainer("canvas");
				if (oCanvas)
					oCanvas.style.display	= "";
			});
		};
	})();

	cChartElement_line.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("title"));
		cChartElement.applyCSS(oElement.$getContainer("legend"));
		cChartElement.applyCSS(oElement.$getContainer("grid"));
		cChartElement.applyCSS(oElement.$getContainer("xAxis"));
		cChartElement.applyCSS(oElement.$getContainer("xAxisLabel"));
		cChartElement.applyCSS(oElement.$getContainer("xAxisMarks"));
		cChartElement.applyCSS(oElement.$getContainer("yAxis"));
		cChartElement.applyCSS(oElement.$getContainer("yAxisLabel"));
		cChartElement.applyCSS(oElement.$getContainer("yAxisMarks"));
	};

	cChartElement_line.prototype.$getTagOpen	= function() {
		return '<div class="c-line' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;width:600px;height:300px;' + this.getAttribute("style") + '">\
					<chart2vml:group class="c-line--canvas" style="position:absolute;width:600px;height:300px;display:none;" coordOrigin="0 0" coordSize="600 300">\
						<chart2vml:shape class="c-line--title" path="m0,0 l600,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + this.getAttribute("title")+ '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:roundrect style="left:460px;top:50px;width:120px;height:120px" rx="10" class="c-legend c-line--legend" filled="true"/>\
						<chart2vml:shape class="c-grid c-line--grid" style="position:absolute;width:100%;height:100%"/>\
						<chart2vml:group class="c-xAxis" style="position:absolute;width:100%;height:100%">\
							<chart2vml:shape class="c-line--xAxis" path="m50,250 r400,0 e" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:shape class="c-xAxis--label c-line--xAxisLabel" path="m50,280 r400,0 e" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
								<chart2vml:path textpathok="true" />\
								<chart2vml:textpath on="true" string="' + this.getAttribute("xAxisLabel")+ '" style="v-text-align:right"/>\
							</chart2vml:shape>\
							<chart2vml:shape class="c-xAxis--marks c-line--xAxisMarks" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:group class="c-xAxis--scale c-line--xAxisItems" style="top:3px"/>\
						</chart2vml:group>\
						<chart2vml:group class="c-yAxis" style="position:absolute;width:100%;height:100%">\
							<chart2vml:shape class="c-line--yAxis" path="m50,250 r0,-200 e" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:shape class="c-yAxis--label c-line--yAxisLabel" path="m20,250 r0,-200 e" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
								<chart2vml:path textpathok="true" />\
								<chart2vml:textpath on="true" string="' + this.getAttribute("yAxisLabel")+ '" style="v-text-align:right"/>\
							</chart2vml:shape>\
							<chart2vml:shape class="c-yAxis--marks c-line--yAxisMarks" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:group class="c-yAxis--scale c-line--yAxisItems" style="top:3px"/>\
						</chart2vml:group>\
						<chart2vml:group class="c-line--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_line.prototype.$getTagClose	= function() {
		return '		</chart2vml:group>\
					</chart2vml:group>\
				</div>';
	};
}

cChartElement_line.getMarkerPath	= function(nX, nY, nType) {
	var nSize	= 3,
		nSize2	= nSize * 2;
	switch (nType) {
				case 1:
			return	"M" +(nX - nSize)+ "," +(nY - nSize)+
					"h" + nSize2 +
					"v" + nSize2 +
					"h-" + nSize2 +
					"v-" + nSize2 +
					"z";
				case 4:
			var nOffset	= nSize2 / Math.sqrt(3);
			return	"M" +(nX - nOffset)+ "," +(nY - nSize)+
					"h" + nOffset * 2 +
					"l-" + nOffset + "," + nSize2 +
					"l-" + nOffset + ",-" + nSize2 +
					"z";
				case 3:
			return "M" + nX + "," +(nY - nSize)+
					"l" + nSize + "," + nSize +
					"l-" + nSize + "," + nSize +
					"l-" + nSize + ",-" + nSize +
					"l" + nSize + ",-" + nSize +
					"z";
				case 2:
			var nOffset	= nSize2 / Math.sqrt(3);
			return	"M" + nX + "," +(nY - nSize)+
					"l" + nOffset + "," + nSize2 +
					"h-" + nOffset * 2 +
					"l" + nOffset + ",-" + nSize2 +
					"z";
				default:
			return	"M" + (nX - nSize) + "," + nY +
					"a" + nSize + "," + nSize + " 0 0,0 " + nSize2 + ",0 " +
					"a" + nSize + "," + nSize + " 0 0,0 -" + nSize2 + ",0 " +
					"z";
	}
};

oChartNamespace.setElement("line", cChartElement_line);


var cChartElement_map	= function(){};
cChartElement_map.prototype	= new cChartElement;

cChartElement_map.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		this.refresh();
	}
};

cChartElement_map.prototype.refresh	= function() {
		var aData	= [],
		nGroupMax	=-Infinity,
		nGroupMin	= Infinity;
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup, aGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
		aGroup	= [];
		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem, aValue, nValue; oItem = oGroup.childNodes[nItem]; nItem++) {
			aValue	= oItem.getAttribute("value").split(',');
			nValue	= aValue[1] * 1;
			if (nValue > nGroupMax)
				nGroupMax	= nValue;
			if (nValue < nGroupMin)
				nGroupMin	= nValue;
			aGroup.push(aValue);
		}
		aData.push(aGroup);
	}

	for (var nGroup = 0, nGroups = aData.length, oGroup; nGroup < nGroups; nGroup++) {
				oGroup = this.childNodes[nGroup];

		for (var nItem = 0, nItems = aData[nGroup].length, oItem, oPath; nItem < nItems; nItem++) {
						oItem	= oGroup.childNodes[nItem];
			oPath	= oItem.$getContainer("path");
						cChartElement.setPath(oPath, cChartElement_map.countries[aData[nGroup][nItem][0]][1][0]);
			oPath.style["fill-opacity"]	= 0.2 + 0.8 * aData[nGroup][nItem][1] / nGroupMax;
		}

				var nXPath	= 40,
			nYPath	=(200 + nGroup * 20);
		cChartElement.setPath(oGroup.$getContainer("path"), "M" + (nXPath - 5) + "," + (nYPath - 5) + "h10 v10 h-10 v-10 z");
		cChartElement.setTextPosition(oGroup.$getContainer("label"),
										nXPath + 20,
										nYPath + 5);
	}
};

cChartElement_map.countries	= {
	'ad':["", ["M285,140L284,140 284,140z"]],
	'ae':["", ["M350,167L353,167 356,165 356,165 356,166 356,166 356,168 355,168 355,170 351,169z"]],
	'af':["", ["M362,159L363,158 363,157 362,157 362,155 363,151 364,152 369,148 370,148 371,149 373,149 375,147 376,147 376,147 376,147 376,149 376,149 378,148 380,148 381,149 380,149 379,149 378,149 376,150 376,150 376,152 375,153 376,153 375,153 374,153 375,154 374,155 373,156 373,157 372,157 370,157 369,158 369,159 366,160 364,160z"]],
	'ag':["", ["M201,177L201,177 201,177zM201,176L201,176 201,176z"]],
	'ai':["", ["M199,175L199,176 200,175zM199,176L199,176 199,176z"]],
	'al':["", ["M309,140L309,141 309,142 310,143 310,143 309,145 308,144 308,141 308,141z"]],
	'am':["", ["M341,142L339,142 340,144 341,145 342,145 343,146 343,146 343,145 342,144 343,144z"]],
	'an':["", ["M191,183L192,184 192,184zM192,183L193,184 193,184z"]],
	'ao':["", ["M298,206L299,205 299,206 299,206 299,207 298,207zM299,208L299,207 304,207 305,210 308,210 308,209 309,209 309,209 311,209 311,215 314,214 314,217 311,217 311,221 313,223 310,224 307,223 306,223 301,223 299,222 298,223 298,221 299,217 300,216 300,214 299,212 300,211 298,208z"]],
	'ar':["", ["M194,230L195,229 196,229 197,229 198,230 198,229 200,229 203,232 207,234 205,236 209,237 210,236 211,234 212,234 212,236 207,241 205,246 205,247 207,248 208,250 207,252 200,253 200,256 197,256 197,259 196,263 194,264 194,266 196,267 196,268 193,270 193,271 192,272 191,273 192,276 190,275 188,275 187,273 186,273 186,270 188,264 188,259 188,254 189,253 190,245 190,242 192,236 192,233 194,232z"]],
	'as':["", ["M531,218L531,219 531,219z"]],
	'at':["", ["M295,132L299,132 299,131 300,130 302,130 302,130 305,130 305,132 304,133 301,134 300,134 298,133 296,133 295,133z"]],
	'au':["", ["M467,223L469,214 471,219 473,220 474,225 483,234 484,239 482,244 479,249 479,251 474,254 472,252 471,254 466,251 465,248 463,246 461,247 458,243 454,243 448,244 445,246 440,246 437,248 433,246 434,243 431,236 432,234 431,232 436,227 441,226 444,222 445,223 449,218 451,220 452,220 452,219 454,216 456,216 457,215 462,216 460,219zM472,256L475,257 477,256 477,258 475,261 474,261 472,257z"]],
	'aw':["", ["M190,183L190,183 190,183z"]],
	'ax':["", ["M309,109L308,109 309,110z"]],
	'az':["", ["M343,141L343,142 344,142 343,143 342,142 341,142 343,144 342,144 343,145 343,146 345,145 346,147 347,144 348,144 347,143 346,141 345,142zM342,145L341,145 342,146 343,146z"]],
	'ba':["", ["M307,136L307,139 306,140 303,137 303,136z"]],
	'bb':["", ["M204,182L204,182 204,182z"]],
	'bd':["", ["M399,171L399,167 398,167 399,166 398,165 398,164 400,165 400,166 404,166 402,168 402,169 403,168 404,170 404,171 403,172 402,169z"]],
	'be':["", ["M286,126L287,126 289,125 290,126 290,127 290,127 291,127 290,128 290,128 290,129 289,129z"]],
	'bf':["", ["M283,185L285,184 283,180 281,180 280,181 279,181 278,181 275,184 275,186 277,187 278,186 279,187 279,185 282,185 282,185 282,185z"]],
	'bg':["", ["M312,142L312,141 312,141 312,139 312,138 312,138 312,138 316,138 318,138 320,138 320,139 318,140 319,141 317,142 317,142 315,142 314,142z"]],
	'bh':["", ["M348,164L349,164 349,165z"]],
	'bi':["", ["M323,203L323,204 321,206 321,204 320,203z"]],
	'bj':["", ["M286,191L286,188 286,188 287,186 287,185 287,184 286,183 285,184 283,185 283,186 284,187 285,191z"]],
	'bn':["", ["M433,193L434,194 433,193 433,194 433,194 432,194z"]],
	'bo':["", ["M191,223L192,222 192,221 191,220 192,216 191,214 193,214 195,213 196,212 197,216 203,218 203,221 206,221 206,223 207,224 206,226 205,225 201,226 200,229 198,229 198,230 197,229 196,229 195,229 194,230 193,230z"]],
	'br':["", ["M214,194L213,197 211,197 208,197 205,198 204,197 203,193 203,193 203,193 200,195 197,194 198,196 199,197 196,199 194,198 194,197 193,197 190,197 190,198 191,198 191,199 190,199 190,200 191,201 190,205 189,205 187,206 186,208 185,210 188,213 190,212 190,214 193,214 195,213 196,212 197,216 203,218 203,221 206,221 206,223 207,224 206,226 206,229 209,229 210,232 211,232 211,234 212,234 212,236 207,241 208,240 212,244 212,245 212,246 218,238 218,234 222,231 227,230 231,223 231,217 236,211 236,209 236,206 233,206 230,203 225,203 224,203 223,202 219,200 218,202 219,200 216,199 217,197 216,197z"]],
	'bs':["", ["M180,166L179,167 180,167 180,167zM180,167L180,167 180,168zM179,164L180,164 180,164zM181,164L181,164 181,165 181,164z"]],
	'bt':["", ["M399,163L400,164 403,164 403,163 403,163 403,162 400,162z"]],
	'bw':["", ["M315,223L319,228 321,229 318,231 316,234 313,234 311,236 309,236 309,235 310,235 308,233 308,229 310,229 310,224 313,224 313,224z"]],
	'by':["", ["M319,117L317,118 316,121 313,121 314,123 313,124 313,124 313,125 315,125 322,126 323,124 324,124 324,122 325,122 323,120 323,118z"]],
	'bz':["", ["M165,176L166,175 166,178 165,179 165,179z"]],
	'ca':["", ["M208,125L204,132 213,133 212,129 208,128 210,125zM179,88L186,93 187,95 184,97 185,98 181,99 180,100 181,101 185,100 189,104 196,106 192,102 197,104 198,102 193,97 199,99 202,96 193,91 194,90 192,86 180,82 177,83 175,79 170,81 170,84 169,82 171,79 167,79 164,83 164,85 167,86 165,86 167,88 179,88zM176,79L178,81 182,81 180,79zM145,80L144,81 145,86 150,88 148,91 142,90 134,92 128,88 135,87 128,87 127,86 129,85 126,84 127,82 131,80 133,82 134,81 137,82 137,81 139,82 140,84 140,80 143,81 142,79 144,79zM131,80L124,83 124,85 121,86 117,83 120,79 118,78 123,77 128,78zM130,69L121,72 128,72zM131,72L128,75 136,77 143,75 143,73 140,73 139,71 137,74zM144,64L149,65 152,68 146,67zM145,71L154,72 154,76 151,76zM157,74L155,76 159,77 159,75zM155,70L163,71 165,74 177,74 176,77 164,77 161,75 160,72 158,72zM153,66L156,69 160,68zM182,92L181,94 182,95 184,93zM133,68L138,67 138,68 135,69zM194,136L193,135 193,133 191,132 188,136 184,136 182,137 178,138 177,139 178,139 179,140 173,141 173,141 174,139 175,139 175,136 177,137 176,135 172,134 171,134 171,131 167,130 164,131 157,130 121,130 118,128 120,130 120,131 117,130 114,127 114,126 116,127 111,121 111,120 112,117 104,110 102,112 97,109 97,89 104,91 112,88 111,89 115,88 118,90 119,88 132,92 131,93 135,93 138,93 140,94 141,93 143,92 140,92 140,91 143,91 144,92 148,93 153,93 153,92 154,92 152,90 154,88 157,91 155,92 156,92 156,94 157,93 159,91 158,89 156,87 157,83 156,79 159,78 164,79 161,82 159,81 159,84 162,88 161,89 162,90 164,89 167,92 168,95 170,91 170,89 175,90 174,92 176,94 172,98 168,96 168,99 163,103 158,108 158,112 160,112 161,115 163,115 171,119 174,119 174,123 177,126 179,124 177,120 181,117 181,113 179,112 181,110 180,105 187,106 191,108 192,112 193,113 196,112 197,108 203,118 207,120 209,124 204,127 195,127 190,132 195,129 198,130 197,134 201,135 203,133 203,135 196,139 195,137 198,135zM170,98L168,102 171,103 173,101 176,102 176,102zM150,79L154,79 155,84 152,85 147,81 151,81zM167,69L165,72 178,72 178,70 185,65 183,64 189,62 202,54 185,51 174,53 173,55 171,54 161,57 169,60 177,60 168,61 172,65 169,65 167,67 170,68 167,68zM160,58L166,62 170,64 165,67 161,67 155,62z"]],
	'cd':["", ["M321,204L320,203 320,203 321,201 321,200 323,197 323,196 323,195 318,193 312,193 312,194 309,194 308,193 307,194 307,195 307,196 305,201 303,203 303,204 303,205 302,206 301,206 301,205 300,206 300,206 299,206 299,206 299,207 298,207 299,208 299,207 304,207 305,210 308,210 308,209 309,209 309,209 311,209 311,215 314,214 314,214 314,215 315,215 316,215 318,216 318,215 321,217 321,217 321,216 320,216 319,215 320,214 320,212 320,211 322,210 321,208 320,206z"]],
	'cf':["", ["M307,195L307,194 308,193 309,194 312,194 312,193 318,193 312,185 307,189 303,190 301,192 303,197 304,195z"]],
	'cg':["", ["M303,197L304,195 307,195 307,196 305,201 303,203 303,204 303,205 302,206 301,206 301,205 300,206 300,206 299,206 299,205 298,206 297,205 297,204 298,205 297,203 299,203 299,202 299,202 299,203 301,203 301,200 300,200 301,198 300,198 300,197 301,197 303,198z"]],
	'ch':["", ["M292,132L291,132 290,134 291,134 291,135 293,135 293,134 294,135 295,134 296,134 296,133 295,133 295,132z"]],
	'ci':["", ["M279,193L278,191 279,189 279,187 278,186 277,187 275,186 274,186 274,186 273,186 272,186 271,190 271,191 272,192 272,194 275,193 277,193z"]],
	'cl':["", ["M192,276L190,275 188,275 187,273 186,273 186,270 188,264 188,259 188,254 189,253 190,245 190,242 192,236 192,233 194,232 194,230 193,230 191,223 190,224 190,228 188,241 188,244 186,251 185,251 186,254 185,257 185,258 185,258 184,260 185,261 186,258 187,258 186,263 185,261 184,262 184,264 183,266 185,266 184,268 183,268 183,273 184,272 183,274 185,274 184,275 186,277 184,276 187,279 191,281 197,280 197,280 195,279 193,277 192,276 191,276 190,277 190,277 191,277 190,278 190,279 192,279 190,279 190,278 189,279 187,278 189,278 189,276 191,275z"]],
	'cm':["", ["M295,197L301,197 303,198 303,197 301,192 303,190 301,187 301,186 303,186 302,185 302,184 301,182 301,182 301,183 301,183 301,184 301,185 297,191 296,190 293,193 295,195z"]],
	'cn':["", ["M398,129L397,130 395,131 395,133 391,133 390,136 388,136 388,141 385,143 383,143 382,144 381,144 379,144 379,145 379,145 379,146 380,147 381,149 382,149 382,151 384,151 386,153 386,153 387,155 386,156 386,155 385,156 386,157 389,159 390,159 395,162 398,162 399,162 399,163 400,162 403,162 404,162 407,160 408,160 408,160 410,162 411,161 412,163 412,165 410,167 410,168 412,167 412,169 413,169 412,170 414,170 414,171 415,171 415,171 416,172 416,170 416,170 416,170 417,169 418,170 421,169 422,169 422,170 424,171 425,171 427,171 426,172 427,173 427,172 427,172 431,170 431,169 432,170 432,170 436,169 439,165 443,159 441,159 442,158 442,156 441,155 440,153 439,152 442,149 443,149 443,148 443,148 442,148 441,147 439,149 438,148 438,147 437,147 437,146 438,146 439,145 441,143 443,143 442,145 442,146 441,146 441,146 445,144 446,144 449,141 450,142 451,141 453,140 453,140 454,141 454,140 454,140 454,137 455,136 457,136 459,131 454,132 453,129 450,128 448,123 444,122 441,122 440,123 440,124 441,124 441,125 437,129 435,128 434,131 434,132 438,131 440,133 439,134 436,134 432,137 429,136 429,137 429,138 426,140 423,141 420,142 415,140 409,140 407,137 405,136 402,136 401,135 402,135 401,132 398,130zM428,173L426,173 425,174 425,175 426,176 427,175 428,173z"]],
	'co':["", ["M180,190L181,189 181,188 181,189 184,185 186,185 188,183 189,184 188,184 186,188 188,190 190,190 191,192 194,191 193,194 194,195 193,196 194,197 194,198 194,197 193,197 190,197 190,198 191,198 191,199 190,199 190,200 191,201 190,205 189,205 190,203 188,203 186,203 185,201 183,200 179,198 181,195 180,194 181,191z"]],
	'cr':["", ["M172,185L172,186 171,185 170,185 170,185 169,186 170,187 171,187 173,189 174,187z"]],
	'cu':["", ["M171,170L174,169 179,170 185,173 180,173 181,172 174,169 171,171zM173,170L173,171 174,171z"]],
	'cy':["", ["M328,151L326,151 325,151 325,152 325,152 326,152 327,152 327,151z"]],
	'cz':["", ["M307,129L305,130 302,130 302,130 300,130 298,128 302,126 307,128z"]],
	'de':["", ["M291,122L292,122 294,121 294,119 295,119 296,120 297,120 297,121 299,120 301,121 301,123 301,123 301,124 302,126 298,128 300,130 299,131 299,132 292,132 293,130 291,129 291,128 290,128 291,127 290,127 290,127 290,125 290,125 291,125 292,122z"]],
	'dj':["", ["M339,183L338,183 337,184 337,185 339,185 339,185 338,184 339,184z"]],
	'dk':["", ["M294,119L295,119 295,118 296,119 296,118 296,118 295,118 295,118 297,116 296,116 296,114 295,115 294,115 293,116 293,118 294,118zM299,117L298,117 298,118 297,117 297,118 297,119 298,119 298,119 299,119 298,118 299,118zM297,119L297,120 297,120 298,120 298,119 298,119 297,119z"]],
	'dm':["", ["M201,179L202,179 202,179 202,180z"]],
	'do':["", ["M188,173L188,176 188,176 190,175 192,175 193,175 189,173z"]],
	'dz':["", ["M293,149L293,152 292,154 294,156 295,159 295,165 298,168 292,172 290,174 288,174 286,174 284,172 276,166 271,163 271,162 271,161 277,157 277,157 281,156 279,152 286,149z"]],
	'ec':["", ["M183,200L179,198 176,201 176,203 177,204 177,204 177,206 178,206 178,206 180,204 182,203 183,201z"]],
	'ee':["", ["M312,112L311,112 312,112 311,113 311,114 313,112 312,112 312,112zM314,114L315,113 317,114 318,114 318,114 319,114 318,112 319,111 316,110 313,111 313,113 314,113z"]],
	'eg':["", ["M327,157L328,160 327,162 325,159 329,169 327,171 326,170 315,170 315,157 316,157 320,158 323,157 326,158z"]],
	'eh':["", ["M271,163L271,162 265,162 264,164 263,165 263,167 260,171 260,171 265,171 265,169 266,168 266,165 271,165z"]],
	'er':["", ["M333,176L331,177 330,181 332,181 332,180 333,181 335,181 338,183 339,183 336,180 335,180 335,179 334,179 334,178 333,176z"]],
	'es':["", ["M286,140L286,141 283,143 282,145 279,149 275,150 275,150 273,149 272,149 273,145 274,142 271,141 270,140 272,138 280,139 284,140 284,140 285,140zM286,144L287,145 286,145 285,145zM287,144L288,144 288,144zM284,146L284,145 284,146 284,146z"]],
	'et':["", ["M329,194L329,193 326,189 326,189 327,189 327,185 328,186 330,181 332,181 332,180 333,181 335,181 338,183 337,184 337,185 339,185 338,186 340,188 344,189 345,189 341,193 340,193 337,194 336,194 336,194 334,195 332,195 331,194z"]],
	'fi':["", ["M314,98L313,93 309,91 310,90 312,91 314,91 315,92 317,88 319,88 320,89 321,89 320,90 319,91 320,91 320,92 320,93 322,94 320,95 322,98 321,98 321,99 322,101 322,102 324,104 323,105 319,109 313,110 310,109 311,107 310,104 315,100 316,100 315,98z"]],
	'fj':["", ["M516,223L515,223 516,224 517,224zM517,222L517,222 519,222 518,221z"]],
	'fr':["", ["M280,139L284,140 285,140 286,140 286,139 288,139 290,139 291,139 292,138 292,138 291,137 291,137 291,136 292,136 291,134 290,134 291,132 292,132 293,130 291,129 290,129 289,129 286,126 284,127 284,128 282,129 281,129 281,129 280,129 280,130 279,130 278,130 276,130 277,132 279,132 281,135 281,137zM295,139L295,141 294,142 294,141 294,140 294,140z"]],
	'fk':["", ["M206,274L203,274 203,275 202,275 203,275 204,274 204,276 206,274z"]],
	'ga':["", ["M297,205L297,204 298,205 297,203 299,203 299,202 299,202 299,203 301,203 301,200 300,200 301,198 300,198 300,197 297,197 297,198 295,198 295,200 294,201 294,202z"]],
	'gb':["", ["M283,127L284,126 284,126 283,126 284,124 285,123 284,123 283,123 283,123 282,123 283,123 282,120 281,120 280,118 278,117 280,114 277,114 278,112 276,112 274,115 274,117 276,118 276,120 278,119 278,122 277,122 276,122 276,122 276,123 276,123 277,123 277,124 275,125 276,125 278,126 279,125 278,126 277,126 275,128 275,128 276,127 277,127 277,128 278,127 279,127 281,127 281,127zM273,119L272,120 273,121 273,120 274,121 275,120 274,119z"]],
	'gd':["", ["M201,183L201,184 201,184z"]],
	'ge':["", ["M337,142L338,142 339,142 341,142 342,142 343,143 344,142 343,142 343,141 342,141 342,140 335,139 335,139 337,140 337,142z"]],
	'gf':["", ["M211,192L211,193 211,195 211,197 213,197 214,194 213,193z"]],
	'gh':["", ["M284,192L283,191 283,186 282,186 282,185 282,185 282,185 279,185 279,187 279,189 278,191 279,193 280,193z"]],
	'gi':["", ["M275,150L275,150 275,150z"]],
	'gl':["", ["M194,61L197,62 187,67 193,70 189,70 193,73 201,72 208,77 210,81 209,85 212,84 215,87 211,86 212,90 216,89 212,94 218,107 225,110 230,99 236,97 240,92 253,88 253,80 257,77 256,64 266,57 260,56 253,58 253,54 239,50 218,53 220,55 214,53 215,55 209,54 201,56 201,58 199,58z"]],
	'gm':["", ["M260,182L262,182 264,182 264,182 263,181 260,182z"]],
	'gn':["", ["M265,188L266,187 268,187 268,188 268,189 269,188 270,189 270,190 270,190 271,190 271,190 272,186 270,184 267,184 267,183 264,183 264,184 263,185 263,185z"]],
	'gp':["", ["M201,178L201,178 202,178 202,178 201,178 201,179z"]],
	'gq':["", ["M295,198L297,198 297,197 295,197 295,198zM294,195L294,195 293,195 294,195z"]],
	'gr':["", ["M309,145L310,143 310,143 312,142 314,142 315,142 317,142 317,142 317,143 315,143 313,143 314,144 313,144 312,144 312,144 314,147 314,147 314,148 313,147 313,148 313,148 313,148 312,148 313,150 312,149 312,150 311,149 311,149 311,149 311,148 310,147 311,147 312,147 313,147 311,147 310,147zM313,151L313,151 315,152 317,152 317,151z"]],
	'gt':["", ["M165,179L165,179 165,176 163,176 163,177 162,177 163,178 162,178 161,180 162,181 164,181 165,181 166,179z"]],
	'gw':["", ["M263,185L263,185 264,184 264,183 262,183 260,183 261,184 262,184 262,185z"]],
	'gy':["", ["M204,189L202,190 203,190 202,192 203,193 203,193 204,197 205,198 208,197 206,194 207,192z"]],
	'hk':["", ["M432,170L432,170 432,170z"]],
	'hm':["", ["M378,277L379,277 379,277z"]],
	'hn':["", ["M165,181L167,181 167,182 168,183 171,180 173,180 171,179 166,179z"]],
	'hr':["", ["M307,135L306,135 304,134 303,135 302,136 300,136 300,137 306,140 303,137 303,136 307,136z"]],
	'ht':["", ["M188,173L188,176 185,175 185,175 187,175 187,174 186,174 187,173z"]],
	'hu':["", ["M311,131L312,131 311,132 310,134 308,134 307,135 306,135 304,134 304,133 305,132 305,131 305,132 307,132 307,131 309,131z"]],
	'id':["", ["M407,192L410,193 411,194 418,199 418,201 419,201 420,203 421,203 421,204 421,207 419,207 416,205 413,200 412,199 412,198 409,195 409,195zM420,202L421,202 422,203 422,203 422,204 421,203 421,203zM424,203L423,204 424,204 424,203zM421,208L421,209 422,209 422,209 433,211 432,210 431,210 430,209 432,209 428,208 427,209 425,209 424,208zM437,194L434,194 433,198 431,198 430,198 429,198 427,199 426,197 425,198 426,201 426,201 427,204 429,204 429,204 433,204 433,205 435,205 437,198 438,198 436,196zM446,197L447,198 446,199 440,199 440,201 441,202 442,201 444,201 442,203 444,206 444,207 443,207 443,206 442,206 442,206 441,203 440,204 441,207 439,207 439,204 438,204 440,199 441,198 445,199zM433,211L434,210 434,211 434,211zM435,211L435,211 435,211 434,211zM436,211L436,212 438,211zM437,210L438,211 439,211 438,211zM439,211L440,211 443,211 446,210 447,211 442,211zM446,212L446,212 445,214 444,213 445,212zM440,213L441,213 440,212 438,212zM448,204L449,204 449,205 449,205zM450,204L453,204 454,205 451,204 451,204zM451,196L451,197 450,198 450,200 451,201 450,200 450,199 451,199 451,199 450,199 451,198 451,198 450,199 450,198 450,198 450,197zM450,202L450,202 450,202zM446,202L448,202 446,202zM454,201L456,200 458,201 459,203 459,204 460,204 463,202 467,203 467,212 466,210 463,211 464,210 465,209 463,207 458,204 457,205 456,203 458,203 456,203 455,202zM459,207L458,208 458,209 459,208zM455,209L454,210 454,210 455,210z"]],
	'ie':["", ["M274,121L273,120 273,121 272,120 273,119 273,119 271,119 271,120 271,120 271,120 269,120 269,122 270,123 269,124 269,125 274,124 274,123z"]],
	'il':["", ["M328,155L329,154 329,155 329,158 328,160 327,157 328,156z"]],
	'in':["", ["M372,168L376,167 375,165 375,165 374,164 374,164 374,163 375,162 375,162 377,162 380,158 380,157 381,156 380,156 379,153 380,152 382,153 384,151 386,153 386,153 387,155 386,156 386,155 385,156 386,157 389,159 387,161 392,163 393,163 393,163 393,163 394,164 398,164 398,162 399,162 399,163 400,164 403,164 403,163 403,163 403,162 404,162 407,160 408,160 408,160 410,162 410,162 409,163 410,163 409,163 407,164 406,168 405,168 405,170 404,170 403,168 402,169 402,168 404,166 400,166 400,165 398,164 398,165 399,166 398,167 399,167 399,171 397,171 396,172 387,179 388,182 387,184 387,186 386,186 386,187 385,188 385,189 384,189 383,188 382,187 379,179 378,173 378,172 377,170 377,172 375,172 373,170 374,170 374,169 374,169z"]],
	'iq':["", ["M341,149L338,149 337,150 337,150 336,153 333,154 334,156 337,157 341,160 343,160 344,159 346,159 345,157 342,153 343,151 342,150z"]],
	'ir':["", ["M346,159L345,157 342,153 343,151 342,150 341,149 340,145 341,145 342,146 343,146 343,146 345,145 346,147 347,148 350,150 353,149 353,148 356,147 363,149 363,151 362,155 362,157 363,157 363,158 362,159 365,163 365,164 363,164 363,166 357,165 357,163 354,164 350,162 348,159z"]],
	'is':["", ["M251,100L254,101 253,102 258,103 264,99 261,96 256,97 254,99 252,96 250,98 253,99z"]],
	'it':["", ["M292,138L294,137 299,142 303,144 304,146 303,147 303,148 305,145 304,145 305,144 306,145 307,144 304,142 303,142 303,141 302,141 300,139 298,138 298,136 300,135 300,134 298,133 296,133 296,134 295,134 294,135 293,134 293,135 291,135 292,136 291,136 291,137 291,137 292,138zM303,147L302,149 298,148zM295,142L295,144 295,146 293,146 293,143z"]],
	'jm':["", ["M179,175L181,175 182,176 181,176z"]],
	'jo':["", ["M333,154L331,156 329,155 329,158 328,160 328,160 330,160 332,158 331,157 334,156z"]],
	'jp':["", ["M468,136L468,139 466,140 466,142 467,141 467,140 469,140 470,141 473,139 473,137 472,138 469,135zM458,153L459,153 458,154 458,154 457,155 456,154 457,153 457,154 458,153 458,153zM454,153L456,155 455,157 454,158 453,157 454,155 452,154zM467,142L467,142 469,145 467,147 467,151 461,153 461,154 459,153 460,152 456,153 456,153 454,153 454,153 457,151 460,151 461,151 461,151 461,150 462,149 463,149 465,147 466,144 466,143z"]],
	'ke':["", ["M327,194L327,194 329,194 331,194 332,195 334,195 336,194 336,194 337,194 336,196 336,201 337,202 336,203 335,203 335,204 334,206 332,204 332,204 327,201 327,199 328,197z"]],
	'kg':["", ["M379,145L375,145 373,145 373,145 374,144 375,144 375,144 376,144 378,143 376,142 376,142 375,142 376,141 375,141 376,140 379,140 380,139 382,140 386,140 388,141 385,143 383,143 382,144 381,144 379,144 379,145z"]],
	'kh':["", ["M419,186L421,185 422,186 421,184 423,183 423,180 423,181 422,181 422,181 422,181 421,181 420,181 418,181 417,182 417,184 418,185 418,185 418,185 418,185 418,186 418,186 418,186 419,186z"]],
	'kp':["", ["M446,144L449,141 450,142 451,141 453,140 453,140 454,141 452,142 453,143 450,145 450,146 451,146 449,148 446,147 447,145z"]],
	'kr':["", ["M451,146L452,149 452,152 448,153 448,152 449,150 448,149 449,149 449,148z"]],
	'kw':["", ["M346,159L345,160 346,161 345,161 345,161 343,160 344,159z"]],
	'ky':["", ["M174,171L175,171 175,171zM175,171L175,171 175,171z"]],
	'kz':["", ["M356,142L355,142 354,141 352,141 351,142 351,141 352,140 350,140 349,138 348,137 348,137 350,137 349,136 350,136 352,136 352,134 349,133 347,134 343,131 345,127 346,128 346,128 346,127 349,125 351,125 355,127 359,126 361,127 363,127 363,126 361,125 362,124 362,123 363,123 364,123 364,123 363,122 363,121 373,119 375,119 376,121 379,121 379,122 383,120 387,127 389,126 390,127 392,126 395,129 396,129 397,130 395,131 395,133 391,133 390,136 388,136 388,141 386,140 382,140 380,139 379,140 376,140 375,141 373,142 372,143 371,142 370,142 370,141 369,141 369,140 369,140 367,138 364,139 362,137 359,135 356,136z"]],
	'la':["", ["M415,171L414,173 414,173 414,174 415,174 415,176 415,177 416,176 417,176 418,175 420,177 420,178 421,179 421,180 421,181 420,181 421,181 422,181 422,181 422,181 423,181 423,180 424,180 423,179 423,179 420,175 420,175 419,174 420,173 419,172 418,172 417,171 417,171 416,170 416,170 416,170 416,172 415,171z"]],
	'lb':["", ["M329,152L330,152 330,153 329,154 328,155z"]],
	'lc':["", ["M202,181L202,181 202,181z"]],
	'lk':["", ["M387,187L388,188 390,190 390,191 388,192 387,192 387,189 387,187z"]],
	'lr':["", ["M272,194L272,192 271,191 271,190 271,190 270,190 270,190 270,189 269,188 267,191 270,193z"]],
	'ls':["", ["M319,241L321,239 320,238 318,240z"]],
	'lt':["", ["M310,119L310,117 311,117 315,117 317,118 316,121 313,121 312,120 312,119z"]],
	'lu':["", ["M290,128L290,129 291,129 291,128 290,128z"]],
	'lv':["", ["M310,117L311,117 315,117 317,118 319,117 319,115 318,114 317,114 315,113 314,114 314,115 313,116 312,114 310,115z"]],
	'ly':["", ["M315,157L315,170 315,173 314,173 314,174 303,168 302,169 301,170 300,169 298,168 295,165 295,159 296,158 295,157 297,156 297,155 302,156 303,157 307,159 309,157 308,157 311,155 313,155 313,156 315,156z"]],
	'ma':["", ["M279,152L281,156 277,157 277,157 271,161 271,162 265,162 269,160 269,157 271,155 273,153 274,151 275,151 276,151z"]],
	'mc':["", ["M291,139L291,139 291,139z"]],
	'md':["", ["M317,131L319,134 319,134 320,136 321,136 322,134 322,134 320,131 318,131z"]],
	'me':["", ["M309,140L309,140 308,141 306,140 307,139z"]],
	'mg':["", ["M342,234L344,233 349,220 347,215 344,220 341,221 340,223 341,226 339,229 340,231 340,233z"]],
	'mk':["", ["M312,141L312,141 312,142 310,143 309,142 309,141z"]],
	'ml':["", ["M276,166L274,166 275,178 275,178 275,179 268,179 268,180 267,179 266,180 267,183 267,184 270,184 272,186 273,186 274,186 274,186 275,186 275,184 278,181 279,181 280,181 281,180 283,180 284,180 284,179 287,179 288,178 288,174 286,174 284,172z"]],
	'mm':["", ["M403,172L404,171 404,170 405,170 405,168 406,168 407,164 409,163 410,163 409,163 410,162 410,162 411,161 412,163 412,165 410,167 410,168 412,167 412,169 413,169 412,170 414,170 414,171 415,171 414,173 411,174 410,175 411,176 412,178 412,179 412,179 411,180 412,181 413,182 412,182 413,184 412,187 412,185 412,184 412,183 410,177 409,178 408,179 406,178 406,176 406,175 405,174 405,174 404,173z"]],
	'mn':["", ["M398,129L398,130 401,132 402,135 401,135 402,136 405,136 407,137 409,140 415,140 420,142 423,141 426,140 429,138 429,137 429,136 432,137 436,134 439,134 440,133 438,131 434,132 434,131 435,128 432,128 428,129 420,127 418,128 417,127 416,126 412,124 411,126 411,127 411,128 410,128 407,128 406,127 403,127z"]],
	'mq':["", ["M202,180L202,180 202,181 202,180z"]],
	'mr':["", ["M260,171L265,171 265,169 266,168 266,165 271,165 271,163 276,166 274,166 275,178 275,178 275,179 268,179 268,180 267,179 266,180 263,178 261,178 261,176 261,174 261,173z"]],
	'ms':["", ["M200,177L201,177 201,178z"]],
	'mt':["", ["M301,150L301,150 301,151z"]],
	'mw':["", ["M325,212L327,212 328,215 328,218 329,219 329,221 328,222 329,222 327,221 328,220 327,219 326,219 326,218 326,214z"]],
	'mx':["", ["M155,165L152,164 149,159 148,159 147,161 142,157 140,157 140,157 136,157 132,155 128,155 130,159 133,161 132,162 131,162 135,165 135,166 138,169 139,168 132,159 132,156 133,157 135,161 144,171 144,173 146,175 155,179 157,178 158,178 161,180 162,178 163,178 162,177 163,177 163,176 165,176 166,175 167,175 168,171 164,172 163,174 162,175 158,176 157,175 156,175 154,170z"]],
	'my':["", ["M414,191L414,191 415,192 415,192 416,192 416,192 418,193 418,196 418,196 419,198 418,198 418,198 415,196 415,195 414,195zM426,197L427,199 429,198 430,198 431,198 433,198 434,194 437,194 438,194 437,193 439,193 436,190 433,193 434,194 433,193 433,194 433,194 432,194 431,196 429,196 428,198z"]],
	'mz':["", ["M335,214L331,215 328,215 328,218 329,219 329,221 328,222 329,222 327,221 328,220 327,219 326,219 326,218 322,220 322,220 322,221 325,222 325,227 323,230 324,235 324,236 325,236 325,235 325,235 329,232 329,229 328,227 331,223 335,221 336,219z"]],
	'na':["", ["M308,233L308,229 310,229 310,224 313,224 313,224 315,223 314,223 313,223 310,224 307,223 306,223 301,223 299,222 298,223 301,230 302,235 304,238 305,237 305,238 308,239 308,238z"]],
	'nc':["", ["M498,226L499,227 502,230 499,228z"]],
	'ne':["", ["M287,184L286,183 285,184 282,180 284,180 284,179 287,179 288,178 288,174 290,174 292,172 298,168 300,169 301,170 302,169 303,173 303,177 300,181 300,182 299,182 296,182 295,183 293,182 291,183 288,181z"]],
	'ng':["", ["M293,193L296,190 297,191 301,185 301,184 301,183 301,183 301,182 300,182 299,182 296,182 295,183 293,182 291,183 288,181 287,184 287,185 287,186 286,188 286,188 286,191 288,191 290,194z"]],
	'ni':["", ["M168,183L171,180 173,180 172,185 172,185 172,186 171,185 171,185 170,184 169,184 170,185 170,185 167,183z"]],
	'nl':["", ["M290,126L290,125 290,125 291,125 292,122 291,122 290,122 289,123 288,124 287,126 289,125z"]],
	'no':["", ["M297,112L298,112 298,110 299,110 298,108 299,107 298,106 298,103 299,101 301,102 301,101 300,100 301,97 302,97 304,95 303,94 305,93 306,93 306,92 308,92 309,91 309,91 310,90 312,91 314,91 315,92 317,88 319,88 320,89 321,89 320,90 323,89 320,88 322,88 323,87 320,86 319,87 320,86 318,86 317,87 317,86 315,88 316,86 315,86 313,88 312,88 307,88 294,103 289,105 289,108 290,113 292,114 293,113 296,111z"]],
	'np':["", ["M398,162L398,164 394,164 393,163 393,163 393,163 392,163 387,161 389,159 390,159 395,162z"]],
	'nz':["", ["M509,247L512,252 511,254 510,254 512,256 512,257 513,258 517,252 515,252 513,251zM509,256L510,257 511,257 511,258 509,261 509,261 507,262 505,266 501,265 501,264 507,260 507,258 508,257 508,257z"]],
	'om':["", ["M356,165L356,164 356,164 356,165zM356,166L356,166 356,168 355,168 355,170 355,170 354,173 350,175 352,178 358,175 361,170z"]],
	'pa':["", ["M174,187L173,189 175,189 176,190 177,190 177,189 178,188 179,189 179,189 180,190 181,189 181,188 179,187 178,187 176,188z"]],
	'pe':["", ["M177,204L177,206 178,206 178,206 180,204 182,203 183,201 183,200 185,201 186,203 188,203 190,203 189,205 190,205 189,205 187,206 186,208 185,210 188,213 190,212 190,214 191,214 192,216 191,220 190,220 190,221 191,221 192,222 191,223 190,224 182,218 182,218 177,209 176,207 176,205z"]],
	'pg':["", ["M467,212L467,203 473,206 474,207 476,208 476,209 475,209 477,212 478,212 480,214 476,213 474,210 472,210 470,212zM477,207L479,208 482,207 482,205 481,205 481,206 480,207zM483,206L483,205 480,203 483,205zM485,207L487,208 487,209 486,208z"]],
	'ph':["", ["M441,175L443,175 443,178 442,179 443,181 445,182 445,183 442,181 441,182 440,178 440,178zM440,182L442,182 442,184zM444,184L444,183 445,184 444,184zM442,184L444,184 443,186zM443,187L444,185 444,187 445,185 445,186 444,188zM445,183L447,183 447,185zM446,185L446,185 447,186zM445,186L445,187 446,187zM439,185L439,186 436,189 439,186zM447,186L447,188 445,189 445,188 443,189 442,191 443,190 444,190 445,189 445,190 445,191 447,192 447,191 447,191 448,190 448,191 449,189zM442,191L443,191 443,191z"]],
	'pk':["", ["M363,166L363,164 365,164 365,163 362,159 364,160 366,160 369,159 369,158 372,157 373,157 373,156 374,155 375,154 374,153 375,153 376,153 375,153 376,152 376,150 376,150 378,149 379,149 381,149 382,149 382,151 384,151 382,153 380,152 379,153 380,156 381,156 380,157 380,158 377,162 375,162 375,162 374,163 374,164 374,164 375,165 375,165 376,167 372,168 371,168 370,166z"]],
	'pl':["", ["M301,121L306,120 307,120 312,120 313,121 314,123 313,124 313,124 313,125 314,127 312,129 312,130 312,130 307,129 307,128 302,126 301,124 301,123 301,123z"]],
	'pr':["", ["M194,175L194,176 196,176 196,175z"]],
	'pt':["", ["M271,141L274,142 273,145 272,149 270,149 271,147 270,146 271,142z"]],
	'py':["", ["M200,229L201,226 205,225 206,226 206,229 209,229 210,232 211,232 211,234 210,236 209,237 205,236 207,234 203,232z"]],
	'qa':["", ["M350,167L349,167 349,165 350,165 350,165 350,166z"]],
	'ro':["", ["M312,131L311,132 310,134 309,134 312,138 312,138 316,138 318,138 320,138 320,137 321,137 321,136 320,136 319,134 319,134 317,131 315,132z"]],
	'rs':["", ["M309,134L312,138 312,138 312,139 312,141 309,141 309,140 309,140 307,139 307,136 307,135 308,134z"]],
	'ru':["", ["M307,120L310,119 312,119 312,120zM319,111L318,112 319,114 318,114 319,115 319,117 323,118 323,120 325,122 324,122 324,124 327,124 327,126 328,126 329,127 330,128 331,127 335,129 334,132 333,132 332,133 334,133 332,134 333,134 331,136 330,136 330,136 335,139 335,139 342,140 342,141 343,141 345,142 346,141 344,137 345,135 346,135 347,134 343,131 345,127 346,128 346,128 346,127 349,125 351,125 355,127 359,126 361,127 363,127 363,126 361,125 362,124 362,123 363,123 364,123 364,123 363,122 363,121 373,119 375,119 376,121 379,121 379,122 383,120 387,127 389,126 390,127 392,126 395,129 396,129 397,130 398,129 403,127 406,127 407,128 410,128 411,128 411,127 411,126 412,124 416,126 417,127 418,128 420,127 428,129 432,128 435,128 437,129 441,125 441,124 440,124 440,123 441,122 444,122 448,123 450,128 453,129 454,132 459,131 457,136 455,136 454,137 454,140 454,140 454,141 456,139 457,140 460,138 466,131 468,122 465,120 463,122 460,119 470,111 486,111 485,110 489,106 493,106 493,108 498,104 498,105 497,108 488,114 487,118 488,126 495,120 495,117 497,117 496,114 495,114 499,110 507,109 515,104 517,105 518,104 515,100 518,100 520,97 528,101 532,97 526,95 526,96 525,94 513,89 506,88 507,91 505,91 504,88 494,90 491,86 482,87 477,83 467,81 466,85 458,85 457,84 454,87 451,81 444,79 443,81 431,79 422,81 432,75 431,73 428,71 423,72 423,71 419,68 408,74 400,74 395,77 396,79 388,80 389,83 392,84 388,83 384,82 382,84 385,86 381,85 381,82 378,85 380,87 379,90 383,91 380,92 380,94 377,97 374,96 377,95 379,92 378,86 378,81 375,80 372,84 370,89 373,91 372,92 365,89 361,88 362,91 360,91 360,91 352,91 345,94 345,95 342,95 343,93 340,92 340,95 340,97 337,96 334,98 335,100 331,99 330,100 332,101 332,102 328,101 328,97 325,95 325,95 329,97 333,97 335,97 337,95 336,94 330,90 323,89 320,90 319,91 320,91 320,92 320,93 322,94 320,95 322,98 321,98 321,99 322,101 322,102 324,104 323,105 319,109 322,110 319,110zM346,89L345,91 347,91 348,90zM357,87L350,85 356,76 363,73 370,71 373,71 372,73 362,75 358,79 355,83 356,85 358,86zM416,64L413,68 420,67zM413,62L413,65 405,63zM405,62L410,61 411,60 408,58 402,62zM469,122L469,134 470,134 470,131 471,129 472,129 470,121z"]],
	'rw':["", ["M322,201L322,202 321,201 320,203 320,203 323,203z"]],
	'sa':["", ["M346,161L345,161 345,161 343,160 341,160 337,157 334,156 331,157 332,158 330,160 328,160 328,162 328,162 332,167 333,168 334,170 333,170 335,173 336,173 338,178 339,178 339,177 339,177 344,177 344,177 345,176 350,175 354,173 355,170 355,170 351,169 350,167 350,167 349,167 348,165 348,164 346,163z"]],
	'sb':["", ["M488,208L489,209 489,209zM490,210L492,211 492,211zM492,212L493,212 493,213 492,213zM493,211L493,211 494,212 493,212zM494,213L495,213 495,214zM488,210L489,210 490,211 489,211z"]],
	'sd':["", ["M312,185L311,183 313,179 314,179 314,174 314,173 315,173 315,170 326,170 327,171 329,169 331,170 331,175 333,176 331,177 330,181 328,186 327,185 327,189 326,189 326,189 329,193 329,194 327,194 327,194 326,195 323,195 318,193z"]],
	'se':["", ["M297,112L299,116 299,117 299,119 301,118 301,117 303,117 304,112 307,110 306,109 305,108 305,106 307,104 311,101 310,100 312,98 314,98 313,93 309,91 309,91 308,92 306,92 306,93 305,93 303,94 304,95 302,97 301,97 300,100 301,101 301,102 299,101 298,103 298,106 299,107 298,108 299,110 298,110 298,112z"]],
	'sg':["", ["M418,198L418,198 419,198 419,198z"]],
	'si':["", ["M300,135L300,134 301,134 304,133 304,134 303,135 302,136 300,136z"]],
	'sk':["", ["M307,129L312,130 311,131 309,131 307,131 307,132 305,132 305,131 305,130z"]],
	'sl':["", ["M267,191L269,188 268,189 268,188 268,187 266,187 265,188 265,189 266,190z"]],
	'sn':["", ["M260,183L262,183 264,183 267,183 266,180 263,178 261,178 260,179 259,180 260,182 263,181 264,182 264,182 262,182 260,182z"]],
	'so':["", ["M337,194L340,193 341,193 345,189 344,189 340,188 338,186 339,185 339,185 340,186 341,186 349,184 350,186 347,191 345,194 343,197 339,199 337,202 336,201 336,196z"]],
	'sr':["", ["M207,192L206,194 208,197 211,197 211,195 211,193 211,192z"]],
	'sv':["", ["M165,181L167,181 167,182 164,181z"]],
	'sy':["", ["M329,150L330,150 330,149 333,149 338,149 337,150 337,150 336,153 333,154 331,156 329,155 329,154 330,153 330,152 329,152z"]],
	'sz':["", ["M324,235L323,234 323,235 323,236 324,236 324,236z"]],
	'td':["", ["M302,169L303,168 314,174 314,179 313,179 311,183 312,185 307,189 303,190 301,187 301,186 303,186 302,185 302,184 301,182 301,182 300,182 300,181 303,177 303,173z"]],
	'tf':["", ["M373,269L374,270 375,270 374,271 373,271z"]],
	'tg':["", ["M285,191L284,187 283,186 283,185 282,185 282,186 283,186 283,191 284,192z"]],
	'th':["", ["M417,184L417,182 418,181 420,181 421,181 421,180 421,179 420,178 420,177 418,175 417,176 416,176 415,177 415,176 415,174 414,174 414,173 414,173 411,174 410,175 411,176 412,178 412,179 412,179 411,180 412,181 413,182 412,182 413,184 412,187 411,190 412,189 414,191 414,191 415,192 415,192 416,192 416,192 415,191 415,191 414,190 413,188 413,188 412,186 414,184 414,182 415,182 415,183 416,183z"]],
	'tj':["", ["M373,149L371,149 372,147 372,146 371,145 371,145 372,145 375,143 375,143 375,144 375,144 375,144 374,144 373,145 373,145 375,145 379,145 379,146 380,147 381,149 380,148 378,148 376,149 376,149 376,147 376,147 376,147 375,147z"]],
	'tl':["", ["M446,212L447,211 449,211 449,211 446,212z"]],
	'tm':["", ["M353,148L356,147 363,149 363,151 364,152 369,148 370,148 370,147 364,144 363,142 361,142 361,141 359,140 357,141 357,142 356,142 355,142 354,141 352,141 351,142 352,142 352,141 352,141 353,141 354,143 353,143 352,143 352,142 351,144 352,144 352,145 352,145 353,145z"]],
	'tn':["", ["M297,155L297,156 295,157 296,158 295,159 294,156 292,154 293,152 293,149 295,148 296,149 297,149 296,150 297,152 295,153z"]],
	'to':["", ["M525,228L525,228 525,228z"]],
	'tr':["", ["M319,141L317,142 317,143 317,143 319,143 320,143 321,143 319,144 318,144 317,144 317,144 317,145 317,145 318,147 317,147 319,148 318,149 321,150 322,150 322,149 324,150 325,150 327,150 328,149 329,150 329,149 330,149 329,150 329,150 330,150 330,149 333,149 338,149 341,149 340,145 341,145 340,144 339,142 338,142 337,142 335,143 333,143 330,142 328,141 326,141 323,142 323,143 320,142 319,142z"]],
	'tt':["", ["M201,186L202,186 201,185 202,185 202,186zM202,185L203,185 203,185z"]],
	'tw':["", ["M441,166L442,166 441,171 440,169 440,168z"]],
	'tz':["", ["M334,206L332,204 332,204 327,201 326,202 327,203 326,203 324,203 324,201 322,201 323,203 323,204 321,206 322,207 321,208 322,208 323,211 325,212 327,212 328,215 331,215 335,214 334,213 334,211 334,209 333,208z"]],
	'ua':["", ["M324,124L323,124 322,126 315,125 313,125 314,127 312,129 312,130 312,130 311,131 312,131 315,132 317,131 318,131 320,131 322,134 322,134 323,134 326,135 325,136 326,136 326,137 327,137 330,136 330,136 329,136 328,135 329,134 332,133 333,132 334,132 335,129 331,127 330,128 329,127 328,126 327,126 327,124z"]],
	'ug':["", ["M323,195L326,195 327,194 328,197 327,199 326,199 324,200 324,201 322,201 322,202 321,201 321,200 323,197 323,196z"]],
	'us':["", ["M128,155L132,155 136,157 140,157 140,157 142,157 147,161 148,159 149,159 152,164 155,165 154,163 158,160 162,160 163,161 166,159 169,159 170,160 172,159 174,161 173,162 176,166 177,166 177,164 175,158 176,156 183,151 182,147 183,148 185,145 185,143 190,141 189,140 190,138 194,136 193,135 193,133 191,132 188,136 184,136 182,137 182,139 181,139 178,139 179,140 178,140 175,142 173,142 173,141 174,139 173,138 172,138 173,136 171,135 169,137 169,139 169,140 168,141 167,142 167,139 168,135 170,134 171,135 172,135 171,134 171,133 168,134 166,133 166,132 165,133 161,133 164,131 157,130 121,130 121,131 118,131 119,134 119,137 119,140 119,142 119,144 124,152 127,154zM111,120L112,117 104,110 102,112 97,109 97,89 76,85 64,91 64,92 71,96 70,97 67,97 67,96 62,98 64,100 68,100 71,100 71,102 68,104 66,103 64,106 66,108 65,109 68,110 69,109 70,111 70,112 72,112 73,113 76,112 75,114 66,120 66,120 73,117 81,112 80,111 84,107 83,111 88,110 88,108 90,108 93,110 98,110 98,110 99,111 103,113 105,117 106,116 108,120 109,119z"]],
	'uy':["", ["M212,246L212,245 212,244 208,240 207,241 205,246 208,247 211,247z"]],
	'uz':["", ["M371,149L370,148 370,147 364,144 363,142 361,142 361,141 359,140 357,141 357,142 356,142 356,136 359,135 362,137 364,139 367,138 369,140 369,140 369,141 370,141 370,142 371,142 372,143 373,142 375,141 376,141 375,142 376,142 376,142 378,143 376,144 375,144 375,144 375,143 375,143 372,145 371,145 371,145 372,146 372,147z"]],
	'vc':["", ["M202,182L202,182 202,182 202,182z"]],
	've':["", ["M188,184L186,188 188,190 190,190 191,192 194,191 193,194 194,195 193,196 194,197 194,198 196,199 199,197 198,196 197,194 200,195 203,193 203,193 202,192 203,190 202,190 204,189 202,188 202,187 200,186 197,186 195,186 193,186 191,184 188,185 189,187 188,188 187,187 188,186z"]],
	'vn':["", ["M424,171L422,170 422,169 421,169 418,170 417,169 416,170 417,171 417,171 418,172 419,172 420,173 419,174 420,175 420,175 423,179 423,179 424,180 423,180 423,183 421,184 422,186 421,185 419,186 420,187 420,189 425,185 426,183 425,180 421,175 421,173z"]],
	'vu':["", ["M501,219L501,220 502,220zM502,221L502,222 503,221z"]],
	'wa':["", ["M528,217L529,217 529,218 528,218zM529,218L529,218 530,218z"]],
	'wf':["", ["M521,218L521,219 521,219z"]],
	'ye':["", ["M338,178L339,178 339,177 339,177 344,177 344,177 345,176 350,175 352,178 351,178 351,179 340,183z"]],
	'za':["", ["M325,236L324,236 324,236 323,236 323,235 323,234 324,235 323,230 321,229 318,231 316,234 313,234 311,236 309,236 309,235 310,235 308,233 308,238 308,239 305,238 305,237 304,238 306,244 306,244 308,247 311,247 316,246 321,242 325,238z"]],
	'zm':["", ["M313,223L311,221 311,217 314,217 314,214 314,214 314,215 315,215 316,215 318,216 318,215 321,217 321,217 321,216 320,216 319,215 320,214 320,212 320,211 322,210 322,211 323,211 323,211 325,212 326,214 326,218 322,220 322,220 320,221 320,222 318,223 315,223 314,223z"]],
	'zw':["", ["M323,230L325,227 325,222 322,221 322,220 320,221 320,222 318,223 315,223 319,228 321,229z"]]
};

if (!cChartElement.useVML) {
	cChartElement_map.prototype._onMouseOver	= function(oElementDOM) {
		if (oElementDOM.parentNode == this.$getContainer("underlay"))
			oElementDOM.setAttribute("class", oElementDOM.getAttribute("class").replace(/(c-item--underlay_hover)?$/, " c-item--underlay_hover"));
	};

	cChartElement_map.prototype._onMouseOut	= function(oElementDOM) {
		if (oElementDOM.parentNode == this.$getContainer("underlay"))
			oElementDOM.setAttribute("class", oElementDOM.getAttribute("class").replace(/ c-item--underlay_hover/, ""));
	};

	cChartElement_map.prototype.$getTagOpen	= function() {
		return '<div class="c-map' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
					<svg:svg class="c-map--canvas" viewBox="0 0 600 300" width="600px" height="300px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" onmouseover="ample.$instance(this)._onMouseOver(evt.target)" onmouseout="ample.$instance(this)._onMouseOut(evt.target)">\
						<svg:text class="c-map--title" y="30" x="300">' + this.getAttribute("title")+ '</svg:text>\
						<svg:rect x="20" y="180" width="120" height="100" rx="10" class="c-legend"/>\
						<svg:g class="c-map--underlay">' +
							(function() {
								var aCountries	= [];
								for (var sCountry in cChartElement_map.countries)
									aCountries.push('<svg:path class="c-item--underlay" d="' + cChartElement_map.countries[sCountry][1] + '" />');
								return aCountries.join('');
							})() + '\
						</svg:g>\
						<svg:g class="c-map--gateway">';
	};

	cChartElement_map.prototype.$getTagClose	= function() {
		return '		</svg:g>\
					</svg:svg>\
				</div>';
	};
}
else {
		(function() {
		var fHandler	= cChartElement_map.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_map.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			fHandler.call(this, oEvent);
						cChartElement_map.recalcCSS(this);
						var that	= this;
			setTimeout(function() {
				var oCanvas	= that.$getContainer("canvas");
				if (oCanvas)
					oCanvas.style.display	= "";
			});
		};
	})();

	cChartElement_map.recalcCSS	= function(oElement) {
		var oElementDOM	= oElement.$getContainer("underlay");
		for (var nIndex = 0, nLength = oElementDOM.childNodes.length; nIndex < nLength; nIndex++)
			cChartElement.applyCSS(oElementDOM.childNodes[nIndex]);
		cChartElement.applyCSS(oElement.$getContainer("title"));
		cChartElement.applyCSS(oElement.$getContainer("legend"));
	};

	cChartElement_map.prototype._onMouseOver	= function(oElementDOM) {
		if (oElementDOM.parentNode == this.$getContainer("underlay")) {
			oElementDOM.className	= oElementDOM.className.replace(/(c-item--underlay_hover)?$/, " c-item--underlay_hover");
			cChartElement.applyCSS(oElementDOM);
		}
	};

	cChartElement_map.prototype._onMouseOut	= function(oElementDOM) {
		if (oElementDOM.parentNode == this.$getContainer("underlay")) {
			oElementDOM.className	= oElementDOM.className.replace(/ c-item--underlay_hover/, "");
			cChartElement.applyCSS(oElementDOM);
		}
	};

	cChartElement_map.prototype.$getTagOpen	= function() {
		return '<div class="c-map' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;width:600px;height:300px;' + this.getAttribute("style") + '">\
					<chart2vml:group class="c-map--canvas" style="position:absolute;width:600px;height:300px;display:none;" coordOrigin="0 0" coordSize="600 300">\
						<chart2vml:shape class="c-map--title" path="m0,0 l600,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + this.getAttribute("title")+ '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:roundrect style="left:20px;top:180px;width:120px;height:100px" rx="10" class="c-legend c-map--legend" filled="true"/>\
						<chart2vml:group class="c-map--underlay" style="position:absolute;width:100%;height:100%;" onmouseover="ample.$instance(this)._onMouseOver(event.srcElement)" onmouseout="ample.$instance(this)._onMouseOut(event.srcElement)">' +
						(function() {
							var aCountries	= [];
							for (var sCountry in cChartElement_map.countries)
								aCountries.push('<chart2vml:shape class="c-item--underlay" path="' + cChartElement.convert(cChartElement_map.countries[sCountry][1][0]) + '" style="position:absolute;width:100%;height:100%;" />');
							return aCountries.join('');
						})() + '\
						</chart2vml:group>\
						<chart2vml:group class="c-map--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_map.prototype.$getTagClose	= function() {
		return '		</chart2vml:group>\
					</chart2vml:group>\
				</div>';
	};
}

oChartNamespace.setElement("map", cChartElement_map);


var cChartElement_pie	= function(){};
cChartElement_pie.prototype	= new cChartElement;

cChartElement_pie.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		this.refresh();
	}
};

cChartElement_pie.prototype.refresh	= function() {
		var nSumAll	= 0;
	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++)
		nSumAll	+= oElement.getAttribute("value") * 1;

	var nSumUp	= 0,
		cX	= 150,
		cY	= 150,
		nWidth	= 100;

	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++) {
				var	nAngleFrom	=-Math.PI / 2 + 2 * Math.PI * nSumUp / nSumAll,
			nAngleTo	=-Math.PI / 2 + 2 * Math.PI *(nSumUp + oElement.getAttribute("value") * 1) / nSumAll;

		var d	= [];
				d.push("M" + cX + "," + cY);
				d.push("L" + (cX + nWidth * Math.cos(nAngleFrom)) + "," +(cY + nWidth * Math.sin(nAngleFrom)));
				d.push("A" + nWidth + "," + nWidth + " 0 " + (nAngleTo - nAngleFrom >= Math.PI ? 1 : 0)+ ",1 " + (cX + nWidth * Math.cos(nAngleTo)) + "," +(cY + nWidth * Math.sin(nAngleTo)));
				d.push("L" + cX + "," + cY);

		cChartElement.setPath(oElement.$getContainer("path"), d.join('') + "z");
		

				nSumUp	+= oElement.getAttribute("value") * 1;
	}
};

if (!cChartElement.useVML) {
	cChartElement_pie.prototype.$getTagOpen	= function() {
		return '<div class="c-pie' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
					<svg:svg class="c-pie--canvas" viewBox="0 0 300 300" width="300px" height="300px" xmlns:svg="http://www.w3.org/2000/svg">\
						<svg:text class="c-doughnut--title" y="30" x="150">' + this.getAttribute("title")+ '</svg:text>\
						<svg:g class="c-pie--gateway">';
	};

	cChartElement_pie.prototype.$getTagClose	= function() {
		return '		</svg:g>\
					</svg:svg>\
				</div>';
	};
}
else {
		(function() {
		var fHandler	= cChartElement_pie.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_pie.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			fHandler.call(this, oEvent);
						cChartElement_pie.recalcCSS(this);
						var that	= this;
			setTimeout(function() {
				var oCanvas	= that.$getContainer("canvas");
				if (oCanvas)
					oCanvas.style.display	= "";
			});
		};
	})();

	cChartElement_pie.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("title"));
	};

	cChartElement_pie.prototype.$getTagOpen	= function() {
		return '<div class="c-pie' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;width:300px;height:300px;' + this.getAttribute("style") + '">\
					<chart2vml:group class="c-pie--canvas" style="position:absolute;width:300px;height:300px;display:none;" coordOrigin="0 0" coordSize="300 300">\
						<chart2vml:shape class="c-pie--title" path="m0,0 l300,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + this.getAttribute("title")+ '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:group class="c-pie--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_pie.prototype.$getTagClose	= function() {
		return '		</chart2vml:group>\
					</chart2vml:group>\
				</div>';
	};
}

oChartNamespace.setElement("pie", cChartElement_pie);


var cChartElement_radar	= function(){};
cChartElement_radar.prototype	= new cChartElement;

cChartElement_radar.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		this.refresh();
	}
};

cChartElement_radar.prototype.refresh	= function() {
		var d	= [];

		for (var n = 0, l = 5; n < l; n++) {
		d.push(	"M150," + (150 - 100 * (n + 1) / l) +
				"A" + 100 * (n + 1) / l + "," + 100 * (n + 1) / l + " 0 0,0 150," + (150 + 100 * (n + 1) / l) +
				"A" + 100 * (n + 1) / l + "," + 100 * (n + 1) / l + " 0 0,0 150," + (150 - 100 * (n + 1) / l) +
				"z");
	}

		for (var n = 0, l = 5; n < l; n++)
		d.push(	"M150,150" +
				"L" + (150 - 100 * Math.cos(Math.PI / 2 + 2 * Math.PI * n / l)) + "," + (150 - 100 * Math.sin(Math.PI / 2 + 2 * Math.PI * n / l))+
				"z");
	cChartElement.setPath(this.$getContainer("grid"), d.join(''));

		var d	= [];
	for (var n = 0, l = 5; n < l; n++)
		d.push(	"M" + (150 - 100 * Math.cos(Math.PI / 2 + 2 * Math.PI * n / l)) + "," + (150 - 100 * Math.sin(Math.PI / 2 + 2 * Math.PI * n / l))+
				"L" + (150 -(100 + 5) * Math.cos(Math.PI / 2 + 2 * Math.PI * n / l)) + "," + (150 -(100 + 5) * Math.sin(Math.PI / 2 + 2 * Math.PI * n / l))+
				"z");
	cChartElement.setPath(this.$getContainer("rAxisMarks"), d.join(''));

		var nSize	= 3;
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
		d	= [];
		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem; oItem = oGroup.childNodes[nItem]; nItem++) {
			var nValue	= oItem.getAttribute("value") * 1 * 2,
				nX	= (150 - nValue * Math.cos(Math.PI / 2 + 2 * Math.PI * nItem / nItems)),
				nY	= (150 - nValue * Math.sin(Math.PI / 2 + 2 * Math.PI * nItem / nItems));
						cChartElement.setPath(oItem.$getContainer("path"),	"M" + (nX - nSize) + "," + nY +
																"a" + nSize + "," + nSize + " 0 0,0 " + nSize * 2 + ",0 " +
																"a" + nSize + "," + nSize + " 0 0,0-" + nSize * 2 + ",0 " +
																"z");
						d.push((nItem ? "L" : "M") + nX + "," + nY);
		}
		cChartElement.setPath(oGroup.$getContainer("line"), d.join(" ") + "z");
		cChartElement.setPath(oGroup.$getContainer("shadow"), d.join(" ") + "z");
		cChartElement.setPath(oGroup.$getContainer("area"), d.join(" ") + "z");

				var nXPath	= 280,
			nYPath	=(50 + (nGroups - nGroup) * 20);
		cChartElement.setPath(oGroup.$getContainer("path"), "M" + (nXPath - 5) + "," + (nYPath - 5) + "h10 v10 h-10 v-10 z");
		cChartElement.setTextPosition(oGroup.$getContainer("label"),
										nXPath + 20, nYPath + 5);
	}
};

if (!cChartElement.useVML) {
	cChartElement_radar.prototype.$getTagOpen	= function() {
		return '<div class="c-radar' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
					<svg:svg class="c-radar--canvas" viewBox="0 0 400 300" width="400px" height="300px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
						<svg:text class="c-radar--title" y="30" x="150">' + this.getAttribute("title")+ '</svg:text>\
						<svg:rect x="260" y="50" width="120" height="120" rx="10" class="c-legend"/>\
						<svg:path class="c-grid c-radar--grid"/>\
						<svg:g class="c-rAxis">\
							<svg:path class="c-radar--rAxis" d="m150,150 v-100" style="fill:none"/>\
							<svg:path id="r' + this.uniqueID + '" d="M140,150 v-150" style="fill:none;stroke:none"/>\
							<svg:text class="c-rAxis--label c-radar--rAxisLabel"><svg:textPath xlink:href="#r' + this.uniqueID + '">' + this.getAttribute("rAxisLabel")+ '</svg:textPath></svg:text>\
							<svg:path class="c-rAxis--marks c-radar--rAxisMarks" />\
						</svg:g>\
						<svg:g class="c-radar--gateway">';
	};

	cChartElement_radar.prototype.$getTagClose	= function() {
		return '		</svg:g>\
					</svg:svg>\
				</div>';
	};
}
else {
		(function() {
		var fHandler	= cChartElement_radar.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_radar.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			fHandler.call(this, oEvent);
						cChartElement_radar.recalcCSS(this);
						var that	= this;
			setTimeout(function() {
				var oCanvas	= that.$getContainer("canvas");
				if (oCanvas)
					oCanvas.style.display	= "";
			});
		};
	})();

	cChartElement_radar.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("title"));
		cChartElement.applyCSS(oElement.$getContainer("legend"));
		cChartElement.applyCSS(oElement.$getContainer("grid"));
		cChartElement.applyCSS(oElement.$getContainer("rAxis"));
		cChartElement.applyCSS(oElement.$getContainer("rAxisMarks"));
		cChartElement.applyCSS(oElement.$getContainer("rAxisLabel"));
	};

	cChartElement_radar.prototype.$getTagOpen	= function() {
		return '<div class="c-radar' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;width:400px;height:300px;' + this.getAttribute("style") + '">\
					<chart2vml:group class="c-radar--canvas" style="position:absolute;width:400px;height:300px;display:none;" coordOrigin="0 0" coordSize="400 300">\
						<chart2vml:shape class="c-radar--title" path="m0,0 l300,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + this.getAttribute("title")+ '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:roundrect style="left:260px;top:50px;width:120px;height:120px" rx="10" class="c-legend c-radar--legend" filled="true"/>\
						<chart2vml:shape class="c-grid c-radar--grid" style="position:absolute;width:100%;height:100%" fillcolor="black"/>\
						<chart2vml:group class="c-rAxis" style="position:absolute;width:100%;height:100%">\
							<chart2vml:shape class="c-radar--rAxis" path="m150,150 v-100" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:shape class="c-rAxis--label c-radar--rAxisLabel" path="m140,150 r0,-100 e" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
								<chart2vml:path textpathok="true" />\
								<chart2vml:textpath on="true" string="' + this.getAttribute("rAxisLabel")+ '" style="v-text-align:right"/>\
							</chart2vml:shape>\
							<chart2vml:shape class="c-rAxis--marks c-radar--rAxisMarks" stroked="true" filled="false" style="position:absolute;width:100%;height:100%" />\
						</chart2vml:group>\
						<chart2vml:group class="c-radar--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_radar.prototype.$getTagClose	= function() {
		return '		</chart2vml:group>\
					</chart2vml:group>\
				</div>';
	};
}

oChartNamespace.setElement("radar", cChartElement_radar);


var cChartElement_stream	= function(){};
cChartElement_stream.prototype	= new cChartElement;

oChartNamespace.setElement("stream", cChartElement_stream);

})()
