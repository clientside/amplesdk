/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_lineGroup	= function(){};
cChartElement_lineGroup.prototype	= new cChartElement;
cChartElement_lineGroup.prototype.$hoverable	= true;

cChartElement_lineGroup.handlers	= {
	'DOMAttrModified':	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "selected":
					this.$setPseudoClass("selected", oEvent.newValue == "true");
			}
		}
	},
	'click':	function(oEvent) {
		this.setAttribute("selected", this.getAttribute("selected") == "true" ? "false" : "true");
	}
};

cChartElement_lineGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-lineGroup c-lineGroup_nth-child-' + this.parentNode.childNodes.$indexOf(this) + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" \
				style="' + this.getAttribute("style") + '">\
				<svg:g>\
					<svg:path class="c-lineGroup--path" style="fill:none" />\
					<svg:text class="c-lineGroup--label" style="stroke:none">' + this.getAttribute("label")+ '</svg:text>\
				</svg:g>\
				<svg:g class="c-lineGroup--value">\
					<svg:path class="c-lineGroup--shadow" style="fill:none;stroke-linejoin:round" transform="translate(2, 2)"/>\
					<svg:path class="c-lineGroup--line" style="fill:none;stroke-linejoin:round"/>\
					<svg:path class="c-lineGroup--area" style="stroke:none"/>\
				</svg:g>\
				<svg:g class="c-lineGroup--gateway">';
};

cChartElement_lineGroup.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("lineGroup", cChartElement_lineGroup);