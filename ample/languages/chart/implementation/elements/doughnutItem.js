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
cChartElement_doughnutItem.prototype.$hoverable	= true;

cChartElement_doughnutItem.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-doughnutItem c-doughnutItem_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
//				<svg:path class="c-doughnutItem--shadow" transform="translate(2,2)" style="opacity:0.5;' + this.getAttribute("style") + '" ' +(this.hasAttribute("fill") ? ' fill="' + this.getAttribute("fill") + '"' : '')+ '/>\
				<svg:path class="c-doughnutItem--value" />\
				<svg:path class="c-doughnutItem--path" id="p' + this.uniqueID + '" style="fill:none;stroke:none"/>\
				<svg:text class="c-doughnutItem--label" style="stroke:none">\
					<svg:textPath xlink:href="#p' + this.uniqueID + '">' + this.getAttribute("label") + '</svg:textPath>\
				</svg:text>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("doughnutItem", cChartElement_doughnutItem);