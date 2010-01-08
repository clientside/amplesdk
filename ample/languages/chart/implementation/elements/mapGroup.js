/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_mapGroup	= function(){};
cChartElement_mapGroup.prototype	= new cChartElement;
cChartElement_mapGroup.prototype.$hoverable	= true;

cChartElement_mapGroup.handlers	= {
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

cChartElement_mapGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-mapGroup c-mapGroup_nth-child-' + this.parentNode.childNodes.$indexOf(this) + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" \
				style="' + this.getAttribute("style") + '">\
				<svg:g>\
					<svg:path class="c-mapGroup--path" style="fill:none" />\
					<svg:text class="c-mapGroup--label" style="stroke:none">' + this.getAttribute("label")+ '</svg:text>\
				</svg:g>\
				<svg:g class="c-lineGroup--gateway">';
};

cChartElement_mapGroup.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("mapGroup", cChartElement_mapGroup);