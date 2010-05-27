/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cHTML5Element_table	= function(){};
cHTML5Element_table.prototype	= new cHTML5Element;

cHTML5Element_table.prototype.$getTagOpen	= function() {
	return '<div class="table' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '" style="' + (this.hasAttribute("style") ? this.getAttribute("style") : '') + (this.hasAttribute("width") ? ';width:' + this.getAttribute("width") + 'px' : '') + '">';
};

cHTML5Element_table.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element with language
oHTML5Namespace.setElement("table", cHTML5Element_table);

