/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_statusbar	= function(){};
cXULElement_statusbar.prototype	= new cXULElement;
cXULElement_statusbar.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_statusbar.attributes	= {};
cXULElement_statusbar.attributes.width	= "100%";
cXULElement_statusbar.attributes.height	= "22";

// Accessibility
cXULElement_statusbar.prototype.$selectable	= false;

// Public Methods

// Element Render: open
cXULElement_statusbar.prototype.$getTagOpen	= function()
{
    return '<div class="xul-statusbar">';
};

// Element Render: close
cXULElement_statusbar.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("statusbar", cXULElement_statusbar);
