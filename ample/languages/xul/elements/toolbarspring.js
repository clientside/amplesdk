/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_toolbarspring	= function(){};
cXULElement_toolbarspring.prototype	= new cXULElement("toolbarspring");

// Attributes Defaults
cXULElement_toolbarspring.attributes	= {};
cXULElement_toolbarspring.attributes.flex	= "1";

// Element Render: open
cXULElement_toolbarspring.prototype.$getTagOpen	= function() {
	return '<div class="xul-toolbarspring' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"><br /></div>';
};

// Register Element
ample.extend(cXULElement_toolbarspring);
