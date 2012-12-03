/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_page	= function(){};
cXULElement_page.prototype	= new cXULElement("page");
cXULElement_page.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_page.attributes	= {};
cXULElement_page.attributes.orient	= "vertical";
cXULElement_page.attributes.width	= "100%";
cXULElement_page.attributes.height	= "100%";

// Element Renders
cXULElement_page.prototype.$getTagOpen	= function() {
	var sWidth	= this.getAttribute("width"),
		sHeight	= this.getAttribute("height");
	return '<div class="xul-page' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '" style="' +
				(this.hasAttribute("width") ? 'width:' +(isNaN(sWidth) ? sWidth : sWidth + "px") : '')+ ';' +
				(this.hasAttribute("height") ? 'height:' +(isNaN(sHeight) ? sHeight : sHeight + "px") : '')+ ';' +
				(this.hasAttribute("style") ? this.getAttribute("style") : '') + '">';
};

// Element Render: close
cXULElement_page.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_page);
