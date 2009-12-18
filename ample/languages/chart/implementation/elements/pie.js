/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cChartElement_pie	= function(){};
cChartElement_pie.prototype	= new cChartElement;

cChartElement_pie.prototype.$getTagOpen	= function() {
	return '<svg:svg class="c-pie' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" viewBox="0 0 300 300" width="300px" height="300px" style="' + this.getAttribute("style") + '" xmlns:svg="http://www.w3.org/2000/svg">\
				<svg:text class="c-bar--label" y="30" x="150">' + this.getAttribute("label")+ '</svg:text>\
				<svg:g class="c-pie--gateway">';
};

cChartElement_pie.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:svg>';
};

// Register Element with language
oChartNamespace.setElement("pie", cChartElement_pie);