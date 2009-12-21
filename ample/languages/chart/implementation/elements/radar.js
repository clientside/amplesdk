/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_radar	= function(){};
cChartElement_radar.prototype	= new cChartElement;

cChartElement_radar.prototype.$getTagOpen	= function() {
	return '<svg:svg class="c-radar' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" viewBox="0 0 300 300" width="300px" height="300px" style="' + this.getAttribute("style") + '" xmlns:svg="http://www.w3.org/2000/svg">\
				<svg:text class="c-radar--label" y="30" x="150">' + this.getAttribute("label")+ '</svg:text>\
				<svg:g class="c-radar--gateway">';
};

cChartElement_radar.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:svg>';
};

// Register Element with language
oChartNamespace.setElement("radar", cChartElement_radar);