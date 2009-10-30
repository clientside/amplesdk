/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_columns	= function(){};
cXULElement_columns.prototype	= new cXULElement;

// Public Methods

// Element Render: open
cXULElement_columns.prototype.$getTagOpen	= function()
{
    return '<thead class="xul-columns">';
};

// Element Render: close
cXULElement_columns.prototype.$getTagClose	= function()
{
    return '</thead>';
};

// Register Element with language
oXULNamespace.setElement("columns", cXULElement_columns);
