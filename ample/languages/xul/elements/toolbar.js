/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_toolbar	= function(){};
cXULElement_toolbar.prototype	= new cXULElement("toolbar");
cXULElement_toolbar.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Accessibility
cXULElement_toolbar.prototype.$selectable	= false;

// Element Render: open
cXULElement_toolbar.prototype.$getTagOpen		= function() {
	return '<div class="xul-toolbar' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '">';
};

// Element Render: close
cXULElement_toolbar.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_toolbar);
