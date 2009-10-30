/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_toolbargrippy	= function(){};
cXULElement_toolbargrippy.prototype  = new cXULElement;

// Public Methods

// Element Render: open
cXULElement_toolbargrippy.prototype.$getTagOpen	= function()
{
    return (this.parentNode instanceof cXULElement_menubar ? "<td>" : "") + '<div class="xul-toolbargrippy"><br /></div>';
};

cXULElement_toolbargrippy.prototype.$getTagClose	= function()
{
	return this.parentNode instanceof cXULElement_menubar ? "</td>" : "";
};

// Register Element with language
oXULNamespace.setElement("toolbargrippy", cXULElement_toolbargrippy);
