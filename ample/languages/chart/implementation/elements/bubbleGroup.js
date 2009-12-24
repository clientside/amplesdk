/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_bubbleGroup	= function(){};
cChartElement_bubbleGroup.prototype	= new cChartElement;

cChartElement_bubbleGroup.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		this.refresh();
	}
}

cChartElement_bubbleGroup.prototype.refresh	= function() {
	var aValue,
		aValues	= [],
		nXMin	= Infinity,
		nXMax	=-Infinity,
		nYMin	= Infinity,
		nYMax	=-Infinity,
		nZMin	= Infinity,
		nZMax	=-Infinity;
	// Pre-calculate ranges
	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++) {
		aValue	= oElement.getAttribute("value").split(/,| /);
		aValues.push(aValue);
		if (aValue[0] * 1 < nXMin)
			nXMin	= aValue[0];
		if (aValue[0] * 1 > nXMax)
			nXMax	= aValue[0];
		if (aValue[1] * 1 < nYMin)
			nYMin	= aValue[1];
		if (aValue[1] * 1 > nYMax)
			nYMax	= aValue[1];
		if (aValue[2] * 1 < nZMin)
			nZMin	= aValue[2];
		if (aValue[2] * 1 > nZMax)
			nZMax	= aValue[2];
	}

	// Draw items
	var oElementDOM;
	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++) {
		oElementDOM	= oElement.$getContainer("value");
		oElementDOM.setAttribute("cx", 50 + 500 * (nXMax - aValues[nIndex][0]) / (nXMax - nXMin));
		oElementDOM.setAttribute("cy", 250 - 200 * (nYMax - aValues[nIndex][1]) / (nYMax - nYMin));
		oElementDOM.setAttribute("r", 10 + 20 * aValues[nIndex][2] / (nZMax - nZMin));

		oElementDOM	= oElement.$getContainer("shadow");
		oElementDOM.setAttribute("cx", 50 + 500 * (nXMax - aValues[nIndex][0]) / (nXMax - nXMin));
		oElementDOM.setAttribute("cy", 250 - 200 * (nYMax - aValues[nIndex][1]) / (nYMax - nYMin));
		oElementDOM.setAttribute("r", 10 + 20 * aValues[nIndex][2] / (nZMax - nZMin));

		oElementDOM	= oElement.$getContainer("label");
		oElementDOM.setAttribute("x", 50 + 500 * (nXMax - aValues[nIndex][0]) / (nXMax - nXMin));
		oElementDOM.setAttribute("y", 250 - 200 * (nYMax - aValues[nIndex][1]) / (nYMax - nYMin) + 6);
	}
};

cChartElement_bubbleGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-bubbleGroup c-bubbleGroup_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '" xmlns:svg="http://www.w3.org/2000/svg">';
};

cChartElement_bubbleGroup.prototype.$getTagClose	= function() {
	return '</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("bubbleGroup", cChartElement_bubbleGroup);