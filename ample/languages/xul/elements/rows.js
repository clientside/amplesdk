/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_rows	= function(){};
cXULElement_rows.prototype	= new cXULElement("rows");
cXULElement_rows.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_rows.attributes	= {};
cXULElement_rows.attributes.height	= "100%";
cXULElement_rows.attributes.width	= "100%";
cXULElement_rows.attributes.orient	= "vertical";

// Register Element
ample.extend(cXULElement_rows);
