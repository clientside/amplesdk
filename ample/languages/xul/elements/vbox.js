/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_vbox	= function(){};
cXULElement_vbox.prototype	= new cXULElement_box;
cXULElement_vbox.prototype.localName	= "vbox";

// Attributes Defaults
cXULElement_vbox.attributes	= {};
cXULElement_vbox.attributes.orient	= "vertical";

// Register Element
ample.extend(cXULElement_vbox);
