/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cChartElement_bubbleItem	= function(){};
cChartElement_bubbleItem.prototype	= new cChartElement;

cChartElement_bubbleItem.handlers	= {
	'mouseenter':	function(oEvent) {
		this.$getContainer("value").setAttribute("opacity", "0.5");
	},
	'mouseleave':	function(oEvent) {
		this.$getContainer("value").setAttribute("opacity", "1");
	}
};

cChartElement_bubbleItem.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-bubbleItem' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
				<svg:circle class="c-bubbleItem--shadow" transform="translate(2,2)" style="stroke:none;opacity:0.5"/>\
				<svg:circle class="c-bubbleItem--value"/>\
				<svg:text class="c-bubbleItem--label" style="fill:white;stroke:none" text-anchor="middle">' + (this.getAttribute("value").split(',')[2]) + '</svg:text>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("bubbleItem", cChartElement_bubbleItem);