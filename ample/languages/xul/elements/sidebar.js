/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_sidebar	= function(){};
cXULElement_sidebar.prototype	= new cXULElement("sidebar");
cXULElement_sidebar.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_sidebar.attributes	= {};
cXULElement_sidebar.attributes.orient	= "vertical";
cXULElement_sidebar.attributes.width	= "100%";
cXULElement_sidebar.attributes.height	= "100%";

// Element Renders
cXULElement_sidebar.prototype.$getTagOpen	= function() {
	return '<div class="xul-sidebar' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="' +
				(this.attributes["style"] ? this.attributes["style"] : '') + '">';
};

// Element Render: close
cXULElement_sidebar.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_sidebar);