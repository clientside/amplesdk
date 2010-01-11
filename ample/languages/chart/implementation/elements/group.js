/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_group	= function(){};
cChartElement_group.prototype	= new cChartElement;
cChartElement_group.prototype.$hoverable	= true;

cChartElement_group.handlers	= {
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

cChartElement_group.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-group c-group_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" \
				style="' + this.getAttribute("style") + '">\
				<svg:path class="c-group--path" />\
				<svg:path class="c-group--shadow" style="fill:none;stroke-linejoin:round" transform="translate(2, 2)"/>\
				<svg:path class="c-group--line" style="fill:none;stroke-linejoin:round"/>\
				<svg:path class="c-group--area" style="stroke:none"/>\
				<svg:text class="c-group--label" style="stroke:none">' + this.getAttribute("label")+ '</svg:text>\
				<svg:g class="c-group--gateway">';
};

cChartElement_group.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("group", cChartElement_group);