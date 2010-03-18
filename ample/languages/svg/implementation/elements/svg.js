/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_svg	= function(){};
cSVGElement_svg.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE

	// handlers
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
			// Hiding SVG content initially and showing it after timeout improves performance!
			var that	= this;
			setTimeout(function() {
				var oGroup	= that.$getContainer("gateway");
				if (oGroup)
					oGroup.style.display	= "";

				// Dispatch onload event
				var oEventLoad	= that.ownerDocument.createEvent("Event");
				oEventLoad.initEvent("load", false, false);
				that.dispatchEvent(oEventLoad);
			}, 0);
			// Resize synchronously
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
//		oElementGroup.coordSize.value	= aBox[3][0] + ',' + aBox[3][1];
	};

	cSVGElement_svg.getBox	= function(oInstance) {
		var aViewBox= oInstance.getAttribute("viewBox").split(/[\s,]/),
			aWidth	= oInstance.getAttribute("width").match(/([\d.]+)([%\w]*)/),
			aHeight	= oInstance.getAttribute("height").match(/([\d.]+)([%\w]*)/);

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

		var oBCRect		= aWidth[2] == "%" || aHeight[2] == "%" ? oInstance.getBoundingClientRect() : {},
			sWidthOuter	= aWidth[1] + (aWidth[2] || "px"),
			sHeightOuter= aHeight[1] + (aHeight[2] || "px");
			nWidthInner	= aWidth[2] == "%" ? oBCRect.right - oBCRect.left : aWidth[1],
			nHeightInner= aHeight[2] == "%" ? oBCRect.bottom - oBCRect.top : aHeight[1],
			nRatio	= (aViewBox[2] / aViewBox[3]) / (nWidthInner / nHeightInner),
			nLeft	= 0,
			nTop	= 0;

		// Correct viewport
		if (nRatio > 1) {
			nTop	= (nHeightInner - (nHeightInner / nRatio)) / 2;
			nHeightInner	/= nRatio;
		}
		else
		if (nRatio < 1) {
			nLeft	= (nWidthInner - (nWidthInner * nRatio)) / 2;
			nWidthInner 	*= nRatio;
		}

		// account for min-x, min-y
		if (aViewBox[0])
			nLeft	-= (aViewBox[0] / aViewBox[2]) * nWidthInner;
		if (aViewBox[1])
			nTop	-= (aViewBox[1] / aViewBox[3]) * nHeightInner;

		var sWidthUnit	= aWidth[2] == "%" || !aWidth[2] ? "px" : aWidth[2],
			sHeightUnit	= aHeight[2] == "%" || !aHeight[2] ? "px" : aHeight[2];

		return [
		        [nLeft + sWidthUnit, nTop + sHeightUnit],
		        [nWidthInner + sWidthUnit, nHeightInner + sHeightUnit],
		        [sWidthOuter, sHeightOuter]/*,
		        [aViewBox[2], aViewBox[3]]*/
		];
	};

	// presentation
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
	// handlers
	cSVGElement_svg.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var that	= this;
			setTimeout(function() {
				// Dispatch onload event
				var oEventLoad	= that.ownerDocument.createEvent("Event");
				oEventLoad.initEvent("load", false, false);
				that.dispatchEvent(oEventLoad);
			});
		}
	};
}


// Register Element with language
oSVGNamespace.setElement("svg", cSVGElement_svg);
