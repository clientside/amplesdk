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

cChartElement_radarGroup.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		this.refresh();
	}
};

cChartElement_radarGroup.prototype.refresh	= function() {
	var d	= [];
	for (var n = 0, l = this.childNodes.length, oElement; oElement = this.childNodes[n]; n++) {
		var nValue	= oElement.getAttribute("value") * 1 * 2,
			nX	= (150 - nValue * Math.cos(Math.PI / 2 + 2 * Math.PI * n / l)),
			nY	= (150 - nValue * Math.sin(Math.PI / 2 + 2 * Math.PI * n / l));
		// Set point
		d.push((n ? "L" : "M") + nX + "," + nY);
		oElement.$getContainer().setAttribute("cx", nX);
		oElement.$getContainer().setAttribute("cy", nY);
	}
	this.$getContainer("line").setAttribute("d", d.join(" ") + "z");
	this.$getContainer("shadow").setAttribute("d", d.join(" ") + "z");
	this.$getContainer("area").setAttribute("d", d.join(" ") + "z");
};

cChartElement_radarGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-radarGroup c-radarGroup_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" \
				style="' + this.getAttribute("style") + '">\
				<svg:g>\
					<svg:path class="c-radarGroup--path" />\
					<svg:text class="c-radarGroup--label" x="100" y="100" style="stroke:none">' + this.getAttribute("label")+ '</svg:text>\
				</svg:g>\
				<svg:path class="c-radarGroup--shadow" style="fill:none;stroke-linejoin:round" transform="translate(2, 2)"/>\
				<svg:path class="c-radarGroup--line" style="fill:none;stroke-linejoin:round"/>\
				<svg:path class="c-radarGroup--area" style="stroke:none"/>\
				<svg:g class="c-radarGroup--gateway">';
};

cChartElement_radarGroup.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("radarGroup", cChartElement_radarGroup);