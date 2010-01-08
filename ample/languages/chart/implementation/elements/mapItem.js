/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_mapItem	= function(){};
cChartElement_mapItem.prototype	= new cChartElement;
cChartElement_mapItem.prototype.$hoverable	= true;

cChartElement_mapItem.prototype.$getTagOpen	= function() {
	var aValue	= this.getAttribute("value").split(',');
	return '<svg:path d="' + cChartElement_map.countries[aValue[0]][1] + '" class="c-mapItem c-mapItem-value-' + aValue[0] +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" />';
};

// Register Element with language
oChartNamespace.setElement("mapItem", cChartElement_mapItem);