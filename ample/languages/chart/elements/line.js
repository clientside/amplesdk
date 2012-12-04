/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_line	= function(){};
cChartElement_line.prototype	= new cChartElement("line");

cChartElement_line.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		this.refresh();
	}
};

cChartElement_line.prototype.refresh	= function() {
	var bArea	= this.getAttribute("area") == "true";

	// Collect and pre-analyze data
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
			aValue	=(oItem.getAttribute("value") || '').split(',');
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
			//
			if (aYSumAll.length < nItem + 1)
				aYSumAll[nItem]	= 0;
			aYSumAll[nItem]	+= nY;
			//
			if (aYSumAll[nItem] > nYSumMax)
				nYSumMax	= aYSumAll[nItem];
			if (aYSumAll[nItem] < nYSumMin)
				nYSumMin	= aYSumAll[nItem];
		}
		aData.push(aGroup);
	}

	// Draw grid
	var d	= [];
	for (var x = 1; x < 8; x++)
		d.push("M" + (50 + x * 50) + ",50 v200 z ");
	for (var y = 1; y < 4; y++)
		d.push("M50," + (250 - y * 50) + "h400 z ");
	cChartElement.setPath(this.$getContainer("grid"), d.join(''));

	var aYSumUp	=[],
		nYFromPrev	= 250,
		nYToPrev	= 250,
		dPrev	= [];
	// Draw lines
	for (var nGroup = 0, nGroups = aData.length, oGroup; nGroup < nGroups; nGroup++) {
		// Get DOM element
		oGroup	= this.childNodes[nGroup];

		// Draw points
		var nXFrom, nYFrom,
			nXTo, nYTo,
			nX, nY,
			d	= [];
		for (var nItem = 0, nItems = aData[nGroup].length; nItem < nItems; nItem++) {
			//
			if (aYSumUp.length < nItem + 1)
				aYSumUp[nItem]	= 0;
			//
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

			//
			if (!bArea)
				cChartElement.setPath(oGroup.childNodes[nItem].$getContainer("path"), cChartElement_line.getMarkerPath(nX, nY, nGroup));
			//
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

		// Draw line
		cChartElement.setPath(oGroup.$getContainer("line"), "M" + nXFrom + "," + nYFrom + " L" + d.join(''));
		cChartElement.setPath(oGroup.$getContainer("shadow"), "M" + nXFrom + "," + nYFrom + " L" + d.join(''));
		if (bArea)
			cChartElement.setPath(oGroup.$getContainer("area"), "M" + nXFrom + "," + nYFromPrev + " L" + d.join('') + (this.hasAttribute("type") ? dPrev.reverse().join('') : '') + " L" + nXTo + "," + nYToPrev + "z");

		// Draw legend
		var nXPath	= 480,
			nYPath	=(50 + (nGroups - nGroup) * 20),
			sLine	= this.getAttribute("area") == "true" ? "h20" : " h7 z M" + (nXPath + 10) + "," + nYPath + " h-7";
		cChartElement.setPath(oGroup.$getContainer("path"), "M" + (nXPath - 10) + "," + nYPath + sLine + "z" + (this.getAttribute("area") == "true" ? '' : cChartElement_line.getMarkerPath(nXPath, nYPath, nGroup)));
		cChartElement.setTextPosition(oGroup.$getContainer("label"),
										nXPath + 20,
										nYPath + 5);

		//
		if (this.hasAttribute("type")) {
			nYFromPrev	= nYFrom;
			nYToPrev	= nYTo;
			dPrev	= d;
		}
	}
};

