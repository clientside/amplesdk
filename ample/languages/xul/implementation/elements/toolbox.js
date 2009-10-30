/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_toolbox	= function(){};
cXULElement_toolbox.prototype	= new cXULElement;
cXULElement_toolbox.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULElement_toolbox.attributes	= {};
cXULElement_toolbox.attributes.orient	= "vertical";

// Public Methods

// Element Render: open
cXULElement_toolbox.prototype.$getTagOpen		= function()
{
    return '<div class="xul-toolbox">';
};

// Element Render: close
cXULElement_toolbox.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("toolbox", cXULElement_toolbox);
