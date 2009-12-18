/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_doughnutItem	= function(){};
cChartElement_doughnutItem.prototype	= new cChartElement;

cChartElement_doughnutItem.handlers	= {
	'mouseenter':	function(oEvent) {
		this.$getContainer().setAttribute("fill-opacity", "0.5");
	},
	'mouseleave':	function(oEvent) {
		this.$getContainer().setAttribute("fill-opacity", "1.0");
	}
};

cChartElement_doughnutItem.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-doughnutItem' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
//				<svg:path class="c-doughnutItem--shadow" transform="translate(2,2)" style="opacity:0.5;' + this.getAttribute("style") + '" ' +(this.hasAttribute("fill") ? ' fill="' + this.getAttribute("fill") + '"' : '')+ '/>\
				<svg:path class="c-doughnutItem--value" style="' + this.getAttribute("style") + '" ' +(this.hasAttribute("fill") ? ' fill="' + this.getAttribute("fill") + '"' : '')+ '/>\
				<svg:path class="c-doughnutItem--path" id="p' + this.uniqueID + '" style="fill:none;stroke:none"/>\
				<svg:text style="fill:white;stroke:none">\
					<svg:textPath class="c-doughnutItem--text" xlink:href="#p' + this.uniqueID + '">' + this.getAttribute("label") + '</svg:textPath>\
				</svg:text>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("doughnutItem", cChartElement_doughnutItem);