/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_statusbar	= function(){};
cXULElement_statusbar.prototype	= new cXULElement("statusbar");
cXULElement_statusbar.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_statusbar.attributes	= {};
cXULElement_statusbar.attributes.width	= "100%";
cXULElement_statusbar.attributes.height	= "22";

// Accessibility
cXULElement_statusbar.prototype.$selectable	= false;

// Element Render: open
cXULElement_statusbar.prototype.$getTagOpen	= function() {
	return '<div class="xul-statusbar' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
};

// Element Render: close
cXULElement_statusbar.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_statusbar);
