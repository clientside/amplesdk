/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_row	= function(){};
cXULElement_row.prototype	= new cXULElement("row");
cXULElement_row.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_row.attributes	= {};
//cXULElement_row.attributes.flex	= "1";
cXULElement_row.attributes.orient	= "horizontal";

// Element Render: open
cXULElement_row.prototype.$getTagOpen		= function() {
	return '<tr class="xul-row' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '"' +(this.hasAttribute("height") ? ' height="' + this.getAttribute("height") + '"' : '')+(this.getAttribute("hidden") == "true" ? ' style="display:none"' : '')+'>';
};

// Element Render: close
cXULElement_row.prototype.$getTagClose	= function() {
	return '</tr>';
};

// Register Element
ample.extend(cXULElement_row);
