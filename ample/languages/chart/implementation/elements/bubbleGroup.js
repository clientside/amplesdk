/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_bubbleGroup	= function(){};
cChartElement_bubbleGroup.prototype	= new cChartElement;
cChartElement_bubbleGroup.prototype.$hoverable	= true;

cChartElement_bubbleGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-bubbleGroup c-bubbleGroup_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '" xmlns:svg="http://www.w3.org/2000/svg">\
				<svg:g>\
					<svg:path class="c-bubbleGroup--path" />\
					<svg:text class="c-bubbleGroup--label" x="100" y="100" style="stroke:none">' + this.getAttribute("label")+ '</svg:text>\
				</svg:g>\
				<svg:g class="c-bubbleGroup--gateway">';
};

cChartElement_bubbleGroup.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("bubbleGroup", cChartElement_bubbleGroup);