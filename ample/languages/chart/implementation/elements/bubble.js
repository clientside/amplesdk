/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_bubble	= function(){};
cChartElement_bubble.prototype	= new cChartElement;

cChartElement_bubble.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		var that	= this;
		setTimeout(function () {
			that.refresh();
		});
	}
};

cChartElement_bubble.prototype.refresh	= function() {
	// Collect and pre-analyze data
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
/*
	// Draw grid
	var d	= [];
	for (var x = 1; x < 10; x++)
		d.push("M" + (50 + x * 50) + ",50 V250 z ");
	for (var y = 1; y < 4; y++)
		d.push("M50," + (250 - y * 50) + "H550 z ");
	this.$getContainer("grid").setAttribute("d", d.join(''));
*/
	// Draw lines
	for (var nGroup = 0, nGroups = aData.length, oGroup; nGroup < nGroups; nGroup++) {
		// Get DOM element
		oGroup = this.childNodes[nGroup];

		// Draw items
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

			cChartElement.setPath(oGroup.childNodes[nItem].$getContainer("value"), d);
			cChartElement.setPath(oGroup.childNodes[nItem].$getContainer("shadow"), d);
//			cChartElement.setTextPosition(oGroup.childNodes[nItem].$getContainer("label"),
//											50 + 400 * (nXMax - aData[nGroup][nItem][0]) / (nXMax - nXMin),
//											250 - 200 * (nYMax - aData[nGroup][nItem][1]) / (nYMax - nYMin) + 6);
		}

		// Draw legend
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
	// Redefine handler
	(function() {
		var fHandler	= cChartElement_bubble.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_bubble.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			fHandler.call(this, oEvent);
			//
			cChartElement_bubble.recalcCSS(this);
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
		return '<div class="c-bubble' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
					<chart2vml:group class="c-bubble--canvas" style="position:relative;display:inline-block;x-overflow:hidden;width:600px;height:300px" coordOrigin="0 0" coordSize="600 300">\
						<chart2vml:shape class="c-bubble--title" path="m0,0 l600,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + this.getAttribute("title")+ '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:roundrect style="left:460px;top:50px;width:120px;height:120px" rx="10" class="c-legend c-bubble--legend" filled="true"/>\
						<chart2vml:shape class="c-grid c-bubble--grid" style="position:absolute;width:100%;height:100%"/>\
						<chart2vml:group class="c-xAxis" style="position:absolute;width:100%;height:100%">\
							<chart2vml:shape class="c-bubble--xAxis" path="m50,250 r400,0 e" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:shape class="c-xAxis--label c-bubble--xAxisLabel" path="m30,280 r400,0 e" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
								<chart2vml:path textpathok="true" />\
								<chart2vml:textpath on="true" string="' + this.getAttribute("xAxisLabel")+ '" style="v-text-align:center"/>\
							</chart2vml:shape>\
							<chart2vml:shape class="c-xAxis--marks c-bar--xAxisMarks" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:group class="c-xAxis--scale c-bar--xAxisItems" style="top:3px"/>\
						</chart2vml:group>\
						<chart2vml:group class="c-yAxis" style="position:absolute;width:100%;height:100%">\
							<chart2vml:shape class="c-bubble--yAxis" path="m50,250 r0,-200 e" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:shape class="c-yAxis--label c-bubble--yAxisLabel" path="m20,200 r0,-200 e" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
								<chart2vml:path textpathok="true" />\
								<chart2vml:textpath on="true" string="' + this.getAttribute("yAxisLabel")+ '" style="v-text-align:center"/>\
							</chart2vml:shape>\
							<chart2vml:shape class="c-yAxis--marks c-bar--yAxisMarks" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:group class="c-yAxis--scale c-bar--yAxisItems" style="top:3px"/>\
						</chart2vml:group>\
						<chart2vml:group class="c-bubble--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_bubble.prototype.$getTagClose	= function() {
		return '		</chart2vml:group>\
					</chart2vml:group>\
				</div>';
	};
}

// Register Element with language
oChartNamespace.setElement("bubble", cChartElement_bubble);