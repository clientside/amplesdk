/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_toolbar	= function(){};
cXULElement_toolbar.prototype	= new cXULElement;
cXULElement_toolbar.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Accessibility
cXULElement_toolbar.prototype.$selectable	= false;

// Public Methods

// Element Render: open
cXULElement_toolbar.prototype.$getTagOpen		= function()
{
    return '<div class="xul-toolbar">';
};

// Element Render: close
cXULElement_toolbar.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("toolbar", cXULElement_toolbar);
