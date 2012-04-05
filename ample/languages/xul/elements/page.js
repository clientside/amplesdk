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
	return '<div class="xul-page' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="' +
				(this.attributes["width"] ? 'width:' +(isNaN(this.attributes["width"]) ? this.attributes["width"] : this.attributes["width"] + "px") : '')+ ';' +
				(this.attributes["height"] ? 'height:' +(isNaN(this.attributes["height"]) ? this.attributes["height"] : this.attributes["height"] + "px") : '')+ ';' +
				(this.attributes["style"] ? this.attributes["style"] : '') + '">';
};

// Element Render: close
cXULElement_page.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_page);
