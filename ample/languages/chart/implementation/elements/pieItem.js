/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_pieItem	= function(){};
cChartElement_pieItem.prototype	= new cChartElement;

cChartElement_pieItem.handlers	= {
	'mouseenter':	function(oEvent) {
		this.$getContainer().setAttribute("fill-opacity", "0.5");
	},
	'mouseleave':	function(oEvent) {
		this.$getContainer().setAttribute("fill-opacity", "1.0");
	}
};

cChartElement_pieItem.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-pieItem' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
//				<svg:path class="c-pieItem--shadow" transform="translate(2,2)" style="opacity:0.5;' + this.getAttribute("style") + '" ' +(this.hasAttribute("fill") ? ' fill="' + this.getAttribute("fill") + '"' : '')+ '/>\
				<svg:path class="c-pieItem--value"/>\
				<svg:path class="c-pieItem--path" style="fill:none" stroke-linejoin="round"/>\
				<svg:text class="c-pieItem--label" style="stroke:none">' + this.getAttribute("label") + '</svg:text>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("pieItem", cChartElement_pieItem);