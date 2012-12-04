/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_doughnut	= function(){};
cChartElement_doughnut.prototype	= new cChartElement("doughnut");

cChartElement_doughnut.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		this.refresh();
	}
};

cChartElement_doughnut.prototype.refresh	= function() {
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
		// Calculate accumulated value
		var nSumAll	= 0,
			nSumUp	= 0;
		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem; oItem = oGroup.childNodes[nItem]; nItem++)
			nSumAll	+= oItem.getAttribute("value") * 1;

		var cX	= 150,
			cY	= 150,
			nWidth	= 100 /(nGroups + 0.5);

		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem; oItem = oGroup.childNodes[nItem]; nItem++) {
			// doughnut origin
			var	nInnerR	=(nGroup + 0.5 )* nWidth,
				nOuterR	= nInnerR + nWidth,
				nAngleFrom	=-Math.PI / 2 + 2 * Math.PI * nSumUp / nSumAll,
				nAngleTo	=-Math.PI / 2 + 2 * Math.PI *(nSumUp + oItem.getAttribute("value") * 1) / nSumAll;

			var d	= [];
			// Set start point on the inner circle
			d.push("M" + (cX + nInnerR * Math.cos(nAngleFrom)) + "," +(cY + nInnerR * Math.sin(nAngleFrom)));
			// Draw line to the outer circle
			d.push("L" + (cX + nOuterR * Math.cos(nAngleFrom)) + "," +(cY + nOuterR * Math.sin(nAngleFrom)));
			// Draw arc on the outer circle
			d.push("A" + nOuterR + "," + nOuterR + " 0 " + (nAngleTo - nAngleFrom >= Math.PI ? 1 : 0)+ ",1 " + (cX + nOuterR * Math.cos(nAngleTo)) + "," +(cY + nOuterR * Math.sin(nAngleTo)));
			// Draw line to the inner circle
			d.push("L" + (cX + nInnerR * Math.cos(nAngleTo)) + "," +(cY + nInnerR * Math.sin(nAngleTo)));
			// Draw arc on the inner circle
			d.push("A" + nInnerR + "," + nInnerR + " 0 " + (nAngleTo - nAngleFrom >= Math.PI ? 1 : 0)+ ",0 " + (cX + nInnerR * Math.cos(nAngleFrom)) + "," +(cY + nInnerR * Math.sin(nAngleFrom)));

			cChartElement.setPath(oItem.$getContainer("path"), d.join('') + "z");
			//cChartElement.setPath(oItem.$getContainer("shadow"), d.join('') + "z");

			// Text label
			var nTextR	=(nOuterR + nInnerR)/2 - 5,
				nAngleFromText	= nAngleFrom + Math.PI / 90;
			cChartElement.setPath(oItem.$getContainer("textPath"),	"M" + (cX + nTextR * Math.cos(nAngleFromText)) + "," +(cY + nTextR * Math.sin(nAngleFromText)) + ' ' +
																	"A" + nTextR + "," + nTextR + " 0 " + (nAngleTo - nAngleFrom > Math.PI ? 1 : 0) + ",1 " + (cX + nTextR * Math.cos(nAngleTo)) + "," +(cY + nTextR * Math.sin(nAngleTo))+
																"z");
			//
			nSumUp	+= oItem.getAttribute("value") * 1;
		}
	}
};

if (!cChartElement.useVML) {
	cChartElement_doughnut.prototype.$getTagOpen	= function() {
		return '<div class="c-doughnut' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>\
					<svg:svg class="c-doughnut--canvas" viewBox="0 0 300 300" style="width:inherit;height:inherit" xmlns:svg="http://www.w3.org/2000/svg">\
						<svg:text class="c-doughnut--title" y="30" x="150">' + (this.hasAttribute("title") ? ample.$encodeXMLCharacters(this.getAttribute("title")) : '') + '</svg:text>\
						<svg:g class="c-doughnut--gateway">';
	};

	cChartElement_doughnut.prototype.$getTagClose	= function() {
		return '		</svg:g>\
					</svg:svg>\
				</div>';
	};
}
else {
	// Redefine handlers
	(function() {
		// DOMNodeInsertedIntoDocument
		var fHandlerInserted	= cChartElement_doughnut.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_doughnut.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			if (fHandlerInserted)
				fHandlerInserted.call(this, oEvent);
			//
			cChartElement_doughnut.recalcCSS(this);

			if (navigator.userAgent.match(/MSIE ([0-9.]+)/) && RegExp.$1 * 1 == 8)
				cChartElement_doughnut.resize(this);
			//
			this.$getContainer().attachEvent("onresize", cChartElement_doughnut.onresize);
		};
		// DOMNodeRemovedFromDocument
		var fHandlerRemoved	= cChartElement_doughnut.handlers['DOMNodeRemovedFromDocument'];
		cChartElement_doughnut.handlers['DOMNodeRemovedFromDocument']	= function(oEvent) {
			if (fHandlerRemoved)
				fHandlerRemoved.call(this, oEvent);
			//
			this.$getContainer().detachEvent("onresize", cChartElement_doughnut.onresize);
		};
	})();

	cChartElement_doughnut.resize	= function(oInstance) {
		//
		var oElement= oInstance.$getContainer(),
			oCanvas	= oInstance.$getContainer("canvas"),
			oRect	= oElement.getBoundingClientRect(),
			nWidth	= oRect.right - oRect.left - (parseInt(oElement.currentStyle.borderWidth) || 0) * 2,
			nHeight	= nWidth;

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

	cChartElement_doughnut.onresize	= function(oEvent) {
		var oElement;
		if ((oElement = ample.$instance(oEvent.srcElement)) && oElement instanceof cChartElement)
			cChartElement_doughnut.resize(oElement);
	};

	cChartElement_doughnut.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("title"));
	};

	cChartElement_doughnut.prototype.$getTagOpen	= function() {
		return '<div class="c-doughnut' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;' + (this.hasAttribute("style") ? this.getAttribute("style") : '') + '">\
					<chart2vml:group class="c-doughnut--canvas" style="position:absolute;display:none;" coordOrigin="0 0" coordSize="300 300">\
						<chart2vml:shape class="c-doughnut--title" path="m0,0 l300,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + (this.hasAttribute("title") ? ample.$encodeXMLCharacters(this.getAttribute("title")) : '') + '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:group class="c-doughnut--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_doughnut.prototype.$getTagClose	= function() {
		return '		</chart2vml:group>\
					</chart2vml:group>\
				</div>';
	};
}

// Register Element
ample.extend(cChartElement_doughnut);