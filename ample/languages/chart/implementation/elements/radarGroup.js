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

cChartElement_radarGroup.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		this.refresh();
	}
};

cChartElement_radarGroup.prototype.refresh	= function() {

};

cChartElement_radarGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-radarGroup' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" \
				style="' + (this.hasAttribute("fill") ? 'fill:' + this.getAttribute("fill") + ';' : '') + (this.hasAttribute("fill") ? 'stroke:' + this.getAttribute("fill") + ';' : '') + 'stroke-width:1;opacity:0;' + this.getAttribute("style") + '">\
				<svg:path class="c-radarGroup--shadow" stroke-width="3" style="fill:none;opacity:0.2" stroke-linejoin="round" transform="translate(2, 2)"/>\
				<svg:path class="c-radarGroup--line" stroke-width="1" style="fill:none;stroke-linejoin:round"/>\
				<svg:path class="c-radarGroup--area" style="xfill:none;stroke:none;opacity:0.2"/>\
				<svg:g class="c-radarGroup--gateway" stroke-width="0" style="stroke:white;">';
};

cChartElement_radarGroup.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("radarGroup", cChartElement_radarGroup);