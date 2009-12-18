/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_grid	= function()
{
    this.cols   = new AMLNodeList;
    this.rows   = new AMLNodeList;
};
cXULElement_grid.prototype	= new cXULElement;

// Attributes Defaults
cXULElement_grid.attributes	= {};
cXULElement_grid.attributes.orient	= "vertical";

// Public Methods

// Register Element with language
oXULNamespace.setElement("grid", cXULElement_grid);
