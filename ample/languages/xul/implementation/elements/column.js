/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_column	= function(){};
cXULElement_column.prototype	= new cXULElement;

// Public Methods

// Element Render: open
cXULElement_column.prototype.$getTagOpen	= function()
{
    return '<th class="xul-column">' +(this.attributes["label"] ? this.attributes["label"] : '');
};

// Element Render: close
cXULElement_column.prototype.$getTagClose	= function()
{
    return '</th>';
};

// Register Element with language
oXULNamespace.setElement("column", cXULElement_column);
