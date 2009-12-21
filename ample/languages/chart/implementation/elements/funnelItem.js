/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_funnelItem	= function(){};
cChartElement_funnelItem.prototype	= new cChartElement;

cChartElement_funnelItem.handlers	= {
	'mouseenter':	function(oEvent) {
		this.$getContainer().setAttribute("fill-opacity", "0.5");
	},
	'mouseleave':	function(oEvent) {
		this.$getContainer().setAttribute("fill-opacity", "1.0");
	}
};

cChartElement_funnelItem.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-funnelItem' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
				<svg:path class="c-funnelItem--value"/>\
				<svg:path class="c-funnelItem--path" style="fill:none" stroke-linejoin="round"/>\
				<svg:text class="c-funnelItem--label" style="stroke:none">' + this.getAttribute("label") + '</svg:text>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("funnelItem", cChartElement_funnelItem);