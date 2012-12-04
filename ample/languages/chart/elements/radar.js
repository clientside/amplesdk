/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_radar	= function(){};
cChartElement_radar.prototype	= new cChartElement("radar");

cChartElement_radar.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		this.refresh();
	}
};

cChartElement_radar.prototype.refresh	= function() {
	// Draw Grid
	var d	= [];

	// circles
	for (var n = 0, l = 5; n < l; n++) {
		d.push(	"M150," + (150 - 100 * (n + 1) / l) +
				"A" + 100 * (n + 1) / l + "," + 100 * (n + 1) / l + " 0 0,0 150," + (150 + 100 * (n + 1) / l) +
				"A" + 100 * (n + 1) / l + "," + 100 * (n + 1) / l + " 0 0,0 150," + (150 - 100 * (n + 1) / l) +
				"z");
	}

	// lines
	for (var n = 0, l = 5; n < l; n++)
		d.push(	"M150,150" +
				"L" + (150 - 100 * Math.cos(Math.PI / 2 + 2 * Math.PI * n / l)) + "," + (150 - 100 * Math.sin(Math.PI / 2 + 2 * Math.PI * n / l))+
				"z");
	cChartElement.setPath(this.$getContainer("grid"), d.join(''));

	// marks
	var d	= [];
	for (var n = 0, l = 5; n < l; n++)
		d.push(	"M" + (150 - 100 * Math.cos(Math.PI / 2 + 2 * Math.PI * n / l)) + "," + (150 - 100 * Math.sin(Math.PI / 2 + 2 * Math.PI * n / l))+
				"L" + (150 -(100 + 5) * Math.cos(Math.PI / 2 + 2 * Math.PI * n / l)) + "," + (150 -(100 + 5) * Math.sin(Math.PI / 2 + 2 * Math.PI * n / l))+
				"z");
	cChartElement.setPath(this.$getContainer("rAxisMarks"), d.join(''));

	// Draw values
	var nSize	= 3;
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
		d	= [];
		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem; oItem = oGroup.childNodes[nItem]; nItem++) {
			var nValue	= oItem.getAttribute("value") * 1 * 2,
				nX	= (150 - nValue * Math.cos(Math.PI / 2 + 2 * Math.PI * nItem / nItems)),
				nY	= (150 - nValue * Math.sin(Math.PI / 2 + 2 * Math.PI * nItem / nItems));
			// Set point
			cChartElement.setPath(oItem.$getContainer("path"),	"M" + (nX - nSize) + "," + nY +
																"a" + nSize + "," + nSize + " 0 0,0 " + nSize * 2 + ",0 " +
																"a" + nSize + "," + nSize + " 0 0,0-" + nSize * 2 + ",0 " +
																"z");
			//
			d.push((nItem ? "L" : "M") + nX + "," + nY);
		}
		cChartElement.setPath(oGroup.$getContainer("line"), d.join(" ") + "z");
		cChartElement.setPath(oGroup.$getContainer("shadow"), d.join(" ") + "z");
		cChartElement.setPath(oGroup.$getContainer("area"), d.join(" ") + "z");

		// Draw legend
		var nXPath	= 280,
			nYPath	=(50 + (nGroups - nGroup) * 20);
		cChartElement.setPath(oGroup.$getContainer("path"), "M" + (nXPath - 5) + "," + (nYPath - 5) + "h10 v10 h-10 v-10 z");
		cChartElement.setTextPosition(oGroup.$getContainer("label"),
										nXPath + 20, nYPath + 5);
	}
};

