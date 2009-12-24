/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_pie	= function(){};
cChartElement_pie.prototype	= new cChartElement;

cChartElement_pie.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		this.refresh();
	}
};

cChartElement_pie.prototype.refresh	= function() {
	// Calculate accumulated value
	var nSumAll	= 0;
	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++)
		nSumAll	+= oElement.getAttribute("value") * 1;

	var nSumUp	= 0,
		cX	= 150,
		cY	= 150,
		nWidth	= 100;

	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++) {
		// pie origin
		var	nAngleFrom	= Math.PI / 2 + 2 * Math.PI * nSumUp / nSumAll,
			nAngleTo	= Math.PI / 2 + 2 * Math.PI *(nSumUp + oElement.getAttribute("value") * 1) / nSumAll;

		var d	= [];
		// Set start point on the inner circle
		d.push("M" + cX + "," + cY);
		// Draw line to the outer circle
		d.push("L" + (cX + nWidth * Math.cos(nAngleFrom)) + "," +(cY - nWidth * Math.sin(nAngleFrom)));
		// Draw arc on the outer circle
		d.push("A" + nWidth + "," + nWidth + " 0 " + (nAngleTo - nAngleFrom >= Math.PI ? 1 : 0)+ ",0 " + (cX + nWidth * Math.cos(nAngleTo)) + "," +(cY - nWidth * Math.sin(nAngleTo)));
		// Draw line to the inner circle
		d.push("L" + cX + "," + cY);

		oElement.$getContainer("value").setAttribute("d", d.join('') + "z");
		//oElement.$getContainer("shadow").setAttribute("d", d.join('') + "z");
/*
		// Text label
		var nTextR	= nWidth - 5,
			nAngleFromText	= nAngleFrom + Math.PI / 90;
		oElement.$getContainer("path").setAttribute("d", "M" + (cX + nTextR * Math.cos(nAngleFromText)) + "," +(cY - nTextR * Math.sin(nAngleFromText)) + ' ' +
														"A" + nTextR + "," + nTextR + " 0 " + (nAngleTo - nAngleFrom > Math.PI ? 1 : 0) + ",0 " + (cX + nTextR * Math.cos(nAngleTo)) + "," +(cY - nTextR * Math.sin(nAngleTo))+
														"z");
*/
		// Handles
		var nAngleHalf	= (nAngleFrom + nAngleTo) / 2;
		oElement.$getContainer("path").setAttribute("d", 	"M" + (cX + nWidth * Math.cos(nAngleHalf)) + "," +(cY - nWidth * Math.sin(nAngleHalf)) + ' ' +
															"l" + (10 * Math.cos(nAngleHalf)) + "," +(-10 * Math.sin(nAngleHalf)) + ' ' +
															"h" + (nAngleHalf >= Math.PI ? 1 : -1) * 100);

		oElement.$getContainer("label").setAttribute("x", cX + 5 + (nWidth + 10) * Math.cos(nAngleHalf));
		oElement.$getContainer("label").setAttribute("y", cY - 5 - (nWidth + 10) * Math.sin(nAngleHalf));

		//
		nSumUp	+= oElement.getAttribute("value") * 1;
	}
};

cChartElement_pie.prototype.$getTagOpen	= function() {
	return '<div class="c-pie' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
				<svg:svg class="c-pie--canvas" viewBox="0 0 300 300" width="300px" height="300px" xmlns:svg="http://www.w3.org/2000/svg">\
					<svg:text class="c-doughnut--label" y="30" x="150">' + this.getAttribute("label")+ '</svg:text>\
					<svg:g class="c-pie--gateway">';
};

cChartElement_pie.prototype.$getTagClose	= function() {
	return '		</svg:g>\
				</svg:svg>\
			</div>';
};

// Register Element with language
oChartNamespace.setElement("pie", cChartElement_pie);