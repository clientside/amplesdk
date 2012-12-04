/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_funnel	= function(){};
cChartElement_funnel.prototype	= new cChartElement("funnel");

cChartElement_funnel.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		this.refresh();
	}
};

cChartElement_funnel.prototype.refresh	= function() {
	// Calculate accumulated value
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
		// pie origin
		var	nCFrom	= nSumUp / nSumAll,
			nCTo	=(nSumUp + oElement.getAttribute("value") * 1) / nSumAll;

		var d	= [];
		// Set start point
		d.push("M" + (nLeft + nWidthTop + nCFrom * (nWidthBottom - nWidthTop)) + "," + (nTop + nCFrom * nHeight));
		// Draw line to the outer
		d.push("L" + (nLeft + nWidthTop + nCTo * (nWidthBottom - nWidthTop)) + "," + (nTop + nCTo * nHeight));
		// Draw line on the outer
		d.push("L" + (nLeft - nWidthTop - nCTo * (nWidthBottom - nWidthTop)) + "," + (nTop + nCTo * nHeight));
		// Draw line to the inner
		d.push("L" + (nLeft - nWidthTop - nCFrom * (nWidthBottom - nWidthTop)) + "," + (nTop + nCFrom * nHeight));

		cChartElement.setPath(oElement.$getContainer("path"), d.join('') + "z");
/*
		var nCHalf	=(nCFrom + nCTo)/ 2;
		cChartElement.setTextPosition(oElement.$getContainer("label"),
										nLeft + nWidthTop + nCHalf * (nWidthBottom - nWidthTop) + 10,
										nTop + nCHalf * nHeight - 5);
*/
		//
		nSumUp	+= oElement.getAttribute("value") * 1;
	}
};

if (!cChartElement.useVML) {
	cChartElement_funnel.prototype.$getTagOpen	= function() {
		return '<div class="c-funnel' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>\
					<svg:svg class="c-funnel--canvas" viewBox="0 0 300 300" style="width:inherit;height:inherit" xmlns:svg="http://www.w3.org/2000/svg">\
						<svg:text class="c-funnel--title" y="30" x="150">' + (this.hasAttribute("title") ? ample.$encodeXMLCharacters(this.getAttribute("title")) : '') + '</svg:text>\
						<svg:g class="c-funnel--gateway">';
	};

	cChartElement_funnel.prototype.$getTagClose	= function() {
		return '		</svg:g>\
					</svg:svg>\
				</div>';
	};
}
else {
	// Redefine handlers
	(function() {
		// DOMNodeInsertedIntoDocument
		var fHandlerInserted	= cChartElement_funnel.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_funnel.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			if (fHandlerInserted)
				fHandlerInserted.call(this, oEvent);
			//
			cChartElement_funnel.recalcCSS(this);

			if (navigator.userAgent.match(/MSIE ([0-9.]+)/) && RegExp.$1 * 1 == 8)
				cChartElement_funnel.resize(this);
			//
			this.$getContainer().attachEvent("onresize", cChartElement_funnel.onresize);
		};
		// DOMNodeRemovedFromDocument
		var fHandlerRemoved	= cChartElement_funnel.handlers['DOMNodeRemovedFromDocument'];
		cChartElement_funnel.handlers['DOMNodeRemovedFromDocument']	= function(oEvent) {
			if (fHandlerRemoved)
				fHandlerRemoved.call(this, oEvent);
			//
			this.$getContainer().detachEvent("onresize", cChartElement_funnel.onresize);
		};
	})();

	cChartElement_funnel.resize	= function(oInstance) {
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

	cChartElement_funnel.onresize	= function(oEvent) {
		var oElement;
		if ((oElement = ample.$instance(oEvent.srcElement)) && oElement instanceof cChartElement)
			cChartElement_funnel.resize(oElement);
	};

	cChartElement_funnel.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("title"));
	};

	cChartElement_funnel.prototype.$getTagOpen	= function() {
		return '<div class="c-funnel' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;' + (this.hasAttribute("style") ? this.getAttribute("style") : '') + '">\
					<chart2vml:group class="c-funnel--canvas" style="position:absolute;display:none;" coordOrigin="0 0" coordSize="300 300">\
						<chart2vml:shape class="c-funnel--title" path="m0,0 l300,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + (this.hasAttribute("title") ? ample.$encodeXMLCharacters(this.getAttribute("title")) : '') + '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:group class="c-funnel--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_funnel.prototype.$getTagClose	= function() {
		return '		</chart2vml:group>\
					</chart2vml:group>\
				</div>';
	};
}

// Register Element
ample.extend(cChartElement_funnel);