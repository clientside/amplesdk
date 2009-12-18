/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cChartElement_bubble	= function(){};
cChartElement_bubble.prototype	= new cChartElement;

cChartElement_bubble.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		// Draw grid
		var xAxisRange	= this.getAttribute("xAxisRange").split(';'),
			yAxisRange	= this.getAttribute("yAxisRange").split(';');
		var d	= [];
		for (var x = 1; x < 10; x++)
			d.push("M" + (50 + x * 50) + ",50 V250 z ");
		for (var y = 1; y < 4; y++)
			d.push("M50," + (250 - y * 50) + "H550 z ");
		this.$getContainer("grid").setAttribute("d", d.join(''));
	}
};

cChartElement_bubble.prototype.$getTagOpen	= function() {
	return '<svg:svg class="c-bubble' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" viewBox="0 0 600 300" width="600px" height="300px" style="' + this.getAttribute("style") + '" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
				<svg:text class="c-bubble--label" y="30" x="300">' + this.getAttribute("label")+ '</svg:text>\
				<svg:path class="c-grid c-bubble--grid"/>\
				<svg:g class="c-xAxis">\
					<svg:path class="c-bubble--xAxis" d="M50,250 h500,0" style="fill:none"/>\
					<svg:path id="x' + this.uniqueID + '" d="M300,280 h500,0" style="fill:none;stroke:none"/>\
					<svg:text class="c-xAxis--label c-bubble--xAxisLabel"><svg:textPath xlink:href="#x' + this.uniqueID + '">' + this.getAttribute("yAxisLabel")+ '</svg:textPath></svg:text>\
				</svg:g>\
				<svg:g class="c-yAxis">\
					<svg:path class="c-bubble--yAxis" d="M50,250 v0,-200" style="fill:none"/>\
					<svg:path id="y' + this.uniqueID + '" d="M30,200 v0,-200" style="fill:none;stroke:none"/>\
					<svg:text class="c-yAxis--label c-bubble--yAxisLabel"><svg:textPath xlink:href="#y' + this.uniqueID + '">' + this.getAttribute("yAxisLabel")+ '</svg:textPath></svg:text>\
				</svg:g>\
				<svg:g class="c-bubble--gateway">';
};

cChartElement_bubble.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:svg>';
};

// Register Element with language
oChartNamespace.setElement("bubble", cChartElement_bubble);