if (!cChartElement.useVML) {
	cChartElement_line.prototype.$getTagOpen	= function() {
		return '<div class="c-line' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>\
					<svg:svg class="c-line--canvas" viewBox="0 0 600 300" width="100%" height="100%" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
						<svg:text class="c-line--title" y="30" x="300">' + (this.hasAttribute("title") ? ample.$encodeXMLCharacters(this.getAttribute("title")) : '') + '</svg:text>\
						<svg:rect x="460" y="50" width="120" height="120" rx="10" class="c-legend"/>\
						<svg:path class="c-grid c-line--grid"/>\
						<svg:g class="c-xAxis">\
							<svg:path class="c-line--xAxis" d="m50,250 h400,0" style="fill:none"/>\
							<svg:path id="x' + this.uniqueID + '" d="m300,280 h400,0" style="fill:none;stroke:none"/>\
							<svg:text class="c-xAxis--label c-line--xAxisLabel"><svg:textPath xlink:href="#x' + this.uniqueID + '">' + (this.hasAttribute("xAxisLabel") ? ample.$encodeXMLCharacters(this.getAttribute("xAxisLabel")) : '') + '</svg:textPath></svg:text>\
						</svg:g>\
						<svg:g class="c-yAxis">\
							<svg:path class="c-line--yAxis" d="m50,250 v0,-200" style="fill:none"/>\
							<svg:path id="y' + this.uniqueID + '" d="m30,200 v0,-200" style="fill:none;stroke:none"/>\
							<svg:text class="c-yAxis--label c-line--yAxisLabel"><svg:textPath xlink:href="#y' + this.uniqueID + '">' + (this.hasAttribute("yAxisLabel") ? ample.$encodeXMLCharacters(this.getAttribute("yAxisLabel")) : '') + '</svg:textPath></svg:text>\
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
	// Redefine handlers
	(function() {
		// DOMNodeInsertedIntoDocument
		var fHandlerInserted	= cChartElement_line.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_line.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			if (fHandlerInserted)
				fHandlerInserted.call(this, oEvent);
			//
			cChartElement_line.recalcCSS(this);

			if (navigator.userAgent.match(/MSIE ([0-9.]+)/) && RegExp.$1 * 1 == 8)
				cChartElement_line.resize(this);
			//
			this.$getContainer().attachEvent("onresize", cChartElement_line.onresize);
		};
		// DOMNodeRemovedFromDocument
		var fHandlerRemoved	= cChartElement_line.handlers['DOMNodeRemovedFromDocument'];
		cChartElement_line.handlers['DOMNodeRemovedFromDocument']	= function(oEvent) {
			if (fHandlerRemoved)
				fHandlerRemoved.call(this, oEvent);
			//
			this.$getContainer().detachEvent("onresize", cChartElement_line.onresize);
		};
	})();

	cChartElement_line.resize	= function(oInstance) {
		//
		var oElement= oInstance.$getContainer(),
			oCanvas	= oInstance.$getContainer("canvas"),
			oRect	= oElement.getBoundingClientRect(),
			nWidth	= oRect.right - oRect.left - (parseInt(oElement.currentStyle.borderWidth) || 0) * 2,
			nHeight	= Math.round(nWidth / 2);

		oCanvas.style.display	= "none";
		oCanvas.style.width		= nWidth + "px";
		oCanvas.style.height	= nHeight + "px";
//		oElement.style.width	= nWidth + "px";
		oElement.style.height	= nHeight + "px";

		// TODO: recalc relevant CSS recursively (font-size, stroke-width)

		// IE8 performance bug
		setTimeout(function(){
			oCanvas.style.display	= "";
		}, 0);
	};

	cChartElement_line.onresize	= function(oEvent) {
		var oElement;
		if ((oElement = ample.$instance(oEvent.srcElement)) && oElement instanceof cChartElement)
			cChartElement_line.resize(oElement);
	};

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
		return '<div class="c-line' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;' + (this.hasAttribute("style") ? this.getAttribute("style") : '') + '">\
					<chart2vml:group class="c-line--canvas" style="position:absolute;display:none;" coordOrigin="0 0" coordSize="600 300">\
						<chart2vml:shape class="c-line--title" path="m0,0 l600,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + (this.hasAttribute("title") ? ample.$encodeXMLCharacters(this.getAttribute("title")) : '') + '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:shape path="' + cChartElement.roundRectPath(460, 50, 120, 120, 10, 10) + '" class="c-legend c-line--legend" style="position:absolute;width:100%;height:100%"/>\
						<chart2vml:shape class="c-grid c-line--grid" style="position:absolute;width:100%;height:100%"/>\
						<chart2vml:group class="c-xAxis" style="position:absolute;width:100%;height:100%">\
							<chart2vml:shape class="c-line--xAxis" path="m50,250 r400,0 e" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:shape class="c-xAxis--label c-line--xAxisLabel" path="m50,280 r400,0 e" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
								<chart2vml:path textpathok="true" />\
								<chart2vml:textpath on="true" string="' + (this.hasAttribute("xAxisLabel") ? ample.$encodeXMLCharacters(this.getAttribute("xAxisLabel")) : '') + '" style="v-text-align:right"/>\
							</chart2vml:shape>\
							<chart2vml:shape class="c-xAxis--marks c-line--xAxisMarks" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:group class="c-xAxis--scale c-line--xAxisItems" style="top:3px"/>\
						</chart2vml:group>\
						<chart2vml:group class="c-yAxis" style="position:absolute;width:100%;height:100%">\
							<chart2vml:shape class="c-line--yAxis" path="m50,250 r0,-200 e" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:shape class="c-yAxis--label c-line--yAxisLabel" path="m20,250 r0,-200 e" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
								<chart2vml:path textpathok="true" />\
								<chart2vml:textpath on="true" string="' + (this.hasAttribute("yAxisLabel") ? ample.$encodeXMLCharacters(this.getAttribute("yAxisLabel")) : '') + '" style="v-text-align:right"/>\
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

// Static members
cChartElement_line.getMarkerPath	= function(nX, nY, nType) {
	var nSize	= 4,
		nSize2	= nSize * 2;
	switch (nType) {
		// Square
		case 1:
			return	"M" +(nX - nSize)+ "," +(nY - nSize)+
					"h" + nSize2 +
					"v" + nSize2 +
					"h-" + nSize2 +
					"v-" + nSize2 +
					"z";
		// Triangle
		case 4:
			var nOffset	= nSize2 / Math.sqrt(3);
			return	"M" +(nX - nOffset)+ "," +(nY - nSize)+
					"h" + nOffset * 2 +
					"l-" + nOffset + "," + nSize2 +
					"l-" + nOffset + ",-" + nSize2 +
					"z";
		// Square 45%
		case 3:
			return "M" + nX + "," +(nY - nSize)+
					"l" + nSize + "," + nSize +
					"l-" + nSize + "," + nSize +
					"l-" + nSize + ",-" + nSize +
					"l" + nSize + ",-" + nSize +
					"z";
		// Triangle 60%
		case 2:
			var nOffset	= nSize2 / Math.sqrt(3);
			return	"M" + nX + "," +(nY - nSize)+
					"l" + nOffset + "," + nSize2 +
					"h-" + nOffset * 2 +
					"l" + nOffset + ",-" + nSize2 +
					"z";
		// Circle
		default:
			return	"M" + (nX - nSize) + "," + nY +
					"a" + nSize + "," + nSize + " 0 0,0 " + nSize2 + ",0 " +
					"a" + nSize + "," + nSize + " 0 0,0 -" + nSize2 + ",0 " +
					"z";
	}
};

// Register Element
ample.extend(cChartElement_line);