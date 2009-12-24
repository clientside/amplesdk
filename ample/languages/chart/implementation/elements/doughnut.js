/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_doughnut	= function(){};
cChartElement_doughnut.prototype	= new cChartElement;

cChartElement_doughnut.prototype.$getTagOpen	= function() {
	return '<div class="c-doughnut' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
				<svg:svg class="c-doughnut--canvas" viewBox="0 0 300 300" width="300px" height="300px" xmlns:svg="http://www.w3.org/2000/svg">\
					<svg:text class="c-doughnut--label" y="30" x="150">' + this.getAttribute("label")+ '</svg:text>\
					<svg:g class="c-doughnut--gateway">';
};

cChartElement_doughnut.prototype.$getTagClose	= function() {
	return '		</svg:g>\
				</svg:svg>\
			</div>';
};

// Register Element with language
oChartNamespace.setElement("doughnut", cChartElement_doughnut);