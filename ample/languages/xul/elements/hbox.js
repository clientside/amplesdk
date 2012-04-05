/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_hbox	= function(){};
cXULElement_hbox.prototype	= new cXULElement_box;
cXULElement_hbox.prototype.localName	= "hbox";

// Attributes Defaults
cXULElement_hbox.attributes	= {};
cXULElement_hbox.attributes.orient	= "horizontal";

// Register Element
ample.extend(cXULElement_hbox);
