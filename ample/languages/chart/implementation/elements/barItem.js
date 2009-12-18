/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_barItem	= function(){};
cChartElement_barItem.prototype	= new cChartElement;

cChartElement_barItem.handlers	= {
	'mouseenter':	function(oEvent) {
		this.$getContainer("value").setAttribute("opacity", "0.5");
	},
	'mouseleave':	function(oEvent) {
		this.$getContainer("value").setAttribute("opacity", "1");
	}
};

cChartElement_barItem.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-barItem' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
				<svg:path class="c-barItem--shadow" stroke-width="0" style="opacity:0.3;stroke-linejoin:round" transform="translate(3,2)"/>\
				<svg:path class="c-barItem--value"/>\
				<svg:path class="c-barItem--textPath" id="p' + this.uniqueID + '" style="fill:none;stroke:none"/>\
				<svg:text class="c-barItem--label" style="stroke:none;"><svg:textPath xlink:href="#p' + this.uniqueID + '">' + this.getAttribute("value")+ '</svg:textPath></svg:text>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("barItem", cChartElement_barItem);