/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_barGroup	= function(){};
cChartElement_barGroup.prototype	= new cChartElement;
cChartElement_barGroup.prototype.$hoverable	= true;

//
cChartElement_barGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-barGroup c-barGroup_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" \
				style="' + this.getAttribute("style") + '">\
				<svg:g>\
					<svg:path class="c-barGroup--path" />\
					<svg:text class="c-barGroup--label" x="100" y="100" style="stroke:none">' + this.getAttribute("label")+ '</svg:text>\
				</svg:g>\
				<svg:g class="c-barGroup--gateway">';
};

cChartElement_barGroup.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("barGroup", cChartElement_barGroup);