if (!cChartElement.useVML) {
	cChartElement_radar.prototype.$getTagOpen	= function() {
		return '<div class="c-radar' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>\
					<svg:svg class="c-radar--canvas" viewBox="0 0 400 300" style="width:inherit;height:inherit" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
						<svg:text class="c-radar--title" y="30" x="150">' + (this.hasAttribute("title") ? ample.$encodeXMLCharacters(this.getAttribute("title")) : '') + '</svg:text>\
						<svg:rect x="260" y="50" width="120" height="120" rx="10" class="c-legend"/>\
						<svg:path class="c-grid c-radar--grid"/>\
						<svg:g class="c-rAxis">\
							<svg:path class="c-radar--rAxis" d="m150,150 v-100" style="fill:none"/>\
							<svg:path id="r' + this.uniqueID + '" d="M140,150 v-150" style="fill:none;stroke:none"/>\
							<svg:text class="c-rAxis--label c-radar--rAxisLabel"><svg:textPath xlink:href="#r' + this.uniqueID + '">' + (this.hasAttribute("rAxisLabel") ? ample.$encodeXMLCharacters(this.getAttribute("rAxisLabel")) : '') + '</svg:textPath></svg:text>\
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
	// Redefine handlers
	(function() {
		// DOMNodeInsertedIntoDocument
		var fHandlerInserted	= cChartElement_radar.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_radar.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			if (fHandlerInserted)
				fHandlerInserted.call(this, oEvent);
			//
			cChartElement_radar.recalcCSS(this);

			if (navigator.userAgent.match(/MSIE ([0-9.]+)/) && RegExp.$1 * 1 == 8)
				cChartElement_radar.resize(this);
			//
			this.$getContainer().attachEvent("onresize", cChartElement_radar.onresize);
		};
		// DOMNodeRemovedFromDocument
		var fHandlerRemoved	= cChartElement_radar.handlers['DOMNodeRemovedFromDocument'];
		cChartElement_radar.handlers['DOMNodeRemovedFromDocument']	= function(oEvent) {
			if (fHandlerRemoved)
				fHandlerRemoved.call(this, oEvent);
			//
			this.$getContainer().detachEvent("onresize", cChartElement_radar.onresize);
		};
	})();

	cChartElement_radar.resize	= function(oInstance) {
		//
		var oElement= oInstance.$getContainer(),
			oCanvas	= oInstance.$getContainer("canvas"),
			oRect	= oElement.getBoundingClientRect(),
			nWidth	= oRect.right - oRect.left - (parseInt(oElement.currentStyle.borderWidth) || 0) * 2,
			nHeight	= Math.round(nWidth * 3 / 4);

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

	cChartElement_radar.onresize	= function(oEvent) {
		var oElement;
		if ((oElement = ample.$instance(oEvent.srcElement)) && oElement instanceof cChartElement)
			cChartElement_radar.resize(oElement);
	};

	cChartElement_radar.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("title"));
		cChartElement.applyCSS(oElement.$getContainer("legend"));
		cChartElement.applyCSS(oElement.$getContainer("grid"));
		cChartElement.applyCSS(oElement.$getContainer("rAxis"));
		cChartElement.applyCSS(oElement.$getContainer("rAxisMarks"));
		cChartElement.applyCSS(oElement.$getContainer("rAxisLabel"));
	};

	cChartElement_radar.prototype.$getTagOpen	= function() {
		return '<div class="c-radar' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;' + (this.hasAttribute("style") ? this.getAttribute("style") : '') + '">\
					<chart2vml:group class="c-radar--canvas" style="position:absolute;display:none;" coordOrigin="0 0" coordSize="400 300">\
						<chart2vml:shape class="c-radar--title" path="m0,0 l300,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + (this.hasAttribute("title") ? ample.$encodeXMLCharacters(this.getAttribute("title")) : '') + '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:shape path="' + cChartElement.roundRectPath(260, 50, 120, 120, 10, 10) + '" class="c-legend c-radar--legend" style="position:absolute;width:100%;height:100%"/>\
						<chart2vml:shape class="c-grid c-radar--grid" style="position:absolute;width:100%;height:100%" fillcolor="black"/>\
						<chart2vml:group class="c-rAxis" style="position:absolute;width:100%;height:100%">\
							<chart2vml:shape class="c-radar--rAxis" path="m150,150 v-100" style="position:absolute;width:100%;height:100%"/>\
							<chart2vml:shape class="c-rAxis--label c-radar--rAxisLabel" path="m140,150 r0,-100 e" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
								<chart2vml:path textpathok="true" />\
								<chart2vml:textpath on="true" string="' + (this.hasAttribute("rAxisLabel") ? ample.$encodeXMLCharacters(this.getAttribute("rAxisLabel")) : '') + '" style="v-text-align:right"/>\
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

// Register Element
ample.extend(cChartElement_radar);