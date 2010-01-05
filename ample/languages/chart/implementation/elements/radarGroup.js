/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_radarGroup	= function(){};
cChartElement_radarGroup.prototype	= new cChartElement;
cChartElement_radarGroup.prototype.$hoverable	= true;

cChartElement_radarGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-radarGroup c-radarGroup_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" \
				style="' + this.getAttribute("style") + '">\
				<svg:g>\
					<svg:path class="c-radarGroup--path" />\
					<svg:text class="c-radarGroup--label" x="100" y="100" style="stroke:none">' + this.getAttribute("label")+ '</svg:text>\
				</svg:g>\
				<svg:g class="c-radarGroup--value">\
					<svg:path class="c-radarGroup--shadow" style="fill:none;stroke-linejoin:round" transform="translate(2, 2)"/>\
					<svg:path class="c-radarGroup--line" style="fill:none;stroke-linejoin:round"/>\
					<svg:path class="c-radarGroup--area" style="stroke:none"/>\
					<svg:g class="c-radarGroup--gateway">';
};

cChartElement_radarGroup.prototype.$getTagClose	= function() {
	return '		</svg:g>\
				</svg:g>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("radarGroup", cChartElement_radarGroup);