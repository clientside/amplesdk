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

cChartElement_doughnutGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-doughnutGroup' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="stroke-linejoin:round;' + this.getAttribute("style") + '" xmlns:svg="http://www.w3.org/2000/svg">';
};

cChartElement_doughnutGroup.prototype.$getTagClose	= function() {
	return '</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("doughnutGroup", cChartElement_doughnutGroup);