/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tooltip	= function(){};
cXULElement_tooltip.prototype	= new cXULPopupElement("tooltip");
cXULElement_tooltip.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Element Render: open
cXULElement_tooltip.prototype.$getTagOpen		= function() {
	return '<div style="display:none;position:absolute;" class="xul-tooltip' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '">';
};

// Element Render: close
cXULElement_tooltip.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_tooltip);
