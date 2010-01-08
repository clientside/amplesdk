/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_radarItem	= function(){};
cChartElement_radarItem.prototype	= new cChartElement;
cChartElement_radarItem.prototype.$hoverable	 = true;

cChartElement_radarItem.prototype.$getTagOpen	= function() {
	return '<svg:path class="c-radarItem' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" />';
};

// Register Element with language
oChartNamespace.setElement("radarItem", cChartElement_radarItem);