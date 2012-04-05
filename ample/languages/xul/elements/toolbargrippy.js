/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_toolbargrippy	= function(){};
cXULElement_toolbargrippy.prototype	= new cXULElement("toolbargrippy");

// Element Render: open
cXULElement_toolbargrippy.prototype.$getTagOpen	= function() {
	return (this.parentNode instanceof cXULElement_menubar ? "<td>" : "") + '<div class="xul-toolbargrippy' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"><br /></div>';
};

cXULElement_toolbargrippy.prototype.$getTagClose	= function() {
	return this.parentNode instanceof cXULElement_menubar ? "</td>" : "";
};

// Register Element
ample.extend(cXULElement_toolbargrippy);
