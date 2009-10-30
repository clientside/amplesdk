/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_toolbarseparator	= function(){};
cXULElement_toolbarseparator.prototype	= new cXULElement;

// Public Methods

// Element Render: open
cXULElement_toolbarseparator.prototype.$getTagOpen	= function()
{
    return '<div class="xul-toolbarseparator"><br /></div>';
};

// Register Element with language
oXULNamespace.setElement("toolbarseparator", cXULElement_toolbarseparator);
