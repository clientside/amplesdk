/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_toolbox	= function(){};
cXULElement_toolbox.prototype	= new cXULElement("toolbox");
cXULElement_toolbox.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULElement_toolbox.attributes	= {};
cXULElement_toolbox.attributes.orient	= "vertical";

// Element Render: open
cXULElement_toolbox.prototype.$getTagOpen		= function() {
	return '<div class="xul-toolbox' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '">';
};

// Element Render: close
cXULElement_toolbox.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_toolbox);
