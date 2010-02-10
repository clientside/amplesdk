/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_funnel	= function(){};
cChartElement_funnel.prototype	= new cChartElement;

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

		cChartElement.setPath(oElement.$getContainer("value"), d.join('') + "z");

		// Handles
		var nCHalf	=(nCFrom + nCTo)/ 2;
		cChartElement.setPath(oElement.$getContainer("handle"),	"M" + (nLeft + nWidthTop + nCHalf * (nWidthBottom - nWidthTop)) + "," + (nTop + nCHalf * nHeight) + ' ' +
																"h100 " +
																"");
		cChartElement.setTextPosition(oElement.$getContainer("label"),
										nLeft + nWidthTop + nCHalf * (nWidthBottom - nWidthTop) + 10,
										nTop + nCHalf * nHeight - 5);

		//
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
	// Redefine handler
	(function() {
		var fHandler	= cChartElement_funnel.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_funnel.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			fHandler.call(this, oEvent);
			//
			cChartElement_funnel.recalcCSS(this);
		};
	})();

	cChartElement_funnel.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("title"));
	};

	cChartElement_funnel.prototype.$getTagOpen	= function() {
		return '<div class="c-funnel' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
					<chart2vml:group class="c-funnel--canvas" style="position:relative;display:inline-block;x-overflow:hidden;width:300px;height:300px" coordOrigin="0 0" coordSize="300 300">\
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

// Register Element with language
oChartNamespace.setElement("funnel", cChartElement_funnel);