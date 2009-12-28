/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_doughnutGroup	= function(){};
cChartElement_doughnutGroup.prototype	= new cChartElement;
cChartElement_doughnutGroup.prototype.$hoverable	= true;

cChartElement_doughnutGroup.prototype.refresh	= function() {
	// Calculate accumulated value
	var nSumAll	= 0;
	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++)
		nSumAll	+= oElement.getAttribute("value") * 1;

	var nGroup	= this.parentNode.childNodes.$indexOf(this),
		nGroups	= this.parentNode.childNodes.length,
		nSumUp	= 0;

	var cX	= 150,
		cY	= 150,
		nWidth	= 100 /(nGroups + 0.5);

	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++) {
		// doughnut origin
		var	nInnerR	=(nGroup + 0.5 )* nWidth,
			nOuterR	= nInnerR + nWidth,
			nAngleFrom	=-Math.PI / 2 + 2 * Math.PI * nSumUp / nSumAll,
			nAngleTo	=-Math.PI / 2 + 2 * Math.PI *(nSumUp + oElement.getAttribute("value") * 1) / nSumAll;

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

		oElement.$getContainer("value").setAttribute("d", d.join('') + "z");
		//oElement.$getContainer("shadow").setAttribute("d", d.join('') + "z");

		// Text label
		var nTextR	=(nOuterR + nInnerR)/2 - 5,
			nAngleFromText	= nAngleFrom + Math.PI / 90;
		oElement.$getContainer("path").setAttribute("d", "M" + (cX + nTextR * Math.cos(nAngleFromText)) + "," +(cY + nTextR * Math.sin(nAngleFromText)) + ' ' +
														"A" + nTextR + "," + nTextR + " 0 " + (nAngleTo - nAngleFrom > Math.PI ? 1 : 0) + ",1 " + (cX + nTextR * Math.cos(nAngleTo)) + "," +(cY + nTextR * Math.sin(nAngleTo))+
														"z");
		//
		nSumUp	+= oElement.getAttribute("value") * 1;
	}
};

cChartElement_doughnutGroup.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		var that	= this;
		that.refresh();
		setTimeout(function() {
			that.$play("opacity:1", 100, 1);
		}, this.parentNode.childNodes.$indexOf(this) * 100);
	}
};

cChartElement_doughnutGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-doughnutGroup' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="stroke-linejoin:round;' + this.getAttribute("style") + '" xmlns:svg="http://www.w3.org/2000/svg">';
};

cChartElement_doughnutGroup.prototype.$getTagClose	= function() {
	return '</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("doughnutGroup", cChartElement_doughnutGroup);