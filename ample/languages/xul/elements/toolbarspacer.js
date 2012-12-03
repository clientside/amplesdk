/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_toolbarspacer	= function(){};
cXULElement_toolbarspacer.prototype	= new cXULElement("toolbarspacer");

// Element Render: open
cXULElement_toolbarspacer.prototype.$getTagOpen	= function() {
	return '<div class="xul-toolbarspacer' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '"><br /></div>';
};

// Register Element
ample.extend(cXULElement_toolbarspacer);
