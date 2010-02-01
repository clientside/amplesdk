/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_item	= function(){};
cChartElement_item.prototype	= new cChartElement;
cChartElement_item.prototype.$hoverable	 = true;

if (!cChartElement.useVML) {
	cChartElement_item.prototype.$getTagOpen	= function() {
		return '<svg:g class="c-item c-item_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
					<svg:path class="c-item--shadow" style="stroke-linejoin:round" transform="translate(2,2)"/>\
					<svg:path class="c-item--value"/>\
					<svg:path class="c-item--handle" style="fill:none"/>\
					<svg:path class="c-item--textPath" id="p' + this.uniqueID + '" style="fill:none;stroke:none"/>\
					<svg:text class="c-item--label" style="stroke:none;"><svg:textPath xlink:href="#p' + this.uniqueID + '">' + this.getAttribute("value")+ '</svg:textPath></svg:text>\
				</svg:g>';
	};
}
else {
	cChartElement_item.prototype.$getTagOpen	= function() {
		return '<chart2vml:group class="c-item c-item_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="position:absolute;width:100%;height:100%;">\
					<chart2vml:shape class="c-item--shadow" style="position:absolute;width:100%;height:100%" transform="translate(2,2)"/>\
					<chart2vml:shape class="c-item--value" style="position:absolute;top:0;left:0;height:100%;width:100%;"/>\
					<chart2vml:shape class="c-item--handle" stroked="true" filled="false" style="position:absolute;top:0;left:0;height:100%;width:100%;"/>\
					<chart2vml:shape class="c-item--textPath" path="m0,0 l100,0" fillcolor="red" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:0;left:0;">\
						<chart2vml:path textpathok="true" />\
						<chart2vml:textpath on="true" class="c-item--label" string="' + this.getAttribute("label")+ '"/>\
					</chart2vml:shape>\
				</chart2vml:group>';
	};
}

// Register Element with language
oChartNamespace.setElement("item", cChartElement_item);