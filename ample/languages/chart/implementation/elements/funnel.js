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

		oElement.$getContainer("value").setAttribute("d", d.join('') + "z");

/*
		// Handles
		var nAngleHalf	= (nAngleFrom + nAngleTo) / 2;
		oElement.$getContainer("path").setAttribute("d", 	"M" + (cX + nWidth * Math.cos(nAngleHalf)) + "," +(cY - nWidth * Math.sin(nAngleHalf)) + ' ' +
															"l" + (10 * Math.cos(nAngleHalf)) + "," +(-10 * Math.sin(nAngleHalf)) + ' ' +
															"h" + (nAngleHalf >= Math.PI ? 1 : -1) * 100);
*/
//		oElement.$getContainer("label").setAttribute("x", cX + 5 + (nWidth + 10) * Math.cos(nAngleHalf));
//		oElement.$getContainer("label").setAttribute("y", cY - 5 - (nWidth + 10) * Math.sin(nAngleHalf));

		//
		nSumUp	+= oElement.getAttribute("value") * 1;
	}
};

cChartElement_funnel.prototype.$getTagOpen	= function() {
	return '<div class="c-funnel' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
				<svg:svg class="c-funnel--canvas" viewBox="0 0 300 300" width="300px" height="300px" xmlns:svg="http://www.w3.org/2000/svg">\
					<svg:text class="c-funnel--label" y="30" x="150">' + this.getAttribute("label")+ '</svg:text>\
					<svg:g class="c-funnel--gateway">';
};

cChartElement_funnel.prototype.$getTagClose	= function() {
	return '		</svg:g>\
				</svg:svg>\
			</div>';
};

// Register Element with language
oChartNamespace.setElement("funnel", cChartElement_funnel);